import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  AlertCircle,
  FileText,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  ExternalLink,
  FileUp,
  Check,
  Info,
} from 'lucide-react';
import { useApplication } from '@/context/ApplicationContext';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { demoJourneys } from '@/data/seedApplicants';
import { FinalOutcome } from '@/types';

export function Assessment() {
  const { state, dispatch } = useApplication();
  const result = state.assessmentResult;
  const service = state.selectedService;
  const [expandedReqs, setExpandedReqs] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => {
    setExpandedReqs(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSwitchDemo = (demoId: string) => {
    dispatch({ type: 'LOAD_DEMO_JOURNEY', payload: demoId });
  };

  if (!result || !service) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-slate-500">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">No Assessment Evaluated Yet</h2>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          Please select a service or launch one of our 4 benchmark demo scenarios to evaluate the explainable decision engine.
        </p>
        <div className="pt-2 flex justify-center gap-2">
          {demoJourneys.map(demo => (
            <Button
              key={demo.id}
              size="sm"
              variant="secondary"
              onClick={() => handleSwitchDemo(demo.id)}
              className="text-xs"
            >
              {demo.badgeLabel}
            </Button>
          ))}
        </div>
      </div>
    );
  }

  const establishedRequirements = result.requirements.filter(r => r.finding === 'ESTABLISHED');
  const unestablishedRequirements = result.requirements.filter(r => r.finding !== 'ESTABLISHED');

  // Exact 4 outcome UI metadata
  const outcomeThemes: Record<
    FinalOutcome,
    {
      emoji: string;
      label: string;
      borderClass: string;
      bgClass: string;
      accentText: string;
      icon: React.ComponentType<any>;
      proceedStatus: string;
      canProceedColor: string;
    }
  > = {
    'SUFFICIENT EVIDENCE': {
      emoji: '🟢',
      label: '🟢 SUFFICIENT EVIDENCE',
      borderClass: 'border-emerald-200 shadow-emerald-500/5',
      bgClass: 'bg-emerald-50/60',
      accentText: 'text-emerald-950',
      icon: CheckCircle2,
      proceedStatus: 'YES — Application can currently proceed',
      canProceedColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    },
    'CONDITION NOT SATISFIED': {
      emoji: '🔴',
      label: '🔴 CONDITION NOT SATISFIED',
      borderClass: 'border-rose-200 shadow-rose-500/5',
      bgClass: 'bg-rose-50/60',
      accentText: 'text-rose-950',
      icon: XCircle,
      proceedStatus: 'NO — Blocked by statutory limit',
      canProceedColor: 'bg-rose-100 text-rose-900 border-rose-300',
    },
    'ADDITIONAL EVIDENCE REQUIRED': {
      emoji: '🟡',
      label: '🟡 ADDITIONAL EVIDENCE REQUIRED',
      borderClass: 'border-amber-200 shadow-amber-500/5',
      bgClass: 'bg-amber-50/60',
      accentText: 'text-amber-950',
      icon: AlertTriangle,
      proceedStatus: 'PAUSED — Awaiting legible/missing evidence',
      canProceedColor: 'bg-amber-100 text-amber-900 border-amber-300',
    },
    'HUMAN REVIEW REQUIRED': {
      emoji: '🟣',
      label: '🟣 HUMAN REVIEW REQUIRED',
      borderClass: 'border-purple-200 shadow-purple-500/5',
      bgClass: 'bg-purple-50/60',
      accentText: 'text-purple-950',
      icon: AlertCircle,
      proceedStatus: 'ESCALATED — Assigned to case officer',
      canProceedColor: 'bg-purple-100 text-purple-900 border-purple-300',
    },
  };

  const theme = outcomeThemes[result.outcome];
  const OutcomeIcon = theme.icon;
  const primaryAction = result.nextActions[0];

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* 1. BENCHMARK SCENARIOS SELECTOR BAR (1-Click instant test of all 4 outcomes) */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1 mb-2">
          <div className="flex items-center gap-1.5 text-2xs font-mono font-bold uppercase tracking-wider text-slate-500">
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            <span>Interactive Demo Scenarios — Test All 4 Outcomes</span>
          </div>
          <span className="text-2xs text-slate-400 font-mono hidden sm:inline">
            Click to switch applicant context
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {demoJourneys.map(demo => {
            const isCurrent =
              state.selectedService?.id === demo.serviceId &&
              state.applicantData.fullName === demo.applicantName;
            return (
              <button
                key={demo.id}
                onClick={() => handleSwitchDemo(demo.id)}
                className={`p-2.5 rounded-xl text-left transition-all border ${
                  isCurrent
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200/80'
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="text-xs font-bold truncate">{demo.applicantName}</span>
                </div>
                <div
                  className={`text-2xs font-mono font-semibold truncate ${
                    isCurrent ? 'text-teal-300' : 'text-slate-600'
                  }`}
                >
                  {demo.badgeLabel}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. CORE ASSESSMENT & DECISION HERO */}
      <motion.div
        key={result.outcome + state.applicantData.fullName}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className={`p-6 sm:p-8 rounded-2xl border ${theme.borderClass} ${theme.bgClass} shadow-sm space-y-6`}
      >
        {/* Top Meta Line: Service Name & Can Proceed Status */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/70 pb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-900">{service.name}</span>
            <span className="text-slate-300">·</span>
            <span className="text-2xs font-mono text-slate-500">Applicant: {state.applicantData.fullName || 'Citizen'}</span>
          </div>

          {/* Whether the application can currently proceed */}
          <div className="flex items-center gap-2">
            <span className="text-2xs font-mono uppercase text-slate-500 font-semibold">
              Can Application Proceed?
            </span>
            <span
              className={`text-2xs font-mono font-bold px-2.5 py-1 rounded-full border ${theme.canProceedColor}`}
            >
              {theme.proceedStatus}
            </span>
          </div>
        </div>

        {/* Outcome Headline */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-2xs font-mono uppercase tracking-widest text-slate-500 font-bold">
              <span>Statutory Determination</span>
              <span>·</span>
              <span>Zero-Black-Box Protocol</span>
            </div>

            {/* Exact 4 Outcome Label */}
            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-950 tracking-tight flex items-center gap-3">
              <span>{theme.label}</span>
            </h1>

            {/* Why it reached its current outcome */}
            <p className="text-sm text-slate-800 leading-relaxed max-w-2xl font-medium pt-1">
              {result.executiveSummary}
            </p>
          </div>

          <div className="shrink-0 text-right space-y-2 hidden sm:block">
            <div className="p-3 bg-white rounded-xl border border-slate-200/80 shadow-2xs text-center min-w-[150px]">
              <span className="text-2xs font-mono text-slate-400 block uppercase font-semibold">Conditions Status</span>
              <span className="text-lg font-extrabold text-slate-900 block mt-0.5">
                {result.establishedCount} / {result.requirements.length}
              </span>
              <span className="text-2xs text-slate-500">Requirements Established</span>
            </div>
          </div>
        </div>

        {/* The Most Direct Next Action (Per User Requirement) */}
        {primaryAction && (
          <div className="pt-2">
            <div className="p-4 sm:p-5 rounded-xl bg-slate-950 text-white border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-2xs font-mono uppercase font-bold tracking-wider text-teal-400">
                    The Most Direct Next Action
                  </span>
                  {primaryAction.deadline && (
                    <span className="text-2xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                      {primaryAction.deadline}
                    </span>
                  )}
                </div>
                <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
                  {primaryAction.title}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed max-w-xl">
                  {primaryAction.description}
                </p>
              </div>

              <div className="shrink-0">
                {primaryAction.targetEvidenceId ? (
                  <Button
                    size="sm"
                    onClick={() => dispatch({ type: 'SET_STEP', payload: 'evidence' })}
                    className="bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs"
                  >
                    <FileUp className="w-3.5 h-3.5" />
                    Upload Legible File
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    onClick={() => dispatch({ type: 'SET_STEP', payload: 'next-action' })}
                    className="bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs"
                  >
                    {primaryAction.actionPrompt || 'View Next Action'}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* 3. CORE EVIDENCE-TO-DECISION BREAKDOWN (Visual Focus) */}
      <div className="space-y-6">
        <div>
          <h2 className="text-sm font-bold text-slate-900 tracking-tight font-sans">
            Evidence-to-Decision Mapping
          </h2>
          <p className="text-xs text-slate-500">
            See how submitted records and verified facts substantiate each statutory condition.
          </p>
        </div>

        {/* SECTION A: What Cannot Yet Be Established (If Any) */}
        {unestablishedRequirements.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-rose-800 font-mono flex items-center gap-1.5">
                <XCircle className="w-4 h-4 text-rose-600" />
                <span>What Cannot Yet Be Established ({unestablishedRequirements.length})</span>
              </h3>
              <span className="text-2xs text-slate-400 font-mono">Unsatisfied or unverified conditions</span>
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
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-sm font-bold text-slate-900">
                            {req.requirementName}
                          </span>
                          <span className="text-xs text-slate-400">—</span>
                          <span className="text-xs font-semibold text-rose-700">
                            Cannot be established
                          </span>
                          <Badge variant={req.finding} size="sm">
                            {req.finding}
                          </Badge>
                        </div>
                        <p className="text-xs text-slate-600">{req.criterionDescription}</p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs font-mono font-medium text-slate-700 hidden sm:inline">
                          {req.actualValue}
                        </span>
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-slate-400" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-slate-400" />
                        )}
                      </div>
                    </div>

                    {/* Progressive Disclosure Reasoning Drawer */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="px-4 pb-4 pt-2 border-t border-slate-100 bg-slate-50/50 text-xs"
                        >
                          <div className="p-3.5 bg-white rounded-lg border border-slate-200 space-y-2.5">
                            <div className="flex items-center justify-between text-2xs font-mono uppercase text-slate-400 font-bold">
                              <span>Reasoning Chain: Requirement → Evidence → Finding → Explanation</span>
                              <span className="text-rose-700 font-semibold">{req.finding}</span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono bg-slate-50 p-2.5 rounded border border-slate-100">
                              <div>
                                <span className="text-2xs text-slate-400 block">Evidence Examined:</span>
                                <strong className="text-slate-800">{req.reasoningChain.evidenceExamined}</strong>
                              </div>
                              <div>
                                <span className="text-2xs text-slate-400 block">Diagnostic Finding:</span>
                                <strong className="text-rose-700">{req.finding}</strong>
                              </div>
                            </div>

                            <p className="text-xs text-slate-700 leading-relaxed font-sans pt-1">
                              <strong>Official Explanation:</strong> {req.reasoningChain.explanation}
                            </p>

                            <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-2xs font-mono text-slate-500">
                              <span>
                                <strong>Actual:</strong> {req.actualValue}
                              </span>
                              <span>
                                <strong>Required:</strong> {req.requiredValue}
                              </span>
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

        {/* SECTION B: Missing, Problematic, or Contradictory Evidence */}
        {result.detectedIssues.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-800 font-mono flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Missing, Problematic, or Contradictory Evidence ({result.detectedIssues.length})</span>
              </h3>
              <span className="text-2xs text-slate-400 font-mono">Evidence-level issues</span>
            </div>

            <div className="space-y-2.5">
              {result.detectedIssues.map((issue, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-amber-200 bg-amber-50/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-1.5 rounded-lg bg-amber-100 text-amber-900 shrink-0 mt-0.5">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{issue.title}</span>
                        <span className="text-2xs font-mono uppercase bg-amber-200/70 text-amber-950 px-1.5 py-0.5 rounded font-bold">
                          {issue.type}
                        </span>
                      </div>
                      <p className="text-slate-600 mt-1 leading-relaxed">{issue.description}</p>
                      <div className="mt-2 text-2xs font-mono text-slate-500">
                        Document: <span className="font-semibold text-slate-800">{issue.evidenceName}</span> · Condition: <span className="font-semibold text-slate-800">{issue.requirementName}</span>
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0 self-end sm:self-center">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => dispatch({ type: 'SET_STEP', payload: 'evidence' })}
                      className="text-2xs font-semibold bg-white border border-amber-300 hover:bg-amber-100/60 text-amber-950"
                    >
                      Inspect / Replace Evidence
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION C: What Has Been Successfully Established */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-800 font-mono flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>What Has Been Successfully Established ({establishedRequirements.length})</span>
            </h3>
            <span className="text-2xs text-slate-400 font-mono">Authenticated & verified</span>
          </div>

          {establishedRequirements.length === 0 ? (
            <div className="p-4 rounded-xl border border-dashed border-slate-200 text-center text-xs text-slate-400 bg-slate-50">
              No requirements are currently established.
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
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-sm font-bold text-slate-900">
                            {req.requirementName}
                          </span>
                          <span className="text-xs text-slate-400">—</span>
                          <span className="text-xs font-semibold text-emerald-700">
                            Established
                          </span>
                          <Badge variant="ESTABLISHED" size="sm">
                            ESTABLISHED
                          </Badge>
                        </div>
                        <p className="text-xs text-slate-500">{req.criterionDescription}</p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
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

                    {/* Progressive Disclosure Drawer */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="px-4 pb-4 pt-2 border-t border-slate-100 bg-slate-50/50 text-xs"
                        >
                          <div className="p-3.5 bg-white rounded-lg border border-slate-200 space-y-2 font-mono">
                            <div className="text-2xs uppercase text-slate-400 font-bold">
                              Reasoning Chain
                            </div>
                            <p className="text-xs text-slate-700 font-sans leading-relaxed">
                              {req.reasoningChain.explanation}
                            </p>
                            <div className="text-2xs text-slate-500 pt-1 border-t border-slate-100">
                              <strong>Evidence Examined:</strong> {req.reasoningChain.evidenceExamined} · {req.evidenceNotes}
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
      </div>

      {/* 4. FOOTER & NAVIGATION BAR */}
      <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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
            className="text-xs font-semibold"
          >
            Reviewer Workspace
          </Button>

          <Button
            size="md"
            onClick={() => dispatch({ type: 'SET_STEP', payload: 'decision' })}
            className="text-xs font-bold"
          >
            Official Decision Record
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
