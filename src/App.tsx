import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  Users, 
  LayoutDashboard, 
  UserCircle, 
  ShieldCheck, 
  Settings, 
  HelpCircle, 
  LogOut, 
  Bell, 
  Wallet,
  Search,
  TrendingUp,
  History,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  CheckCircle2,
  Info,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { cn } from './lib/utils';
import { calculateCreditScore, generateMockApplicant, type MLResult, type ApplicantData } from './services/mlService';

// --- Types ---
type View = 'dashboard' | 'personal' | 'chama' | 'admin' | 'settings';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning';
}

// --- Components ---

const AuthView = ({ onLogin }: { onLogin: () => void }) => {
  const [phone, setPhone] = useState('');
  const [pin, setPin] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      onLogin();
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#0a0c10] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-brand-primary/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-brand-secondary/10 rounded-full blur-3xl" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-slate-900/40 border border-slate-800 p-10 rounded-[2.5rem] backdrop-blur-xl relative z-10 text-left"
      >
        <div className="flex items-center gap-4 mb-10">
          <div className="w-12 h-12 bg-brand-primary rounded-2xl flex items-center justify-center shadow-2xl shadow-brand-primary/20">
            <TrendingUp className="text-white w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-white">Kopesha</h1>
            <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-500">Credit Intelligence</p>
          </div>
        </div>

        <div className="space-y-2 mb-8">
          <h2 className="text-2xl font-bold text-white">Welcome Back</h2>
          <p className="text-slate-500 text-sm">Securely access your behavioral credit profile.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">M-Pesa Phone Number</label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-brand-primary transition-colors">
                <Wallet className="w-4 h-4" />
              </div>
              <input 
                type="tel" 
                required
                placeholder="254 7XX XXX XXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-3.5 pl-12 pr-4 text-white focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/20 transition-all outline-none"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Secure PIN</label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-brand-primary transition-colors">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <input 
                type="password" 
                required
                placeholder="••••"
                maxLength={4}
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-3.5 pl-12 pr-4 text-white focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/20 transition-all outline-none tracking-[0.5em]"
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-brand-primary text-white font-black py-4 rounded-2xl shadow-xl shadow-brand-primary/20 hover:scale-[1.02] active:scale-95 transition-all text-sm uppercase tracking-widest disabled:opacity-50 flex items-center justify-center gap-3"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Secure Login"}
          </button>
        </form>

        <p className="mt-8 text-center text-xs text-slate-500">
          New to Kopesha? <span className="text-brand-primary font-bold cursor-pointer hover:underline">Link your Sacco account</span>
        </p>
      </motion.div>
    </div>
  );
};

const Sidebar = ({ currentView, setView, isRefreshing, onRefresh }: { 
  currentView: View, 
  setView: (v: View) => void,
  isRefreshing: boolean,
  onRefresh: () => void 
}) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'personal', label: 'Personal', icon: UserCircle },
    { id: 'chama', label: 'Chama', icon: Users },
    { id: 'admin', label: 'Admin', icon: ShieldCheck },
    { id: 'settings', label: 'Settings', icon: Settings },
  ] as const;

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-slate-900/50 border-r border-slate-800 flex flex-col z-50 backdrop-blur-xl">
      <div className="p-8 text-left">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center shadow-lg shadow-brand-primary/20">
            <TrendingUp className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight text-white">Kopesha</h1>
            <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-500">Credit Intelligence</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative",
              currentView === item.id 
                ? "bg-brand-primary text-white shadow-lg shadow-brand-primary/20" 
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            )}
          >
            <item.icon className={cn("w-5 h-5", currentView === item.id ? "text-white" : "text-slate-500 group-hover:text-white")} />
            <span className="font-semibold text-sm">{item.label}</span>
            {currentView === item.id && (
              <motion.div 
                layoutId="active-pill"
                className="absolute left-0 w-1 h-6 bg-brand-accent rounded-full -ml-4"
              />
            )}
          </button>
        ))}
      </nav>

      <div className="p-4 mt-auto border-t border-slate-800 space-y-4">
        <button 
          onClick={onRefresh}
          disabled={isRefreshing}
          className="w-full bg-slate-800 text-white py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-slate-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isRefreshing ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
          Refresh Credit Score
        </button>
        <div className="space-y-1">
          <button className="w-full flex items-center gap-3 px-4 py-2 text-slate-500 hover:text-white text-sm transition-colors text-left">
            <HelpCircle className="w-4 h-4" /> Support
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-2 text-slate-500 hover:text-red-400 text-sm transition-colors text-left">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </div>
    </aside>
  );
};

