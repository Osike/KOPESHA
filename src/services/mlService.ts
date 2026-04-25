
/**
 * ML Intelligence Service for Kopesha
 * Ports the logic from the Alt-Credit Scoring Python Prototype
 */

export interface ApplicantData {
  user_id: string;
  monthly_inflow: number;
  monthly_outflow: number;
  inflow_variance: number;
  transaction_count: number;
  unique_counterparties: number;
  bill_payment_advance_days: number;
  savings_consistency: number;
  airtime_regularity: number;
  sms_business_count: number;
  chama_contribution_regularity: number;
  chama_merry_go_round_completions: number;
  account_age_months: number;
}

export interface MLResult {
  repayment_probability: number;
  credit_score: number;
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH';
  recommended_loan_limit_kes: number;
  decision: 'APPROVE' | 'REFER';
  explanation: string;
  top_risk_factors: string[];
  top_strengths: string[];
}

const FEATURE_FRIENDLY_NAMES: Record<string, string> = {
  cashflow_ratio: "spending vs income ratio",
  net_savings: "monthly savings amount",
  income_stability_score: "income stability",
  network_density_score: "trusted network size",
  liquidity_score: "income retained after expenses",
  bill_payment_score: "bill payment punctuality",
  behavioral_composite: "savings & airtime consistency",
  chama_strength_score: "Chama contribution record",
  account_maturity_score: "length of financial history",
  transaction_activity_score: "transaction activity level",
};

export const calculateCreditScore = (data: ApplicantData): MLResult => {
  // 1. Feature Engineering
  const cashflow_ratio = Math.min(2, data.monthly_outflow / (data.monthly_inflow || 1));
  const net_savings = Math.max(0, data.monthly_inflow - data.monthly_outflow);
  const liquidity_score = Math.min(1, net_savings / (data.monthly_inflow || 1));
  const income_stability_score = Math.max(0, Math.min(1, 1 - (data.inflow_variance / (data.monthly_inflow || 1))));
  const network_density_score = Math.min(1, data.unique_counterparties / (data.transaction_count || 1));
  const bill_payment_score = Math.max(0, Math.min(1, (data.bill_payment_advance_days + 5) / 19));
  
  const behavioral_composite = (
    0.40 * data.savings_consistency +
    0.35 * data.airtime_regularity +
    0.25 * Math.min(1, data.sms_business_count / 60)
  );

  const chama_strength_score = (
    0.50 * data.chama_contribution_regularity +
    0.50 * Math.min(1, data.chama_merry_go_round_completions / 8)
  );

  const account_maturity_score = Math.min(1, data.account_age_months / 84);

  // 2. Risk Calculation (Weighted Logic from Python Prototype)
  const weightedRisk = (
    0.30 * cashflow_ratio +
    0.25 * (1 - data.savings_consistency) +
    0.25 * (1 - data.chama_contribution_regularity) +
    0.10 * (1 - income_stability_score) +
    0.10 * (1 - data.airtime_regularity)
  );

  // Add a bit of natural variance
  const noise = (Math.random() - 0.5) * 0.05;
  const finalRisk = Math.max(0, Math.min(1, weightedRisk + noise));
  
  // Repayment Probability is inverse of risk
  const repayment_probability = 1 - finalRisk;
  
  // 3. Mapping to Outputs
  const credit_score = Math.round(300 + repayment_probability * 550);
  
  let risk_level: 'LOW' | 'MEDIUM' | 'HIGH';
  if (repayment_probability > 0.70) risk_level = 'LOW';
  else if (repayment_probability > 0.45) risk_level = 'MEDIUM';
  else risk_level = 'HIGH';

  const multiplier = risk_level === 'LOW' ? 2.0 : risk_level === 'MEDIUM' ? 1.0 : 0;
  const recommended_loan_limit_kes = Math.round((data.monthly_inflow * multiplier) / 500) * 500;

  // 4. Explainability (SHAP Simulation)
  const contributions = [
    { name: 'chama_strength_score', val: (data.chama_contribution_regularity - 0.5) * -0.3 },
    { name: 'income_stability_score', val: (income_stability_score - 0.5) * -0.2 },
    { name: 'bill_payment_score', val: (bill_payment_score - 0.5) * -0.15 },
    { name: 'cashflow_ratio', val: (cashflow_ratio - 1) * 0.25 },
  ];

  const top_strengths: string[] = [];
  const top_risk_factors: string[] = [];

  contributions.sort((a, b) => Math.abs(b.val) - Math.abs(a.val)).forEach(c => {
    const friendly = FEATURE_FRIENDLY_NAMES[c.name] || c.name;
    if (c.val < -0.05) top_strengths.push(`Your ${friendly} supports repayment`);
    if (c.val > 0.05) top_risk_factors.push(`Your ${friendly} increases default risk`);
  });

  const explanation = risk_level === 'LOW' 
    ? `Approved. Key positive factors: ${top_strengths.slice(0, 2).join('; ') || 'stable profile'}.` 
    : `Manual review needed. Primary concerns: ${top_risk_factors.slice(0, 2).join('; ') || 'limited history'}.`;

  return {
    repayment_probability,
    credit_score,
    risk_level,
    recommended_loan_limit_kes,
    decision: risk_level === 'HIGH' ? 'REFER' : 'APPROVE',
    explanation,
    top_risk_factors,
    top_strengths
  };
};

export const generateMockApplicant = (id: string): ApplicantData => ({
  user_id: id,
  monthly_inflow: 45000 + (Math.random() * 20000),
  monthly_outflow: 32000 + (Math.random() * 10000),
  inflow_variance: 5000 + (Math.random() * 5000),
  transaction_count: 50 + Math.floor(Math.random() * 50),
  unique_counterparties: 15 + Math.floor(Math.random() * 20),
  bill_payment_advance_days: Math.floor(Math.random() * 10) - 2,
  savings_consistency: 0.6 + (Math.random() * 0.4),
  airtime_regularity: 0.7 + (Math.random() * 0.3),
  sms_business_count: Math.floor(Math.random() * 40),
  chama_contribution_regularity: 0.8 + (Math.random() * 0.2),
  chama_merry_go_round_completions: Math.floor(Math.random() * 5),
  account_age_months: 12 + Math.floor(Math.random() * 48),
});
