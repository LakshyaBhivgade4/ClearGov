import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Inbox,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  AlertCircle,
  FileText,
  User,
  ArrowLeft,
  Clock,
  ShieldCheck,
  Send,
  ExternalLink,
  ChevronRight,
  Filter,
  Check,
} from 'lucide-react';
import { useApplication } from '@/context/ApplicationContext';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ReviewerCase, FinalOutcome } from '@/types';
import { getServiceById } from '@/data/services';

export function ReviewerWorkspace() {
  const { state, dispatch } = useApplication();
  const [selectedCaseId, setSelectedCaseId] = useState<string>(
    state.selectedCaseId || (state.reviewerCases[0]?.id ?? '')
  );
  const [reviewerName, setReviewerName] = useState('Sarah Jenkins, Senior Case Officer');
  const [actionNotes, setActionNotes] = useState('');
  const [selectedReqId, setSelectedReqId] = useState<string>('');
  const [showConfirmationBanner, setShowConfirmationBanner] = useState(false);
  const [lastSubmittedDecision, setLastSubmittedDecision] = useState<{
    action: string;
    outcome: FinalOutcome;
    evidence: string[];
    reasoning: string;
  } | null>(null);

  const selectedCase = state.reviewerCases.find(c => c.id === selectedCaseId);
  const service = selectedCase ? getServiceById(selectedCase.serviceId) : null;

  // Sync selected requirement when case changes
  React.useEffect(() => {
    if (selectedCase && selectedCase.assessmentResult.requirements.length > 0) {
      const nonEstablished = selectedCase.assessmentResult.requirements.find(
        r => r.finding !== 'ESTABLISHED'
      );
      setSelectedReqId(
        nonEstablished
          ? nonEstablished.requirementId
          : selectedCase.assessmentResult.requirements[0].requirementId
      );
    }
  }, [selectedCaseId, selectedCase]);

  const handleApplyDecision = (
    action: 'satisfied' | 'not_satisfied' | 'request_evidence'
  ) => {
    if (!selectedCase) return;

    const targetReq = selectedCase.assessmentResult.requirements.find(
      r => r.requirementId === selectedReqId
    ) || selectedCase.assessmentResult.requirements[0];

    const notes =
      actionNotes.trim() ||
      (action === 'satisfied'
        ? `Caseworker verified authenticity of ${targetReq.requirementName}. Statutory criteria satisfied.`
        : action === 'not_satisfied'
        ? `Official records confirm failure of statutory limit for ${targetReq.requirementName}. Disqualification confirmed.`
        : `Supplemental high-resolution evidence requested for ${targetReq.requirementName}. Notice issued to applicant.`);

    dispatch({
      type: 'SUBMIT_REVIEWER_DECISION',
      payload: {
        caseId: selectedCase.id,
        action,
        requirementId: targetReq.requirementId,
        notes,
        reviewerName,
      },
    });

    let resultingOutcome: FinalOutcome;
    if (action === 'satisfied') {
      resultingOutcome = 'SUFFICIENT EVIDENCE';
    } else if (action === 'not_satisfied') {
      resultingOutcome = 'CONDITION NOT SATISFIED';
    } else {
      resultingOutcome = 'ADDITIONAL EVIDENCE REQUIRED';
    }

    setLastSubmittedDecision({
      action,
      outcome: resultingOutcome,
      evidence: selectedCase.evidenceInvolved,
      reasoning: notes,
    });

    setActionNotes('');
    setShowConfirmationBanner(true);
  };

  // Applications that cannot be confidently resolved automatically:
  // (HUMAN REVIEW REQUIRED and ADDITIONAL EVIDENCE REQUIRED)
  const pendingCases = state.reviewerCases.filter(c => c.status === 'pending');
  const resolvedCases = state.reviewerCases.filter(c => c.status === 'resolved');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* 1. TOP HEADER & IDENTITY BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-sm shadow-xs">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              ClearGov Reviewer Workspace
            </h1>
            <p className="text-xs text-slate-500">
              Statutory Adjudication Console for Applications Requiring Human Examination
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <span className="text-2xs font-mono uppercase text-slate-400 block">
              Case Officer On Record
            </span>
            <input
              type="text"
              value={reviewerName}
              onChange={e => setReviewerName(e.target.value)}
              className="text-xs font-semibold text-slate-900 bg-transparent border-b border-slate-300 focus:outline-none focus:border-slate-900 py-0.5"
            />
          </div>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => dispatch({ type: 'SET_ACTIVE_VIEW', payload: 'applicant' })}
            className="text-xs font-semibold"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Applicant View
          </Button>
        </div>
      </div>

      {/* Confirmation Banner for Last Decision */}
      <AnimatePresence>
        {showConfirmationBanner && lastSubmittedDecision && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="p-5 rounded-2xl bg-slate-900 text-white shadow-md border border-slate-800 space-y-2"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-teal-300 font-mono">
                  Reviewer Decision Recorded & Outcome Updated
                </span>
              </div>
              <button
                onClick={() => setShowConfirmationBanner(false)}
                className="text-xs text-slate-400 hover:text-white font-mono"
              >
                Dismiss ✕
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
              <div>
                <span className="text-2xs text-slate-400 block font-mono">New Final Outcome</span>
                <Badge variant={lastSubmittedDecision.outcome} size="sm">
                  {lastSubmittedDecision.outcome}
                </Badge>
              </div>
              <div>
                <span className="text-2xs text-slate-400 block font-mono">Evidence Examined</span>
                <span className="font-mono text-slate-200 text-2xs truncate block">
                  {lastSubmittedDecision.evidence.join(', ')}
                </span>
              </div>
              <div>
                <span className="text-2xs text-slate-400 block font-mono">Legal Reasoning Logged</span>
                <span className="text-slate-300 text-xs line-clamp-1 italic">
                  "{lastSubmittedDecision.reasoning}"
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. SPLIT LAYOUT: REVIEWER INBOX (Left) vs CASE ADJUDICATION (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ======================================================== */}
        {/* LEFT COLUMN: REVIEWER INBOX */}
        {/* ======================================================== */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
            {/* Inbox Header */}
            <div className="p-4 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Inbox className="w-4 h-4 text-slate-700" />
                <h2 className="text-sm font-bold text-slate-900 font-sans">
                  Reviewer Inbox
                </h2>
              </div>
              <span className="text-2xs font-mono font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                {pendingCases.length} pending adjudication
              </span>
            </div>

            {/* Explanatory Callout for Reviewer Scope */}
            <div className="p-3 bg-purple-50/60 border-b border-purple-100 text-2xs text-purple-900 leading-relaxed">
              <strong>Inbox criteria:</strong> Contains civic applications that cannot be confidently resolved automatically due to document flaws, contradictions, or ambiguity.
            </div>

            {/* Inbox List: Showing Applicant → Service → Issue → Evidence involved → Current outcome */}
            <div className="divide-y divide-slate-100 max-h-[720px] overflow-y-auto">
              {state.reviewerCases.map(c => {
                const isSelected = c.id === selectedCaseId;
                return (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCaseId(c.id)}
                    className={`w-full text-left p-4 transition-all block ${
                      isSelected
                        ? 'bg-slate-900/5 border-l-4 border-slate-900 pl-3.5'
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    {/* Chain Element 1 & 2: Applicant → Service */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-slate-900">{c.applicantName}</span>
                          <span className="text-2xs font-mono text-slate-400">ID: {c.id}</span>
                        </div>
                        <span className="text-xs font-medium text-slate-600">
                          Program: {c.serviceName}
                        </span>
                      </div>
                      <span className="text-2xs font-mono text-slate-400 shrink-0">
                        {c.submittedAt}
                      </span>
                    </div>

                    {/* Chain Element 3: Issue */}
                    <div className="mt-2.5 p-2 rounded-lg bg-slate-50 border border-slate-100 text-xs text-slate-700 font-sans">
                      <span className="font-bold text-slate-900 font-mono text-2xs uppercase block mb-0.5">
                        Detected Issue:
                      </span>
                      <p className="line-clamp-2 leading-relaxed text-xs">{c.detectedIssue}</p>
                    </div>

                    {/* Chain Element 4: Evidence Involved */}
                    <div className="mt-2 flex flex-wrap items-center gap-1.5 text-2xs">
                      <span className="font-mono text-slate-400 font-semibold">Evidence:</span>
                      {c.evidenceInvolved.map((ev, i) => (
                        <span
                          key={i}
                          className="font-mono bg-white border border-slate-200 px-1.5 py-0.5 rounded text-slate-700 truncate max-w-[180px]"
                        >
                          {ev}
                        </span>
                      ))}
                    </div>

                    {/* Chain Element 5: Current Outcome */}
                    <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-100/80">
                      <span className="text-2xs font-mono text-slate-400">Current Outcome:</span>
                      <Badge variant={c.currentOutcome} size="sm">
                        {c.currentOutcome}
                      </Badge>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* RIGHT COLUMN: CASE DETAIL (Strict Chain Sequence) */}
        {/* Applicant information → Submitted evidence → Requirements → Detected issue → System reasoning → Reviewer action */}
        {/* ======================================================== */}
        <div className="lg:col-span-7 space-y-6">
          {selectedCase ? (
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs divide-y divide-slate-100">
              {/* Header Title */}
              <div className="p-6 bg-slate-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-2xs font-mono uppercase tracking-widest text-slate-400 font-bold block">
                    Statutory Adjudication Docket
                  </span>
                  <h2 className="text-xl font-extrabold text-slate-900">
                    {selectedCase.applicantName}
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {selectedCase.serviceName} · Case ID: {selectedCase.id}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-2xs font-mono uppercase text-slate-400 block mb-1">
                    Current Outcome
                  </span>
                  <Badge variant={selectedCase.currentOutcome} size="md">
                    {selectedCase.currentOutcome}
                  </Badge>
                </div>
              </div>

              {/* SEQUENCE STEP 1: Applicant Information */}
              <div className="p-6 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-slate-100 flex items-center justify-center text-slate-700 font-bold text-2xs font-mono">
                    1
                  </div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 font-mono">
                    Applicant Information
                  </h3>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 bg-slate-50/70 rounded-xl border border-slate-100 text-xs">
                  {Object.entries(selectedCase.applicantData).map(([key, val]) => (
                    <div key={key} className="space-y-0.5">
                      <span className="text-2xs font-mono text-slate-400 uppercase block">
                        {key.replace(/([A-Z])/g, ' $1')}
                      </span>
                      <span className="font-semibold text-slate-800 break-words">
                        {typeof val === 'number' && (key.toLowerCase().includes('income') || key.toLowerCase().includes('rent'))
                          ? `$${val.toLocaleString()}`
                          : String(val || '—')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* SEQUENCE STEP 2: Submitted Evidence */}
              <div className="p-6 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-slate-100 flex items-center justify-center text-slate-700 font-bold text-2xs font-mono">
                    2
                  </div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 font-mono">
                    Submitted Evidence & Integrity Audit
                  </h3>
                </div>

                <div className="space-y-2.5">
                  {Object.entries(selectedCase.evidenceState).map(([ruleKey, doc]) => (
                    <div
                      key={ruleKey}
                      className="p-3.5 rounded-xl border border-slate-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-start gap-3">
                        <FileText className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900">
                              {doc.fileName || 'No file attached'}
                            </span>
                            <Badge variant={doc.status} size="sm">
                              {doc.status}
                            </Badge>
                          </div>
                          <span className="text-2xs font-mono text-slate-400">
                            Rule: {ruleKey} {doc.fileSize && `· ${doc.fileSize}`}
                          </span>
                          {doc.issueNotes && (
                            <p className="mt-1.5 text-xs text-amber-900 bg-amber-50 p-2 rounded border border-amber-200/80 leading-relaxed font-sans">
                              <strong>Inspector Finding:</strong> {doc.issueNotes}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* SEQUENCE STEP 3: Requirements */}
              <div className="p-6 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-slate-100 flex items-center justify-center text-slate-700 font-bold text-2xs font-mono">
                    3
                  </div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 font-mono">
                    Statutory Requirements
                  </h3>
                </div>

                <div className="space-y-2">
                  {selectedCase.assessmentResult.requirements.map(req => (
                    <div
                      key={req.requirementId}
                      className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">{req.requirementName}</span>
                          <Badge variant={req.finding} size="sm">
                            {req.finding}
                          </Badge>
                        </div>
                        <p className="text-2xs text-slate-500 mt-0.5">{req.criterionDescription}</p>
                      </div>
                      <div className="text-2xs font-mono text-slate-600 sm:text-right">
                        Actual: <strong>{req.actualValue}</strong>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* SEQUENCE STEP 4: Detected Issue */}
              <div className="p-6 space-y-3 bg-amber-50/30">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-amber-200 text-amber-950 flex items-center justify-center font-bold text-2xs font-mono">
                    4
                  </div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-amber-950 font-mono">
                    Detected Issue Triggering Escalation
                  </h3>
                </div>

                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950 space-y-1.5">
                  <div className="flex items-center gap-2 font-bold font-mono text-2xs uppercase">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span>Non-Automated Determination Block</span>
                  </div>
                  <p className="text-xs text-amber-900 leading-relaxed font-sans font-medium">
                    {selectedCase.detectedIssue}
                  </p>
                  <div className="text-2xs font-mono text-amber-800 pt-1">
                    Flagged evidence: {selectedCase.evidenceInvolved.join(', ')}
                  </div>
                </div>
              </div>

              {/* SEQUENCE STEP 5: System Reasoning */}
              <div className="p-6 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-slate-100 flex items-center justify-center text-slate-700 font-bold text-2xs font-mono">
                    5
                  </div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 font-mono">
                    System Reasoning Chain
                  </h3>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2 font-mono">
                  <div className="text-2xs text-slate-400 uppercase font-bold">
                    Diagnostic Trace:
                  </div>
                  <p className="text-xs text-slate-800 font-sans leading-relaxed">
                    {selectedCase.assessmentResult.executiveSummary}
                  </p>
                  <div className="pt-2 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-2 text-2xs text-slate-600">
                    <div>
                      <strong>Conditions Established:</strong> {selectedCase.assessmentResult.establishedCount} / {selectedCase.assessmentResult.requirements.length}
                    </div>
                    <div>
                      <strong>Documentary Discrepancies:</strong> {selectedCase.assessmentResult.detectedIssues.length}
                    </div>
                  </div>
                </div>
              </div>

              {/* SEQUENCE STEP 6: Reviewer Action */}
              <div className="p-6 space-y-4 bg-slate-50/80">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-slate-900 text-white flex items-center justify-center font-bold text-2xs font-mono">
                    6
                  </div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 font-mono">
                    Reviewer Action & Final Determination
                  </h3>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  Exercise statutory authority to resolve the escalation. The selected action will update the final civic outcome immediately and append to the official audit log:
                </p>

                {/* Target Requirement Selector */}
                <div className="space-y-1">
                  <label className="block text-2xs font-mono uppercase font-bold text-slate-600">
                    Condition Under Review
                  </label>
                  <select
                    value={selectedReqId}
                    onChange={e => setSelectedReqId(e.target.value)}
                    className="w-full text-xs rounded-lg border border-slate-300 p-2.5 bg-white text-slate-900 font-medium"
                  >
                    {selectedCase.assessmentResult.requirements.map(r => (
                      <option key={r.requirementId} value={r.requirementId}>
                        {r.requirementName} — Current Finding: {r.finding}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Legal / Justification Notes */}
                <div className="space-y-1">
                  <label className="block text-2xs font-mono uppercase font-bold text-slate-600">
                    Legal / Factual Reasoning Note (Saved to Public Record)
                  </label>
                  <textarea
                    rows={3}
                    value={actionNotes}
                    onChange={e => setActionNotes(e.target.value)}
                    placeholder="Enter evidence-based justification (e.g. 'Contacted employer HR department directly; employee benefits were terminated on the 1st of this month...')"
                    className="w-full text-xs rounded-lg border border-slate-300 p-2.5 bg-white text-slate-900 font-sans"
                  />
                </div>

                {/* 3 Reviewer Actions specified by user:
                    Satisfied → SUFFICIENT EVIDENCE
                    Not satisfied → CONDITION NOT SATISFIED
                    More evidence needed → ADDITIONAL EVIDENCE REQUIRED */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  {/* Action 1: Confirm Satisfied */}
                  <Button
                    size="md"
                    onClick={() => handleApplyDecision('satisfied')}
                    className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex flex-col items-center py-3 h-auto"
                  >
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Confirm Satisfied</span>
                    </div>
                    <span className="text-2xs font-normal opacity-90 font-mono mt-0.5">
                      → SUFFICIENT EVIDENCE
                    </span>
                  </Button>

                  {/* Action 2: Confirm Not Satisfied */}
                  <Button
                    size="md"
                    onClick={() => handleApplyDecision('not_satisfied')}
                    className="bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs flex flex-col items-center py-3 h-auto"
                  >
                    <div className="flex items-center gap-1.5">
                      <XCircle className="w-4 h-4" />
                      <span>Confirm Not Satisfied</span>
                    </div>
                    <span className="text-2xs font-normal opacity-90 font-mono mt-0.5">
                      → CONDITION NOT SATISFIED
                    </span>
                  </Button>

                  {/* Action 3: Request Additional Evidence */}
                  <Button
                    size="md"
                    onClick={() => handleApplyDecision('request_evidence')}
                    className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex flex-col items-center py-3 h-auto"
                  >
                    <div className="flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4" />
                      <span>Request Evidence</span>
                    </div>
                    <span className="text-2xs font-normal opacity-90 font-mono mt-0.5">
                      → ADDITIONAL EVIDENCE REQ.
                    </span>
                  </Button>
                </div>
              </div>

              {/* Reviewer Decisions Audit Trail */}
              {selectedCase.reviewerDecisions.length > 0 && (
                <div className="p-6 bg-white space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">
                    Adjudication Audit Trail & Justification History
                  </h4>

                  <div className="space-y-3">
                    {selectedCase.reviewerDecisions.map((dec, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-xl border border-slate-200 bg-slate-50 text-xs space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900">{dec.reviewerName}</span>
                          <span className="text-2xs font-mono text-slate-400">{dec.timestamp}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-slate-500 text-2xs font-mono">Determined Outcome:</span>
                          <Badge variant={dec.resultingOutcome} size="sm">
                            {dec.resultingOutcome}
                          </Badge>
                        </div>

                        <div className="p-2.5 bg-white rounded-lg border border-slate-200 font-sans text-xs text-slate-700 italic">
                          "{dec.notes}"
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400">
              <Inbox className="w-10 h-10 mx-auto mb-2 text-slate-300" />
              <p className="text-xs font-medium">Select an application from the inbox to begin review.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