const TopBar = ({ title, addNotification, mlResult }: { 
  title: string, 
  addNotification: (n: Omit<Notification, 'id'>) => void,
  mlResult: MLResult | null 
}) => {
  return (
    <header className="fixed top-0 right-0 left-64 h-20 border-b border-slate-800 bg-[#0a0c10]/80 backdrop-blur-md flex items-center justify-between px-8 z-40">
      <div className="flex items-center gap-8">
        <h2 className="text-xl font-bold text-white tracking-tight">{title}</h2>
        <div className="hidden lg:flex items-center bg-slate-900 border border-slate-800 rounded-full px-4 py-2 gap-3 w-96 group focus-within:border-brand-primary transition-colors">
          <Search className="w-4 h-4 text-slate-500 group-focus-within:text-brand-primary" />
          <input 
            type="text" 
            placeholder="Search insights, applicants or groups..." 
            className="bg-transparent border-none focus:ring-0 text-sm text-white w-full placeholder:text-slate-600"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button 
          onClick={() => addNotification({ 
            title: 'Model Insight', 
            message: mlResult?.explanation || 'Awaiting evaluation...', 
            type: 'info' 
          })}
          className="relative p-2 text-slate-400 hover:text-white transition-colors"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-[#0a0c10]"></span>
        </button>
        <div className="flex items-center gap-3 bg-brand-primary/10 border border-brand-primary/20 rounded-full px-4 py-2">
          <Wallet className="w-4 h-4 text-brand-primary" />
          <span className="text-sm font-bold text-slate-200">
            KES {(mlResult?.recommended_loan_limit_kes || 0).toLocaleString()}
          </span>
        </div>
        <div className="flex items-center gap-3 pl-6 border-l border-slate-800">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-white">Josphat Kamau</p>
            <p className="text-[10px] text-slate-500 font-medium">KE000042</p>
          </div>
          <img 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuC18mbRsLLTCEi0foe-Lkw2vl_08CzGfSmepcXBZtpQSA1mxJq10PlcMJCT3dxZYk6TNLSZxD6t8Elwy1qhpXSJjPweWyBGPrU4_esU2sMiCVe1BbRxSVwfSkTjUvyGg5HPv-hMKrwFn0FuDku008p4oxj3pyid_wlqaVPw4zCcPwC9NyZQmxzZbSbpetYi96RfwG81k7FTWxgq1Bq8lbClYiA-Es3d1VDZ8_p2QvfXZ6J2TdC7tTjVMvTrLsupfjqlSoa0826HYw" 
            alt="Profile" 
            className="w-10 h-10 rounded-full object-cover border-2 border-slate-700" 
          />
        </div>
      </div>
    </header>
  );
};

// --- Views ---

const DashboardView = ({ mlResult, applicantData }: { mlResult: MLResult, applicantData: ApplicantData }) => {
  const dashOffset = 597 - (597 * (mlResult.credit_score - 300) / 550);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Credit Score Giant Card */}
        <div className="lg:col-span-2 bg-slate-900/40 border border-slate-800 rounded-[2rem] p-10 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8">
            <span className={cn(
              "text-[10px] px-3 py-1 rounded-full font-black tracking-widest border",
              mlResult.risk_level === 'LOW' ? "bg-brand-secondary/20 text-brand-secondary border-brand-secondary/30" :
              mlResult.risk_level === 'MEDIUM' ? "bg-orange-500/20 text-orange-400 border-orange-500/30" :
              "bg-red-500/20 text-red-400 border-red-500/30"
            )}>
              {mlResult.risk_level} RISK
            </span>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-12 relative z-10">
            <div className="relative w-56 h-56 flex items-center justify-center shrink-0">
              <svg className="w-full h-full -rotate-90">
                <circle 
                  cx="112" cy="112" r="95" 
                  className="fill-transparent stroke-slate-800 stroke-[12]"
                />
                <motion.circle 
                  cx="112" cy="112" r="95" 
                  initial={{ strokeDashoffset: 597 }}
                  animate={{ strokeDashoffset: dashOffset }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  strokeDasharray="597"
                  className={cn(
                    "fill-transparent stroke-[12] stroke-linecap-round",
                    mlResult.risk_level === 'LOW' ? "stroke-brand-secondary" : "stroke-orange-400"
                  )}
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <motion.span 
                  key={mlResult.credit_score}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-5xl font-black text-white"
                >
                  {mlResult.credit_score}
                </motion.span>
                <span className="text-sm font-bold text-brand-secondary mt-1">
                  {mlResult.risk_level === 'LOW' ? 'Excellent' : mlResult.risk_level === 'MEDIUM' ? 'Fair' : 'Poor'}
                </span>
              </div>
            </div>
            <div className="flex-1 space-y-6">
              <div className="space-y-2">
                <h3 className="text-3xl font-black text-white tracking-tight leading-tight">Intelligence Output</h3>
                <p className="text-slate-400 text-lg leading-relaxed">
                  {mlResult.explanation} Capacity for loans up to <span className="text-white font-bold">KES {mlResult.recommended_loan_limit_kes.toLocaleString()}</span>.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 text-left">Confidence</p>
                  <p className="text-lg font-bold text-white text-left">{Math.round(mlResult.repayment_probability * 100)}%</p>
                </div>
                <div className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 text-left">Monthly Inflow</p>
                  <div className="flex items-center gap-2">
                    <p className="text-lg font-bold text-white">KES {Math.round(applicantData.monthly_inflow).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Live Data Bento Box */}
        <div className="bg-brand-primary rounded-[2rem] p-8 flex flex-col justify-between shadow-2xl shadow-brand-primary/20 group cursor-default">
          <div className="flex justify-between items-start">
            <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/10">
              <TrendingUp className="text-white" />
            </div>
            <div className="px-2 py-1 bg-white/10 rounded-lg text-[10px] font-bold text-white border border-white/10 tracking-widest">ML ENGINE</div>
          </div>
          <div className="text-left">
            <p className="text-xs font-bold text-white/60 tracking-widest mb-2 uppercase">Decision Logic</p>
            <h4 className="text-4xl font-black text-white mb-2">{mlResult.decision}</h4>
            <div className="flex items-center gap-2 text-brand-accent text-sm font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Real-time Explainability Active</span>
            </div>
          </div>
          <div className="flex items-end gap-1 h-12">
            {[40, 70, 45, 90, 65, 80, 50].map((h, i) => (
              <motion.div 
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${h}%` }}
                transition={{ delay: i * 0.1 }}
                className="flex-1 bg-white/20 rounded-full"
              />
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Behavioral Signals */}
        <div className="lg:col-span-2 bg-slate-900/40 border border-slate-800 rounded-[2rem] p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-white">ML Feature Explanations</h3>
            <Info className="w-5 h-5 text-slate-500" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { label: 'Savings Logic', val: applicantData.savings_consistency * 100, color: 'bg-brand-primary', desc: 'Consistency across 4 detected saving channels' },
              { label: 'Airtime Behavioral', val: applicantData.airtime_regularity * 100, color: 'bg-brand-primary', desc: 'Steady data consumption for business work' },
              { label: 'Chama Strength', val: applicantData.chama_contribution_regularity * 100, color: 'bg-brand-secondary', desc: 'Social capital and group repayment trust' }
            ].map((sig, i) => (
              <div key={i} className="space-y-4 group text-left">
                <div className="flex justify-between items-end">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{sig.label}</span>
                  <span className="text-sm font-bold text-white">{Math.round(sig.val)}%</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden p-0.5">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${sig.val}%` }}
                    className={cn("h-full rounded-full shadow-lg", sig.color)}
                  />
                </div>
                <p className="text-[11px] text-slate-500 leading-tight italic">{sig.desc}.</p>
              </div>
            ))}
          </div>
        </div>

        {/* Action Hub */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 p-8 rounded-[2rem] flex flex-col justify-between text-left">
           <div>
             <h3 className="text-xl font-black text-white mb-2 leading-tight">Ready to Fund?</h3>
             <p className="text-slate-400 text-sm leading-relaxed">
               {mlResult.decision === 'APPROVE' 
                 ? `Applicant is pre-approved for KES ${mlResult.recommended_loan_limit_kes.toLocaleString()} based on ML explainability.`
                 : "Model flags several behavioral risks. Manual officer intervention required."}
             </p>
           </div>
           <div className="space-y-3 mt-6">
              <button className="w-full bg-white text-slate-950 font-black py-4 rounded-2xl text-sm shadow-xl hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest">
                Disburse Loan
              </button>
              <button className="w-full bg-slate-800/50 border border-slate-700 text-white font-bold py-4 rounded-2xl text-sm hover:bg-slate-700 transition-all uppercase tracking-widest">
                SHAP Detail Report
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

const PersonalView = ({ mlResult }: { mlResult: MLResult }) => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 text-left">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
           <span className="bg-brand-secondary/20 text-brand-secondary text-[10px] px-3 py-1 rounded-full font-black tracking-widest border border-brand-secondary/30 mb-4 inline-block tracking-[0.2em]">300 - 850: INTELLIGENCE</span>
           <h1 className="text-4xl font-black text-white tracking-tight">Josphat Kamau</h1>
           <p className="text-slate-400 mt-2">Financial explainability — Updated: {new Date().toLocaleTimeString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900/40 border border-slate-800 rounded-[2rem] p-8 flex flex-col items-center justify-center text-center">
          <p className="text-[10px] font-black text-slate-500 tracking-widest uppercase mb-8">Overall Credit Health</p>
          <div className="relative w-48 h-48 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90">
                <circle cx="96" cy="96" r="80" className="fill-transparent stroke-slate-800 stroke-[10]"/>
                <circle 
                  cx="96" cy="96" r="80" 
                  className={cn(
                    "fill-transparent stroke-[10] stroke-linecap-round transition-all duration-1000",
                    mlResult.risk_level === 'LOW' ? "stroke-brand-secondary" : "stroke-orange-400"
                  )}
                  strokeDasharray="502" 
                  strokeDashoffset={502 - (502 * (mlResult.credit_score - 300) / 550)}
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-4xl font-black text-white">{mlResult.credit_score}</span>
                <span className="text-xs font-bold text-brand-secondary mt-1 uppercase tracking-widest">{mlResult.risk_level}</span>
              </div>
          </div>
        </div>

        <div className="bg-slate-900/40 border border-slate-800 rounded-[2rem] p-8">
           <div className="flex items-center gap-3 mb-8">
             <div className="p-2 bg-brand-secondary/10 rounded-lg">
               <ShieldCheck className="text-brand-secondary w-6 h-6" />
             </div>
             <h3 className="text-xl font-bold text-white">ML Strengths</h3>
           </div>
           <ul className="space-y-6">
             {mlResult.top_strengths.length > 0 ? mlResult.top_strengths.map((str, i) => (
                <li key={i} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center shrink-0 border border-slate-700">
                    <TrendingUp className="text-brand-secondary w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-white text-sm">Feature {i + 1}</p>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">{str}</p>
                  </div>
                </li>
             )) : (
               <p className="text-slate-500 italic text-sm">Identifying behavioral strengths...</p>
             )}
           </ul>
        </div>

        <div className="bg-slate-900/40 border border-slate-800 rounded-[2rem] p-8">
           <div className="flex items-center gap-3 mb-8">
             <div className="p-2 bg-red-400/10 rounded-lg">
               <AlertTriangle className="text-red-400 w-6 h-6" />
             </div>
             <h3 className="text-xl font-bold text-white">Risk Explainers</h3>
           </div>
           <ul className="space-y-6 text-left">
             {mlResult.top_risk_factors.length > 0 ? mlResult.top_risk_factors.map((risk, i) => (
               <li key={i} className="flex items-start gap-4">
                 <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center shrink-0 border border-slate-700">
                   <AlertTriangle className="text-red-400 w-5 h-5" />
                 </div>
                 <div>
                   <p className="font-bold text-white text-sm">Observation {i + 1}</p>
                   <p className="text-xs text-slate-400 mt-1 leading-relaxed">{risk}</p>
                 </div>
               </li>
             )) : (
               <li className="flex items-start gap-4">
                 <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center shrink-0 border border-slate-700">
                   <ShieldCheck className="text-brand-secondary w-5 h-5" />
                 </div>
                 <div>
                   <p className="font-bold text-white text-sm">Isolated Profile</p>
                   <p className="text-xs text-slate-500 mt-1 leading-relaxed">No critical behavioral anomalies detected at this tier.</p>
                 </div>
               </li>
             )}
           </ul>
        </div>
      </div>
    </div>
  );
};

