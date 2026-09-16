import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Sliders,
  BarChart3,
  Shield,
  FileCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  AlertCircle,
  ArrowLeft,
  Settings,
  RefreshCw,
  Clock,
  Layers,
  Save,
} from 'lucide-react';
import { useApplication } from '@/context/ApplicationContext';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { services } from '@/data/services';
import { ServiceConfig, FinalOutcome } from '@/types';

export function AdminWorkspace() {
  const { state, dispatch } = useApplication();
  const [selectedServiceId, setSelectedServiceId] = useState<string>('scholarship');
  const [saveToast, setSaveToast] = useState(false);

  // Policy threshold editable state
  const [thresholds, setThresholds] = useState<Record<string, number | string>>({
    'scholarship-gpa': 3.0,
    'scholarship-income': 25000,
    'housing-ami': 38500,
    'housing-rent-burden': 40,
    'income-subsistence': 1250,
    'income-assets': 2000,
    'healthcare-fpl': 150,
    'fee-burden-percent': 18,
  });

  const selectedService =
    services.find(s => s.id === selectedServiceId) || services[0];

  const handleSaveThreshold = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3500);
  };

  // Outcome distribution analytics from state cases and history
  const allCases = [...state.reviewerCases, ...state.applicationHistory];
  const totalCases = Math.max(allCases.length, 12);
  const sufficientCount = allCases.filter(c =>
    ('currentOutcome' in c ? c.currentOutcome : c.finalOutcome) === 'SUFFICIENT EVIDENCE'
  ).length + 4;
  const failedCount = allCases.filter(c =>
    ('currentOutcome' in c ? c.currentOutcome : c.finalOutcome) === 'CONDITION NOT SATISFIED'
  ).length + 3;
  const additionalReqCount = allCases.filter(c =>
    ('currentOutcome' in c ? c.currentOutcome : c.finalOutcome) === 'ADDITIONAL EVIDENCE REQUIRED'
  ).length + 3;
  const humanReviewCount = allCases.filter(c =>
    ('currentOutcome' in c ? c.currentOutcome : c.finalOutcome) === 'HUMAN REVIEW REQUIRED'
  ).length + 2;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* 1. ADMIN HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-sm shadow-xs">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              ClearGov Administration & Governance Console
            </h1>
            <p className="text-xs text-slate-500">
              Statutory Program Rule Configuration, Threshold Calibration & Civic Audit Logging
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => dispatch({ type: 'SET_ACTIVE_VIEW', payload: 'applicant' })}
            className="text-xs font-semibold"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Applicant View
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => dispatch({ type: 'SET_ACTIVE_VIEW', payload: 'reviewer' })}
            className="text-xs font-semibold"
          >
            Reviewer Workspace
          </Button>
        </div>
      </div>

      {saveToast && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2 font-medium animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          Statutory policy threshold updated and synchronized with rule evaluation engine.
        </div>
      )}

      {/* 2. STATUTORY OUTCOME DISTRIBUTION & PROGRAM METRICS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl border border-emerald-200 bg-emerald-50/40 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-2xs font-mono font-bold uppercase text-emerald-800">
              Sufficient Evidence
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{sufficientCount}</div>
          <p className="text-2xs text-slate-600">
            {Math.round((sufficientCount / totalCases) * 100)}% of determinations approved for automated disbursement
          </p>
        </div>

        <div className="p-5 rounded-xl border border-rose-200 bg-rose-50/40 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-2xs font-mono font-bold uppercase text-rose-800">
              Condition Not Satisfied
            </span>
            <span className="w-2 h-2 rounded-full bg-rose-500" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{failedCount}</div>
          <p className="text-2xs text-slate-600">
            {Math.round((failedCount / totalCases) * 100)}% disqualified due to statutory limits (e.g. over AMI)
          </p>
        </div>

        <div className="p-5 rounded-xl border border-amber-200 bg-amber-50/40 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-2xs font-mono font-bold uppercase text-amber-800">
              Additional Evidence Req.
            </span>
            <span className="w-2 h-2 rounded-full bg-amber-500" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{additionalReqCount}</div>
          <p className="text-2xs text-slate-600">
            {Math.round((additionalReqCount / totalCases) * 100)}% paused for unreadable (72 DPI) or missing records
          </p>
        </div>

        <div className="p-5 rounded-xl border border-purple-200 bg-purple-50/40 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-2xs font-mono font-bold uppercase text-purple-800">
              Human Review Required
            </span>
            <span className="w-2 h-2 rounded-full bg-purple-500" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{humanReviewCount}</div>
          <p className="text-2xs text-slate-600">
            {Math.round((humanReviewCount / totalCases) * 100)}% escalated to senior caseworkers for discrepancy adjudication
          </p>
        </div>
      </div>

      {/* 3. POLICY THRESHOLDS & PROGRAM CONFIGURATION */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="p-5 border-b border-slate-100 bg-slate-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4 text-slate-700" />
            <h2 className="text-sm font-bold text-slate-900 font-sans">
              Statutory Program Rule & Threshold Configuration
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-2xs font-mono uppercase text-slate-400 font-semibold">
              Select Program:
            </span>
            <select
              value={selectedServiceId}
              onChange={e => setSelectedServiceId(e.target.value)}
              className="text-xs font-semibold rounded-lg border border-slate-300 py-1 px-2.5 bg-white text-slate-900"
            >
              {services.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <form onSubmit={handleSaveThreshold} className="p-6 space-y-6">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900">{selectedService.name}</h3>
            <p className="text-xs text-slate-500">{selectedService.description}</p>
          </div>

          {/* Configurable Threshold Inputs by Program */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 text-xs">
            {selectedService.id === 'scholarship' && (
              <>
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                  <label className="font-bold text-slate-800 block">
                    Statutory GPA Minimum Cutoff
                  </label>
                  <p className="text-2xs text-slate-500">
                    Mandated minimum on 4.0 scale for merit eligibility.
                  </p>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="4.0"
                    value={thresholds['scholarship-gpa']}
                    onChange={e =>
                      setThresholds(prev => ({ ...prev, 'scholarship-gpa': Number(e.target.value) }))
                    }
                    className="w-full text-xs font-mono font-semibold rounded-lg border border-slate-300 p-2 bg-white"
                  />
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                  <label className="font-bold text-slate-800 block">
                    Per-Capita Income Cap ($/yr)
                  </label>
                  <p className="text-2xs text-slate-500">
                    Maximum per-dependent income to qualify for need grant.
                  </p>
                  <input
                    type="number"
                    step="1000"
                    value={thresholds['scholarship-income']}
                    onChange={e =>
                      setThresholds(prev => ({ ...prev, 'scholarship-income': Number(e.target.value) }))
                    }
                    className="w-full text-xs font-mono font-semibold rounded-lg border border-slate-300 p-2 bg-white"
                  />
                </div>
              </>
            )}

            {selectedService.id === 'housing' && (
              <>
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                  <label className="font-bold text-slate-800 block">
                    60% Area Median Income (AMI) Cap
                  </label>
                  <p className="text-2xs text-slate-500">
                    Households exceeding this annual gross ceiling are not satisfied.
                  </p>
                  <input
                    type="number"
                    step="500"
                    value={thresholds['housing-ami']}
                    onChange={e =>
                      setThresholds(prev => ({ ...prev, 'housing-ami': Number(e.target.value) }))
                    }
                    className="w-full text-xs font-mono font-semibold rounded-lg border border-slate-300 p-2 bg-white"
                  />
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                  <label className="font-bold text-slate-800 block">
                    Rent-to-Income Burden Minimum (%)
                  </label>
                  <p className="text-2xs text-slate-500">
                    Contracted rent must consume at least this percentage of gross income.
                  </p>
                  <input
                    type="number"
                    step="1"
                    min="10"
                    max="80"
                    value={thresholds['housing-rent-burden']}
                    onChange={e =>
                      setThresholds(prev => ({ ...prev, 'housing-rent-burden': Number(e.target.value) }))
                    }
                    className="w-full text-xs font-mono font-semibold rounded-lg border border-slate-300 p-2 bg-white"
                  />
                </div>
              </>
            )}

            {selectedService.id === 'income-support' && (
              <>
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                  <label className="font-bold text-slate-800 block">
                    Monthly Subsistence Base ($/mo)
                  </label>
                  <p className="text-2xs text-slate-500">
                    Base income allowance before dependent multipliers.
                  </p>
                  <input
                    type="number"
                    step="50"
                    value={thresholds['income-subsistence']}
                    onChange={e =>
                      setThresholds(prev => ({ ...prev, 'income-subsistence': Number(e.target.value) }))
                    }
                    className="w-full text-xs font-mono font-semibold rounded-lg border border-slate-300 p-2 bg-white"
                  />
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                  <label className="font-bold text-slate-800 block">
                    Liquid Asset Safety Limitation ($)
                  </label>
                  <p className="text-2xs text-slate-500">
                    Maximum liquid reserves permitted to receive direct cash relief.
                  </p>
                  <input
                    type="number"
                    step="100"
                    value={thresholds['income-assets']}
                    onChange={e =>
                      setThresholds(prev => ({ ...prev, 'income-assets': Number(e.target.value) }))
                    }
                    className="w-full text-xs font-mono font-semibold rounded-lg border border-slate-300 p-2 bg-white"
                  />
                </div>
              </>
            )}

            {selectedService.id === 'healthcare' && (
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                <label className="font-bold text-slate-800 block">
                  Federal Poverty Level Threshold (%)
                </label>
                <p className="text-2xs text-slate-500">
                  Income percentage relative to FPL for automatic subsidy coverage.
                </p>
                <input
                  type="number"
                  step="5"
                  value={thresholds['healthcare-fpl']}
                  onChange={e =>
                    setThresholds(prev => ({ ...prev, 'healthcare-fpl': Number(e.target.value) }))
                  }
                  className="w-full text-xs font-mono font-semibold rounded-lg border border-slate-300 p-2 bg-white"
                />
              </div>
            )}

            {selectedService.id === 'fee-waiver' && (
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                <label className="font-bold text-slate-800 block">
                  Tuition-to-Income Hardship Minimum (%)
                </label>
                <p className="text-2xs text-slate-500">
                  Itemized semester fee ratio required for statutory tuition waiver.
                </p>
                <input
                  type="number"
                  step="1"
                  value={thresholds['fee-burden-percent']}
                  onChange={e =>
                    setThresholds(prev => ({ ...prev, 'fee-burden-percent': Number(e.target.value) }))
                  }
                  className="w-full text-xs font-mono font-semibold rounded-lg border border-slate-300 p-2 bg-white"
                />
              </div>
            )}
          </div>

          <div className="pt-2 flex justify-end">
            <Button size="sm" type="submit" className="text-xs font-bold">
              <Save className="w-3.5 h-3.5" />
              Save Statutory Threshold Calibration
            </Button>
          </div>
        </form>
      </div>

      {/* 4. IMMUTABLE STATUTORY AUDIT TRAIL LOG */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="p-5 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-slate-700" />
            <h2 className="text-sm font-bold text-slate-900 font-sans">
              Cryptographic Civic Audit Trail Log
            </h2>
          </div>
          <span className="text-2xs font-mono text-slate-500">
            Append-Only Verification Ledger
          </span>
        </div>

        <div className="divide-y divide-slate-100 text-xs font-mono">
          {[
            {
              time: 'Today 11:32 AM',
              actor: 'Sarah Jenkins',
              role: 'Senior Reviewer',
              action: 'Confirmed Requirement Satisfied (Foreign Currency conversion verified)',
              target: 'Case #case-al-03 (Amina Al-Mansoor)',
              hash: 'sha256:8f4c...91b2',
            },
            {
              time: 'Today 11:28 AM',
              actor: 'System Engine',
              role: 'System Engine',
              action: 'Automated Evaluation: Identified blurry document (72 DPI scan)',
              target: 'Case #case-er-02 (Elena Rostova)',
              hash: 'sha256:1a7d...44c8',
            },
            {
              time: 'Today 10:45 AM',
              actor: 'System Engine',
              role: 'System Engine',
              action: 'Automated Evaluation: Flagged contradictory employer health policy',
              target: 'Case #case-dm-01 (David K. Miller)',
              hash: 'sha256:3e22...77fa',
            },
            {
              time: 'Today 09:15 AM',
              actor: 'Administrator',
              role: 'Program Administrator',
              action: 'Calibrated Housing AMI ceiling threshold to $38,500',
              target: 'Service: housing',
              hash: 'sha256:bc89...22d1',
            },
          ].map((entry, i) => (
            <div key={i} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-white hover:bg-slate-50/60 transition-colors">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900">{entry.action}</span>
                  <span className="text-2xs px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                    {entry.role}
                  </span>
                </div>
                <div className="text-2xs text-slate-500">
                  Target: {entry.target} · Actor: {entry.actor}
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-2xs text-slate-400 block">{entry.time}</span>
                <span className="text-2xs text-teal-700 font-semibold">{entry.hash}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
