import React from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  AlertCircle,
  FileCheck,
  ArrowRight,
  Shield,
  Download,
  Share2,
  ExternalLink,
} from 'lucide-react';
import { useApplication } from '@/context/ApplicationContext';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { FinalOutcome } from '@/types';

export function Decision() {
  const { state, dispatch } = useApplication();
  const result = state.assessmentResult;
  const service = state.selectedService;

  if (!result || !service) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center">
        <p className="text-sm text-slate-500">No decision is currently available.</p>
        <Button className="mt-4" onClick={() => dispatch({ type: 'SET_STEP', payload: 'assessment' })}>
          Return to Assessment
        </Button>
      </div>
    );
  }

  const outcomeColors: Record<FinalOutcome, { border: string; bg: string; text: string; icon: React.ComponentType<any> }> = {
    'SUFFICIENT EVIDENCE': {
      border: 'border-emerald-300',
      bg: 'bg-emerald-50/70',
      text: 'text-emerald-950',
      icon: CheckCircle2,
    },
    'CONDITION NOT SATISFIED': {
      border: 'border-rose-300',
      bg: 'bg-rose-50/70',
      text: 'text-rose-950',
      icon: XCircle,
    },
    'ADDITIONAL EVIDENCE REQUIRED': {
      border: 'border-amber-300',
      bg: 'bg-amber-50/70',
      text: 'text-amber-950',
      icon: AlertTriangle,
    },
    'HUMAN REVIEW REQUIRED': {
      border: 'border-purple-300',
      bg: 'bg-purple-50/70',
      text: 'text-purple-950',
      icon: AlertCircle,
    },
  };

  const currentTheme = outcomeColors[result.outcome];
  const Icon = currentTheme.icon;

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-12">
      {/* Official Determination Document Card */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
      >
        {/* Document Header */}
        <div className="p-6 sm:p-8 border-b border-slate-100 bg-slate-50/60">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-sm">
                CG
              </div>
              <div>
                <h1 className="text-base font-bold text-slate-900 tracking-tight">
                  State Civic Assistance Determination Record
                </h1>
                <p className="text-2xs text-slate-500 font-mono">
                  Program: {service.name} · Docket #CG-{Date.now().toString().slice(-6)}
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-2xs text-slate-400 font-mono block">Determination Status</span>
              <Badge variant={result.outcome} size="md">
                {result.outcome}
              </Badge>
            </div>
          </div>
        </div>

        {/* Core Decision Summary */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className={`p-6 rounded-xl border ${currentTheme.border} ${currentTheme.bg}`}>
            <div className="flex items-start gap-3.5">
              <Icon className={`w-6 h-6 shrink-0 mt-0.5 ${currentTheme.text}`} />
              <div className="space-y-1">
                <h2 className={`text-lg font-bold ${currentTheme.text}`}>
                  {result.headline}
                </h2>
                <p className="text-xs text-slate-700 leading-relaxed font-sans">
                  {result.executiveSummary}
                </p>
              </div>
            </div>
          </div>

          {/* Reasoning & Findings Table */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">
              Statutory Findings by Condition
            </h3>
            <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100 text-xs">
              {result.requirements.map(req => (
                <div key={req.requirementId} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{req.requirementName}</span>
                      <Badge variant={req.finding} size="sm">
                        {req.finding}
                      </Badge>
                    </div>
                    <p className="text-slate-600 text-xs">{req.reasoningChain.explanation}</p>
                    <div className="text-2xs text-slate-400 font-mono">
                      Evidence: {req.reasoningChain.evidenceExamined}
                    </div>
                  </div>

                  <div className="text-right shrink-0 sm:min-w-[140px]">
                    <span className="text-2xs text-slate-400 block">Verified Value</span>
                    <span className="font-semibold text-slate-800 text-xs">{req.actualValue}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Audit Verification Stamp */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-600 font-mono">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-slate-400" />
              <span>Certified under Statutory Civic Decision Protocol v2026.4</span>
            </div>
            <span className="text-slate-400">Timestamp: {result.evaluatedAt} (UTC)</span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-slate-50/80 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Button
            variant="ghost"
            size="md"
            onClick={() => dispatch({ type: 'SET_STEP', payload: 'assessment' })}
          >
            Back to Assessment
          </Button>

          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              size="md"
              onClick={() => dispatch({ type: 'SET_ACTIVE_VIEW', payload: 'reviewer' })}
              className="text-xs"
            >
              Adjudicate in Reviewer Workspace
            </Button>
            <Button
              size="md"
              onClick={() => dispatch({ type: 'SET_STEP', payload: 'next-action' })}
            >
              Proceed to Next Actions
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