const ChamaView = () => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-slate-900/40 border border-slate-800 rounded-[2rem] p-10 flex flex-col md:flex-row items-center justify-between gap-10">
        <div className="text-center md:text-left space-y-4 max-w-lg">
           <h1 className="text-4xl font-black text-white tracking-tight">Tumaini Women Group</h1>
           <p className="text-slate-400 text-lg leading-relaxed">
             Group score based on member consistency and social capital across the Central Region.
           </p>
           <div className="flex flex-wrap gap-4 pt-4">
             <div className="px-4 py-2 bg-brand-secondary/10 border border-brand-secondary/20 rounded-full text-brand-secondary text-sm font-bold">
               High Trust Score
             </div>
             <div className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-full text-slate-300 text-sm font-bold uppercase tracking-widest">
               12 MEMBERS
             </div>
           </div>
        </div>
        <div className="shrink-0 scale-110">
           <div className="relative w-48 h-48 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90">
                <circle cx="96" cy="96" r="80" className="fill-transparent stroke-slate-800 stroke-[10]"/>
                <circle cx="96" cy="96" r="80" className="fill-transparent stroke-brand-secondary stroke-[10]" strokeDasharray="502" strokeDashoffset="100"/>
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-5xl font-black text-white">82</span>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">GROUP TRUST</span>
              </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900/40 border border-slate-800 rounded-[2rem] p-8">
           <h3 className="text-xl font-bold text-white mb-8">Member Risk Indicators</h3>
           <div className="space-y-2">
             {[
               { name: 'Mary Wanjiku', role: 'Chairperson', score: 842, risk: 'LOW' },
               { name: 'Jane Njeri', role: 'Treasurer', score: 798, risk: 'LOW' },
               { name: 'Sarah Muthoni', role: 'Member', score: 645, risk: 'MEDIUM' },
               { name: 'Alice Kamau', role: 'Member', score: 782, risk: 'LOW' },
             ].map((member, i) => (
               <div key={i} className="flex items-center justify-between p-4 bg-slate-950/30 rounded-2xl border border-slate-800/50 hover:border-slate-700 transition-colors">
                 <div className="flex items-center gap-4">
                   <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center font-bold text-brand-primary">
                     {member.name.split(' ').map(n => n[0]).join('')}
                   </div>
                   <div>
                     <p className="font-bold text-white text-sm">{member.name}</p>
                     <p className="text-[10px] text-slate-500 uppercase tracking-widest">{member.role}</p>
                   </div>
                 </div>
                 <div className="text-right">
                   <span className={cn(
                     "text-[9px] font-black px-2 py-0.5 rounded-full border",
                     member.risk === 'LOW' ? "bg-brand-secondary/10 text-brand-secondary border-brand-secondary/20" : "bg-orange-500/10 text-orange-400 border-orange-500/20"
                   )}>{member.risk} RISK</span>
                   <p className="text-[11px] font-bold text-slate-500 mt-1">{member.score} pts</p>
                 </div>
               </div>
             ))}
           </div>
           <button className="w-full mt-6 py-3 text-slate-400 font-bold hover:text-white transition-colors text-sm">View All 12 Members</button>
        </div>

        <div className="bg-brand-primary-container/20 border border-brand-primary/30 p-10 rounded-[2.5rem] flex flex-col justify-between relative overflow-hidden group">
           <div className="absolute -top-12 -right-12 w-48 h-48 bg-brand-primary/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
           <div className="relative z-10">
             <div className="w-16 h-16 bg-white/5 rounded-[1.5rem] flex items-center justify-center backdrop-blur-xl border border-white/10 mb-6">
                <CreditCard className="text-white w-8 h-8" />
             </div>
             <h3 className="text-3xl font-black text-white mb-4 leading-tight">Unlock Group Financing</h3>
             <p className="text-slate-300 text-lg leading-relaxed max-w-md">
               Based on 'Tumaini' High Trust score, the group qualifies for instant SACCO-backed loans up to <span className="text-white font-bold">KES 2.5M</span>.
             </p>
           </div>
           <button className="relative z-10 mt-10 bg-brand-secondary text-white px-10 py-5 rounded-2xl text-lg font-black shadow-2xl shadow-brand-secondary/30 flex items-center justify-center gap-4 group/btn hover:scale-[1.02] active:scale-95 transition-all">
             Apply for Group Loan <ArrowRight className="w-6 h-6 group-hover/btn:translate-x-2 transition-transform" />
           </button>
        </div>
      </div>
    </div>
  );
};

