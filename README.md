# ClearGov — Explainable Civic Decision Platform

> **"Public services should explain themselves."**  
> A modern civic-tech web application that turns bureaucratic public-service determinations into transparent, verified decisions.

[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vercel Deployment](https://img.shields.io/badge/Live%20Demo-cleargov--chi.vercel.app-000000?logo=vercel&logoColor=white)](https://cleargov-chi.vercel.app)

**Live Production URL:** [https://cleargov-chi.vercel.app](https://cleargov-chi.vercel.app)


---

## 🏛️ Why ClearGov?

Traditional public service portals are black boxes: applicants upload a pile of documents, wait weeks or months, and receive an opaque rejection or generic letter with no recourse.

**ClearGov is NOT a document upload repository.** It is a deterministic, explainable civic decision engine built on a transparent chain:

$$\text{Information} \longrightarrow \text{Evidence} \longrightarrow \text{Assessment} \longrightarrow \text{Explanation} \longrightarrow \text{Decision} \longrightarrow \text{Next Action}$$

---

## ⚖️ The Core Rule: Strict Non-Conflation

The ClearGov statutory assessment engine is governed by two immutable civic principles:
1. **Missing or unreadable evidence must NEVER become `CONDITION NOT SATISFIED`.**
   *(An applicant who uploaded a blurred scan is not disqualified; they simply require additional legible evidence).*
2. **A clearly failed condition must NEVER become `ADDITIONAL EVIDENCE REQUIRED`.**
   *(An applicant whose verified income objectively exceeds statutory caps cannot be stalled in document requests; the condition is conclusively not satisfied).*

---

## 🎯 The 4 Strict Final Outcomes

Every evaluation on ClearGov terminates in one of **strictly four** legal outcomes:

| Outcome Badge | Meaning & Statutory Standard |
|---|---|
| 🟢 **SUFFICIENT EVIDENCE** | All required conditions are established by credible, verified evidence. |
| 🔴 **CONDITION NOT SATISFIED** | Reliable, authenticated evidence proves a required condition is not met. |
| 🟡 **ADDITIONAL EVIDENCE REQUIRED** | Required evidence is missing, incomplete, unreadable, or insufficient. |
| 🟣 **HUMAN REVIEW REQUIRED** | Conflicting or ambiguous evidence requires authorized human confirmation. |

---

## 🔬 Diagnostic Requirement Findings

For every statutory condition, ClearGov assesses the interplay between declared information and submitted evidence to identify:
- `ESTABLISHED`
- `NOT SATISFIED`
- `MISSING`
- `INCOMPLETE`
- `UNREADABLE`
- `CONTRADICTORY`
- `REQUIRES HUMAN CONFIRMATION`

Every finding generates a full **Reasoning Chain**:
$$\text{Requirement} \longrightarrow \text{Evidence Examined} \longrightarrow \text{Finding} \longrightarrow \text{Explanation} \longrightarrow \text{Sub-Outcome}$$

---

## 🌐 5 Supported Public Services

ClearGov is designed with reusable civic components supporting diverse social security programs:

1. **Merit & Need Scholarship**: Evaluates cumulative GPA, per-capita household income, and active matriculation against state educational grant statutes.
2. **Housing Assistance**: Verifies rent burden ratios (> 40%), lease contracts, and Area Median Income (AMI) ceilings for emergency tenant relief.
3. **Direct Income Support**: Assesses subsistence income thresholds, essential expense burdens, and liquid asset limitations ($2,000 safety cap).
4. **Healthcare Assistance**: Detects insurance coverage gaps, chronic medical diagnoses, and clinical necessity for underinsured patients.
5. **Education Fee Waiver**: Assesses bursar billing tuition burden (> 18% of household income) for state university tuition waivers.

---

## 🚀 4 Hackathon Benchmark Journeys (1-Click Evaluation)

ClearGov includes four pre-seeded end-to-end benchmark scenarios covering **all four** statutory outcomes:

1. **Maria Chen** (`Scholarship`) $\rightarrow$ 🟢 **SUFFICIENT EVIDENCE**  
   *Verified 3.82 GPA transcript, IRS tax transcript, and 15-credit full-time enrollment.*
2. **Marcus Vance** (`Housing Assistance`) $\rightarrow$ 🔴 **CONDITION NOT SATISFIED**  
   *Verified payroll records show $54,000/yr income, exceeding the statutory 60% AMI ceiling ($38,500).*
3. **Elena Rostova** (`Income Support`) $\rightarrow$ 🟡 **ADDITIONAL EVIDENCE REQUIRED**  
   *Bank statement is blurry/unreadable (72 DPI scan) and State Tax Declaration is missing.*
4. **David K. Miller** (`Healthcare Assistance`) $\rightarrow$ 🟣 **HUMAN REVIEW REQUIRED**  
   *Applicant self-reported as "Uninsured", but submitted employer severance document indicates active group health plan through Q3.*

---

## 🛡️ Dedicated Reviewer Workspace

ClearGov features a dedicated caseworker workspace for civic adjudicators:
- **Caseworker Inbox**: Queues applications flagged as `HUMAN REVIEW REQUIRED` or `ADDITIONAL EVIDENCE REQUIRED`.
- **Case Audit Chain**: Inspects Applicant Details $\rightarrow$ Submitted Evidence $\rightarrow$ Statutory Requirements $\rightarrow$ Detected Discrepancy $\rightarrow$ System Reasoning.
- **Authoritative Actions**:
  - **Confirm Requirement Satisfied** $\rightarrow$ Transition to `SUFFICIENT EVIDENCE`
  - **Confirm Requirement Not Satisfied** $\rightarrow$ Transition to `CONDITION NOT SATISFIED`
  - **Request Additional Evidence** $\rightarrow$ Transition to `ADDITIONAL EVIDENCE REQUIRED`
- **Audit Trail**: Every action logs the case officer's name, timestamp, and legal justification notes.

---

## 🛠️ Tech Stack & Design System

- **Framework**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS (calm zinc/slate neutrals, restrained teal accent, high-contrast typography)
- **Micro-Interactions**: Framer Motion
- **Icons**: Lucide React
- **Design Principles**:
  - Linear meets GOV.UK: modern 2026 civic-tech startup feel.
  - Zero chatbot bubbles, zero glassmorphism, zero meaningless animations, zero AI-slop.
  - Evidence-to-decision relationship is the visual hero.

---

## 🏁 Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Build production bundle
npm run build
```

Open `http://localhost:5173` in your browser.
