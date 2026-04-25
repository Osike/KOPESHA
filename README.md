<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Kopesha: AI for Finance

Kopesha is a lightweight AI for finance prototype focused on alternative credit scoring for side-hustles and Chamas. It uses simulated behavioral and business signals such as M-Pesa-style transaction patterns, savings consistency, airtime regularity, bill-payment habits, and SMS business records to estimate creditworthiness and suggest a loan limit.

The goal is to show how lenders and community finance groups can make faster, more inclusive decisions when traditional credit histories are thin or missing.

## What This Prototype Demonstrates

The app shows an end-to-end credit-intelligence workflow:

- A secure login and dashboard experience for an individual borrower or Chama member.
- A scoring engine that turns alternative data into a credit score, repayment probability, and risk level.
- Explainable outputs that highlight the main strengths and risks behind each recommendation.
- Separate views for personal, Chama, and admin-style monitoring so the same model can support different stakeholders.

## Problem Statement

Many informal businesses and rotating savings groups generate evidence of financial discipline outside formal bank statements. Those signals are usually ignored by traditional underwriting, which makes it harder for side-hustles and Chamas to access fair credit.

Kopesha explores a simpler path: combine alternative data into a practical decision layer that can support responsible lending while keeping the experience easy to understand.

## Architecture

This demo is intentionally lightweight and client-side first:

- Frontend: React 19 + Vite + TypeScript.
- UI system: Tailwind CSS with animated components from Motion and visualizations from Recharts.
- Scoring logic: a deterministic heuristic model in [src/services/mlService.ts](src/services/mlService.ts) that computes risk from the applicant profile.
- Data generation: mock applicant profiles in [src/services/mlService.ts](src/services/mlService.ts) to simulate real-world alternative data.
- Configuration: Vite exposes `GEMINI_API_KEY` from the environment for future Gemini-based integrations.

The current build is a prototype, so the model runs locally in the browser experience rather than depending on a separate backend service.

## Scoring Inputs

The prototype currently uses these signals:

- Monthly inflow and outflow.
- Inflow variance as a proxy for income stability.
- Transaction volume and unique counterparties.
- Bill payment advance days.
- Savings consistency.
- Airtime regularity.
- SMS business activity.
- Chama contribution regularity.
- Chama merry-go-round completions.
- Account age.

## Outputs

For each applicant, the model returns:

- Repayment probability.
- Credit score.
- Risk level: `LOW`, `MEDIUM`, or `HIGH`.
- Recommended loan limit in KES.
- Decision: `APPROVE` or `REFER`.
- Human-readable strengths and risk factors to support explainability.

## Run Locally

**Prerequisites:** Node.js 18 or newer.


1. Install dependencies:
   `npm install`
2. Create a `.env.local` file if you want to enable Gemini-backed features later, and add your API key:
   `GEMINI_API_KEY="your_key_here"`
3. Start the development server:
   `npm run dev`
4. Open the app in your browser at the local Vite URL shown in the terminal.

## Build And Verify

To check that the project compiles cleanly:

`npm run build`

To run the TypeScript check only:

`npm run lint`

## Why This Approach

The prototype intentionally uses a lightweight scoring engine instead of a heavy training pipeline. That makes the system easy to demo, easy to explain, and fast to iterate on while still showing how alternative data can improve access to credit.

It is a good fit for hackathons or product demos because the architecture is simple enough to understand at a glance, but still leaves room to swap in a real ML service later.

## Notes

- The current applicants are simulated, so the dashboard is safe to demo without real customer data.
- The scoring logic is designed for explainability rather than production underwriting.
- If you extend the project, the best next step is to replace the mock data generator with real transaction and business-record ingestion.