const AdminView = () => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Scored', val: '12,450', sub: '+12% vs last month', icon: LayoutDashboard },
          { label: 'Avg Score', val: '612', progress: 68, icon: TrendingUp },
          { label: 'Default Rate', val: '4.2%', sub: 'Target: 4.5%', icon: AlertTriangle, status: 'Within Margin', statusOk: true },
        ].map((met, i) => (
          <div key={i} className={cn("bg-slate-900/40 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between", i === 2 && "md:col-span-2")}>
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{met.label}</span>
              <met.icon className="w-4 h-4 text-slate-600" />
            </div>
            <div className="mt-4">
              <h4 className="text-3xl font-black text-white">{met.val}</h4>
              {met.sub && <p className="text-[10px] font-bold text-slate-500 mt-1">{met.sub}</p>}
              {met.progress && (
                <div className="mt-3">
                  <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-orange-400 w-[68%]" />
                  </div>
                  <p className="text-[9px] font-black text-slate-500 mt-2 uppercase tracking-widest">LEVEL: WARNING ORANGE</p>
                </div>
              )}
              {met.status && (
                <div className="mt-3 flex items-center gap-2">
                  <CheckCircle2 className="w-3 h-3 text-brand-secondary" />
                  <span className="text-[10px] font-bold text-brand-secondary uppercase tracking-widest">{met.status}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-slate-900/40 border border-slate-800 rounded-3xl overflow-hidden">
        <div className="p-8 border-b border-slate-800 flex justify-between items-center bg-slate-900/20">
          <div>
            <h3 className="text-xl font-bold text-white">Auditable Decision Trail</h3>
            <p className="text-xs text-slate-500 mt-1">Recent automated credit decisions and manual overrides</p>
          </div>
          <button className="text-brand-primary font-bold text-sm hover:underline">Export CSV</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/50 text-[10px] text-slate-500 font-black uppercase tracking-widest">
                <th className="p-6">Applicant</th>
                <th className="p-6">Decision</th>
                <th className="p-6">Score</th>
                <th className="p-6">Confidence</th>
                <th className="p-6">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {[
                { id: 'USR-8829', name: 'Uchumi Kibera', dec: 'Approved', score: 742, conf: 94 },
                { id: 'USR-7712', name: 'Merchant Pro', dec: 'Rejected', score: 312, conf: 88, risk: true },
                { id: 'USR-9001', name: 'Akinyi Maitha', dec: 'Manual', score: 588, conf: 42, manual: true },
              ].map((row, i) => (
                <tr key={i} className="hover:bg-slate-800/30 transition-colors">
                  <td className="p-6">
                    <p className="font-bold text-white text-sm">{row.id}</p>
                    <p className="text-[10px] text-slate-500">{row.name}</p>
                  </td>
                  <td className="p-6">
                    <span className={cn(
                      "px-2 py-0.5 rounded text-[10px] font-black uppercase border",
                      row.dec === 'Approved' ? "bg-brand-secondary/10 text-brand-secondary border-brand-secondary/20" : 
                      row.manual ? "bg-brand-primary/10 text-brand-primary border-brand-primary/20" :
                      "bg-red-400/10 text-red-400 border-red-400/20"
                    )}>{row.dec}</span>
                  </td>
                  <td className="p-6 font-bold text-white">{row.score}</td>
                  <td className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-1 bg-slate-800 rounded-full overflow-hidden">
                        <div className={cn("h-full", row.risk ? "bg-red-400" : "bg-brand-secondary")} style={{ width: `${row.conf}%` }} />
                      </div>
                      <span className="text-[10px] font-bold text-slate-400">{row.conf}%</span>
                    </div>
                  </td>
                  <td className="p-6 text-[10px] font-bold text-slate-500 uppercase">{i + 2} mins ago</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// --- App Container ---

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setView] = useState<View>('dashboard');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Initial Applicant & Result
  const [applicant, setApplicant] = useState<ApplicantData>(() => generateMockApplicant('KE000042'));
  const [mlResult, setMlResult] = useState<MLResult>(() => calculateCreditScore(applicant));

  const addNotification = (n: Omit<Notification, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    setNotifications(prev => [{ ...n, id }, ...prev]);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate API/Model Latency
    setTimeout(() => {
      const newApplicant = generateMockApplicant('KE000042');
      const newResult = calculateCreditScore(newApplicant);
      setApplicant(newApplicant);
      setMlResult(newResult);
      setIsRefreshing(false);
      
      addNotification({
        title: 'Score Updated',
        message: `New Credit Score: ${newResult.credit_score}. Risk Level: ${newResult.risk_level}`,
        type: newResult.risk_level === 'HIGH' ? 'warning' : 'success'
      });
    }, 2000);
  };

  useEffect(() => {
    if (!isAuthenticated) return;
    // Initial welcome notification
    setTimeout(() => {
      addNotification({
        title: 'Welcome to Kopesha',
        message: 'Your dashboard is up to date based on latest behavioral signals.',
        type: 'success'
      });
    }, 1500);
  }, [isAuthenticated]);

  const viewTitles: Record<View, string> = {
    dashboard: 'Kopesha Dashboard',
    personal: 'Financial Profile',
    chama: 'Chama Intelligence',
    admin: 'Admin & Audit Panel',
    settings: 'Platform Settings'
  };

  if (!isAuthenticated) {
    return <AuthView onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-[#0a0c10] text-slate-200 selection:bg-brand-primary/30">
      <Sidebar 
        currentView={currentView} 
        setView={setView} 
        isRefreshing={isRefreshing}
        onRefresh={handleRefresh}
      />
      <TopBar 
        title={viewTitles[currentView]} 
        addNotification={addNotification} 
        mlResult={mlResult}
      />

      <main className="pl-64 pt-20">
        <div className="p-10 max-w-7xl mx-auto">
          {currentView === 'dashboard' && <DashboardView mlResult={mlResult} applicantData={applicant} />}
          {currentView === 'personal' && <PersonalView mlResult={mlResult} />}
          {currentView === 'chama' && <ChamaView />}
          {currentView === 'admin' && <AdminView />}
          {currentView === 'settings' && (
            <div className="flex items-center justify-center h-96 text-slate-500 flex-col gap-4">
              <Settings className="w-12 h-12" />
              <p className="font-bold tracking-widest uppercase text-xs">Settings coming soon</p>
            </div>
          )}
        </div>
      </main>

      {/* Notifications Toast System */}
      <div className="fixed bottom-8 right-8 z-[100] space-y-4 max-w-sm w-full">
        <AnimatePresence>
          {notifications.map((n) => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, x: 20, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.95 }}
              className={cn(
                "p-4 rounded-2xl border shadow-2xl backdrop-blur-xl flex items-start gap-4 cursor-pointer group",
                n.type === 'success' ? "bg-brand-secondary/10 border-brand-secondary/30" : 
                n.type === 'warning' ? "bg-yellow-500/10 border-yellow-500/30" :
                "bg-brand-primary/10 border-brand-primary/30"
              )}
              onClick={() => removeNotification(n.id)}
            >
              <div className="mt-1">
                {n.type === 'success' && <CheckCircle2 className="w-5 h-5 text-brand-secondary" />}
                {n.type === 'info' && <Bell className="w-5 h-5 text-brand-primary" />}
                {n.type === 'warning' && <AlertTriangle className="w-5 h-5 text-yellow-500" />}
              </div>
              <div className="flex-1">
                <h5 className="font-bold text-white text-sm">{n.title}</h5>
                <p className="text-xs text-slate-400 mt-1 leading-normal">{n.message}</p>
              </div>
              <button className="text-slate-600 group-hover:text-white transition-colors">
                <LayoutDashboard className="w-3 h-3 rotate-45" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
