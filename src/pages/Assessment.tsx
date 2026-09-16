import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileText,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { useApplication } from '@/context/ApplicationContext';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { RequirementEvaluation, FinalOutcome } from '@/types';

export function Assessment() {
  const { state, dispatch } = useApplication();
  const result = state.assessmentResult;
  const service = state.selectedService;
  const [expandedReqs, setExpandedReqs] = useState<Record<string, boolean>>({});

  if (!result || !service) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center">
        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400 mb-3">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-slate-800">No Assessment Recorded Yet</h2>
        <p className="text-sm text-slate-500 mt-1">
          Review your submitted information and evidence to run the explainable assessment.
        </p>
        <Button
          className="mt-6"
          onClick={() => {
            dispatch({ type: 'RUN_ASSESSMENT' });
          }}
        >
          Evaluate Application Now
        </Button>
      </div>
    );
  }

  const toggleExpand = (id: string) => {
    setExpandedReqs(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const establishedRequirements = result.requirements.filter(r => r.finding === 'ESTABLISHED');
  const unestablishedRequirements = result.requirements.filter(r => r.finding !== 'ESTABLISHED');

  const outcomeConfig: Record<
    FinalOutcome,
    {
      icon: React.ComponentType<any>;
      borderClass: string;
      bgClass: string;
      textClass: string;
      tagColor: string;
      proceedBadge: string;
    }
  > = {
    'SUFFICIENT EVIDENCE': {
      icon: CheckCircle2,
      borderClass: 'border-emerald-300',
      bgClass: 'bg-emerald-50/70',
      textClass: 'text-emerald-950',
      tagColor: 'emerald',
      proceedBadge: 'Eligible to Proceed Immediately',
    },
    'CONDITION NOT SATISFIED': {
      icon: XCircle,
      borderClass: 'border-rose-300',
      bgClass: 'bg-rose-50/70',
      textClass: 'text-rose-950',
      tagColor: 'rose',
      proceedBadge: 'Application Cannot Proceed — Statutory Limit Exceeded',
    },
    'ADDITIONAL EVIDENCE REQUIRED': {
      icon: AlertTriangle,
      borderClass: 'border-amber-300',
      bgClass: 'bg-amber-50/70',
      textClass: 'text-amber-950',
      tagColor: 'amber',
      proceedBadge: 'Action Required — Awaiting Supplemental Documentation',
    },
    'HUMAN REVIEW REQUIRED': {
      icon: AlertCircle,
      borderClass: 'border-purple-300',
      bgClass: 'bg-purple-50/70',
      textClass: 'text-purple-950',
      tagColor: 'purple',
      proceedBadge: 'Pending Human Caseworker Confirmation',
    },
  };

  const currentConfig = outcomeConfig[result.outcome];
  const OutcomeIcon = currentConfig.icon;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* 1. HERO OUTCOME BANNER */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className={`p-6 sm:p-8 rounded-2xl border ${currentConfig.borderClass} ${currentConfig.bgClass} shadow-sm relative overflow-hidden`}
      >
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-white shadow-xs shrink-0 mt-0.5">
              <OutcomeIcon className={`w-7 h-7 ${currentConfig.textClass}`} strokeWidth={2.2} />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className="text-2xs font-mono uppercase font-bold tracking-wider text-slate-500">
                  Official Determination
                </span>
                <span className="text-slate-300">·</span>
                <span className="text-2xs font-mono text-slate-500">Evaluated at {result.evaluatedAt}</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
                {result.outcome}
              </h1>

              <p className="mt-2 text-sm text-slate-800 leading-relaxed font-medium max-w-2xl">
                {result.executiveSummary}
              </p>
            </div>
          </div>

          <div className="shrink-0 sm:text-right">
            <Badge variant={result.outcome} size="lg">
              {result.outcome}
            </Badge>
            <div className="mt-2 text-2xs font-medium text-slate-600">
              {result.canProceed ? (
                <span className="text-emerald-700 font-semibold">✓ Can Proceed to Next Step</span>
              ) : (
                <span className="text-slate-600">✕ Blocked from Proceeding</span>
              )}
            </div>
          </div>
        </div>

        {/* Status bar */}
        <div className="mt-6 pt-4 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-4 text-xs font-medium text-slate-700">
          <div className="flex items-center gap-4">
            <span>
              <strong>{result.establishedCount}</strong> of {result.requirements.length} conditions established
            </span>
            <span>·</span>
            <span>
              <strong>{result.detectedIssues.length}</strong> documentary issues identified
            </span>
          </div>
          <div className="text-2xs font-mono text-slate-600 bg-white/80 px-2.5 py-1 rounded border border-slate-200">
            {currentConfig.proceedBadge}
          </div>
        </div>
      </motion.div>

      {/* 2. DIRECT NEXT ACTION PROMPT (Prominently placed per spec) */}
      {result.nextActions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="p-5 rounded-xl border border-slate-900 bg-slate-950 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-2xs font-mono uppercase tracking-widest text-teal-300 font-semibold">
                Most Direct Next Action
              </span>
              {result.nextActions[0].deadline && (
                <span className="text-2xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                  {result.nextActions[0].deadline}
                </span>
              )}
            </div>
            <h3 className="text-base font-bold text-white tracking-tight">
              {result.nextActions[0].title}
            </h3>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              {result.nextActions[0].description}
            </p>
          </div>

          <div className="shrink-0">
            <Button
              variant="secondary"
              size="md"
              onClick={() => dispatch({ type: 'SET_STEP', payload: 'next-action' })}
              className="bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs"
            >
              {result.nextActions[0].actionPrompt || 'View Detailed Next Steps'}
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </motion.div>
      )}

      {/* 3. DETECTED ISSUES & EVIDENCE PROBLEMS (If any) */}
      {result.detectedIssues.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">
              Explicit Evidence Issues Identified ({result.detectedIssues.length})
            </h3>
            <span className="text-2xs text-slate-400">Determines why condition cannot be established</span>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {result.detectedIssues.map((issue, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-amber-200 bg-amber-50/50 flex flex-col sm:flex-row sm:items-start justify-between gap-3 text-xs"
              >
                <div className="flex items-start gap-3">
                  <div className="p-1.5 rounded-md bg-amber-100 text-amber-800 shrink-0 mt-0.5">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{issue.title}</span>
                      <span className="text-2xs font-mono uppercase bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded font-semibold">
                        {issue.type}
                      </span>
                    </div>
                    <p className="text-slate-600 mt-1">{issue.description}</p>
                    <div className="mt-2 text-2xs font-mono text-slate-500">
                      Document: <span className="font-medium text-slate-800">{issue.evidenceName}</span> · Requirement: <span className="font-medium text-slate-800">{issue.requirementName}</span>
                    </div>
                  </div>
                </div>

                <div className="shrink-0 self-end sm:self-center">
                  <button
                    onClick={() => dispatch({ type: 'SET_STEP', payload: 'evidence' })}
                    className="text-xs font-semibold text-amber-900 hover:text-amber-950 underline underline-offset-2 flex items-center gap-1"
                  >
                    Inspect Evidence
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. WHAT CANNOT YET BE ESTABLISHED (If any) */}
      {unestablishedRequirements.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-rose-800 font-mono flex items-center gap-1.5">
              <XCircle className="w-4 h-4 text-rose-600" />
              What Cannot Yet Be Established ({unestablishedRequirements.length})
            </h3>
            <span className="text-2xs text-slate-400">Statutory blockers or missing verification</span>
          </div>

          <div className="space-y-3">
            {unestablishedRequirements.map(req => {
              const isExpanded = expandedReqs[req.requirementId] ?? true;
              return (
                <div
                  key={req.requirementId}
                  className="rounded-xl border border-rose-200 bg-white overflow-hidden shadow-2xs"
                >
                  <div
                    onClick={() => toggleExpand(req.requirementId)}
                    className="p-4 cursor-pointer hover:bg-slate-50/80 flex items-start justify-between gap-4 transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2.5">
                        <h4 className="text-sm font-bold text-slate-900">{req.requirementName}</h4>
                        <Badge variant={req.finding} size="sm">
                          {req.finding}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-500">{req.criterionDescription}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-slate-500 hidden sm:inline">
                        Actual: <strong className="text-slate-900">{req.actualValue}</strong>
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                  </div>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="px-4 pb-4 pt-2 border-t border-slate-100 bg-slate-50/50 text-xs"
                      >
                        {/* Reasoning Chain display: Requirement → Evidence → Finding → Explanation → Outcome */}
                        <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-2 font-mono">
                          <div className="text-2xs uppercase text-slate-400 font-bold tracking-wider">
                            Reasoning Chain
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                            <div>
                              <span className="text-slate-400 block text-2xs">Evidence Examined</span>
                              <span className="font-semibold text-slate-800">
                                {req.reasoningChain.evidenceExamined}
                              </span>
                            </div>
                            <div>
                              <span className="text-slate-400 block text-2xs">Diagnostic Finding</span>
                              <Badge variant={req.finding} size="sm">
                                {req.finding}
                              </Badge>
                            </div>
                          </div>
                          <div className="pt-1 text-slate-700 font-sans text-xs leading-relaxed">
                            <strong>Official Finding Explanation:</strong> {req.reasoningChain.explanation}
                          </div>
                          <div className="text-2xs text-slate-500 pt-1 border-t border-slate-100">
                            <strong>Required Statutory Value:</strong> {req.requiredValue}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 5. WHAT HAS BEEN SUCCESSFULLY ESTABLISHED */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-800 font-mono flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            What Has Been Successfully Established ({establishedRequirements.length})
          </h3>
          <span className="text-2xs text-slate-400">Verified against official documentation</span>
        </div>

        {establishedRequirements.length === 0 ? (
          <div className="p-4 rounded-xl border border-dashed border-slate-200 text-center text-xs text-slate-400 bg-slate-50">
            No requirements have been fully established yet.
          </div>
        ) : (
          <div className="space-y-3">
            {establishedRequirements.map(req => {
              const isExpanded = expandedReqs[req.requirementId] ?? false;
              return (
                <div
                  key={req.requirementId}
                  className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-2xs"
                >
                  <div
                    onClick={() => toggleExpand(req.requirementId)}
                    className="p-4 cursor-pointer hover:bg-slate-50/80 flex items-start justify-between gap-4 transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2.5">
                        <h4 className="text-sm font-bold text-slate-900">{req.requirementName}</h4>
                        <Badge variant="ESTABLISHED" size="sm">
                          ESTABLISHED
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-500">{req.criterionDescription}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-emerald-700 font-medium hidden sm:inline">
                        {req.actualValue}
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                  </div>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="px-4 pb-4 pt-2 border-t border-slate-100 bg-slate-50/50 text-xs"
                      >
                        <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-2 font-mono">
                          <div className="text-2xs uppercase text-slate-400 font-bold tracking-wider">
                            Reasoning Chain
                          </div>
                          <div className="text-slate-700 font-sans text-xs leading-relaxed">
                            {req.reasoningChain.explanation}
                          </div>
                          <div className="text-2xs text-slate-500">
                            <strong>Evidence Verified:</strong> {req.reasoningChain.evidenceExamined} · {req.evidenceNotes}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 6. BOTTOM NAVIGATION */}
      <div className="pt-6 border-t border-slate-200 flex items-center justify-between">
        <Button
          variant="ghost"
          size="md"
          onClick={() => dispatch({ type: 'SET_STEP', payload: 'review' })}
        >
          Back to Review
        </Button>

        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="md"
            onClick={() => dispatch({ type: 'SET_ACTIVE_VIEW', payload: 'reviewer' })}
            className="text-xs"
          >
            Open in Reviewer Workspace
          </Button>
          <Button
            size="md"
            onClick={() => dispatch({ type: 'SET_STEP', payload: 'decision' })}
          >
            Official Decision Record
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
