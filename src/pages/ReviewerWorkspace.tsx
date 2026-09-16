import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Inbox,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileText,
  User,
  ArrowLeft,
  Clock,
  ShieldCheck,
  Send,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { useApplication } from '@/context/ApplicationContext';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ReviewerCase } from '@/types';
import { getServiceById } from '@/data/services';

export function ReviewerWorkspace() {
  const { state, dispatch } = useApplication();
  const [selectedCaseId, setSelectedCaseId] = useState<string>(
    state.selectedCaseId || (state.reviewerCases[0]?.id ?? '')
  );
  const [reviewerName, setReviewerName] = useState('Sarah Jenkins, Lead Caseworker');
  const [actionNotes, setActionNotes] = useState('');
  const [selectedReqId, setSelectedReqId] = useState<string>('');
  const [showConfirmationBanner, setShowConfirmationBanner] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pending' | 'resolved'>('all');

  const selectedCase = state.reviewerCases.find(c => c.id === selectedCaseId);
  const service = selectedCase ? getServiceById(selectedCase.serviceId) : null;

  // Set default requirement if changing case
  React.useEffect(() => {
    if (selectedCase && selectedCase.assessmentResult.requirements.length > 0) {
      const nonEstablished = selectedCase.assessmentResult.requirements.find(
        r => r.finding !== 'ESTABLISHED'
      );
      setSelectedReqId(nonEstablished ? nonEstablished.requirementId : selectedCase.assessmentResult.requirements[0].requirementId);
    }
  }, [selectedCaseId, selectedCase]);

  const handleApplyDecision = (
    action: 'satisfied' | 'not_satisfied' | 'request_evidence'
  ) => {
    if (!selectedCase) return;

    dispatch({
      type: 'SUBMIT_REVIEWER_DECISION',
      payload: {
        caseId: selectedCase.id,
        action,
        requirementId: selectedReqId || (selectedCase.assessmentResult.requirements[0]?.requirementId ?? 'general'),
        notes: actionNotes.trim() || `Administrative determination finalized by ${reviewerName}.`,
        reviewerName,
      },
    });

    setActionNotes('');
    setShowConfirmationBanner(true);
    setTimeout(() => setShowConfirmationBanner(false), 4500);
  };

  const filteredCases = state.reviewerCases.filter(c => {
    if (filter === 'pending') return c.status === 'pending';
    if (filter === 'resolved') return c.status === 'resolved';
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">ClearGov Reviewer Workspace</h1>
              <p className="text-xs text-slate-500">
                Civic Case Determinations & Evidence Adjudication Console
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <span className="text-2xs text-slate-400 block uppercase font-mono">Authorized Case Officer</span>
            <input
              type="text"
              value={reviewerName}
              onChange={e => setReviewerName(e.target.value)}
              className="text-xs font-medium text-slate-800 bg-transparent border-b border-dotted border-slate-300 focus:outline-none focus:border-slate-800 py-0.5"
            />
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => dispatch({ type: 'SET_ACTIVE_VIEW', payload: 'applicant' })}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Applicant View
          </Button>
        </div>
      </div>

      {/* Workspace Split Layout: Inbox (Left) vs Case Detail (Right) */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Reviewer Inbox */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-2">
                <Inbox className="w-4 h-4 text-slate-600" />
                <h2 className="text-sm font-semibold text-slate-800">Caseworker Inbox</h2>
              </div>
              <span className="text-2xs font-mono font-medium px-2 py-0.5 rounded-full bg-slate-200/80 text-slate-700">
                {filteredCases.length} cases
              </span>
            </div>

            {/* Filter tabs */}
            <div className="px-3 pt-2.5 pb-2 flex gap-1 border-b border-slate-100 bg-white">
              {(['all', 'pending', 'resolved'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setFilter(tab)}
                  className={`text-2xs px-2.5 py-1 rounded-md capitalize font-medium transition-colors ${
                    filter === tab
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Inbox Item List */}
            <div className="divide-y divide-slate-100 max-h-[640px] overflow-y-auto">
              {filteredCases.map(c => {
                const isSelected = c.id === selectedCaseId;
                return (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCaseId(c.id)}
                    className={`w-full text-left p-4 transition-all block ${
                      isSelected
                        ? 'bg-slate-900/5 border-l-4 border-slate-900 pl-3'
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="text-sm font-semibold text-slate-900">{c.applicantName}</h3>
                        <p className="text-2xs text-slate-500">{c.serviceName}</p>
                      </div>
                      <span className="text-2xs text-slate-400 font-mono whitespace-nowrap">
                        {c.submittedAt}
                      </span>
                    </div>

                    <div className="mt-2.5">
                      <Badge variant={c.currentOutcome} size="sm">
                        {c.currentOutcome}
                      </Badge>
                    </div>

                    <div className="mt-2 text-xs text-slate-600 line-clamp-2 bg-slate-50 p-2 rounded border border-slate-100 font-sans">
                      <strong className="text-slate-700 font-medium">Issue:</strong> {c.detectedIssue}
                    </div>

                    <div className="mt-2 flex items-center justify-between text-2xs text-slate-400 font-mono">
                      <span>{c.evidenceInvolved.length} document(s) flagged</span>
                      {c.status === 'resolved' && (
                        <span className="text-emerald-600 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Resolved
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Case Detail & Adjudication Console */}
        <div className="lg:col-span-8 space-y-6">
          {selectedCase ? (
            <>
              {/* Confirmation Toast */}
              <AnimatePresence>
                {showConfirmationBanner && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-start gap-3 shadow-sm"
                  >
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-bold">Reviewer Determination Logged Successfully</h4>
                      <p className="text-xs text-emerald-700 mt-0.5">
                        The outcome for {selectedCase.applicantName} was updated to{' '}
                        <strong>{selectedCase.currentOutcome}</strong> with complete audit reasoning and reviewer signature.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Case Header Card */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-bold text-slate-900">{selectedCase.applicantName}</h2>
                      <span className="text-xs font-mono text-slate-400">ID: {selectedCase.id}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Application for <span className="font-medium text-slate-800">{selectedCase.serviceName}</span> · Filed {selectedCase.submittedAt}
                    </p>
                  </div>
                  <div>
                    <span className="text-2xs uppercase text-slate-400 font-mono block text-right mb-1">Current Outcome</span>
                    <Badge variant={selectedCase.currentOutcome} size="lg">
                      {selectedCase.currentOutcome}
                    </Badge>
                  </div>
                </div>

                {/* Detected Issue Banner */}
                <div className="mt-4 p-4 rounded-lg bg-amber-50/70 border border-amber-200/80">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900">
                        Primary Adjudication Trigger
                      </h4>
                      <p className="text-sm text-amber-950 font-medium mt-1">
                        {selectedCase.detectedIssue}
                      </p>
                      <p className="text-xs text-amber-800 mt-1">
                        Evidence flagged: {selectedCase.evidenceInvolved.join(', ')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Case Chain Breakdown: Applicant Info → Submitted Evidence → Requirements → System Reasoning */}
              <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100 shadow-sm overflow-hidden">
                {/* 1. Applicant Information */}
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <User className="w-4 h-4 text-slate-500" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      1. Applicant Self-Reported Information
                    </h3>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs bg-slate-50 p-4 rounded-lg border border-slate-100">
                    {Object.entries(selectedCase.applicantData).map(([key, val]) => (
                      <div key={key}>
                        <span className="text-slate-400 capitalize block text-2xs font-mono">
                          {key.replace(/([A-Z])/g, ' $1')}
                        </span>
                        <span className="font-semibold text-slate-800 break-words">
                          {typeof val === 'number' && key.toLowerCase().includes('income')
                            ? `$${val.toLocaleString()}`
                            : String(val || '—')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. Submitted Evidence Documents */}
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <FileText className="w-4 h-4 text-slate-500" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      2. Submitted Evidence Records & OCR Inspection
                    </h3>
                  </div>
                  <div className="space-y-3">
                    {Object.entries(selectedCase.evidenceState).map(([ruleKey, doc]) => (
                      <div
                        key={ruleKey}
                        className="p-3.5 rounded-lg border border-slate-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded bg-slate-100 text-slate-600 mt-0.5">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-semibold text-slate-900">
                                {doc.fileName || 'No file attached'}
                              </span>
                              <Badge variant={doc.status} size="sm">
                                {doc.status}
                              </Badge>
                            </div>
                            <p className="text-2xs text-slate-500 mt-0.5">
                              Rule: <span className="font-mono text-slate-700">{ruleKey}</span> {doc.fileSize && `· ${doc.fileSize}`}
                            </p>
                            {doc.issueNotes && (
                              <p className="text-xs text-amber-800 bg-amber-50 px-2 py-1 rounded mt-1.5 border border-amber-100">
                                <strong className="font-medium">Inspector Flag:</strong> {doc.issueNotes}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. Requirements & System Reasoning Chain */}
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <ShieldCheck className="w-4 h-4 text-slate-500" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      3. Statutory Requirements & System Reasoning
                    </h3>
                  </div>
                  <div className="space-y-3">
                    {selectedCase.assessmentResult.requirements.map(req => (
                      <div
                        key={req.requirementId}
                        className={`p-4 rounded-lg border transition-colors ${
                          req.finding === 'ESTABLISHED'
                            ? 'bg-slate-50/60 border-slate-200'
                            : 'bg-amber-50/40 border-amber-200'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-bold text-slate-900">{req.requirementName}</h4>
                              <Badge variant={req.finding} size="sm">
                                {req.finding}
                              </Badge>
                            </div>
                            <p className="text-xs text-slate-600 mt-1">{req.criterionDescription}</p>
                          </div>
                        </div>

                        {/* Reasoning Chain visualization */}
                        <div className="mt-3 text-xs bg-white p-3 rounded border border-slate-200/80 font-mono space-y-1">
                          <div className="text-slate-500">
                            <strong>Evidence Examined:</strong> {req.reasoningChain.evidenceExamined}
                          </div>
                          <div className="text-slate-700">
                            <strong>Explanation:</strong> {req.reasoningChain.explanation}
                          </div>
                          <div className="text-slate-500">
                            <strong>Actual:</strong> {req.actualValue} | <strong>Required:</strong> {req.requiredValue}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 4. Reviewer Action Console */}
                <div className="p-6 bg-slate-50/50">
                  <div className="flex items-center gap-2 mb-3">
                    <Clock className="w-4 h-4 text-slate-700" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                      4. Reviewer Adjudication Action
                    </h3>
                  </div>

                  <p className="text-xs text-slate-600 mb-4">
                    As an authorized case officer, you may confirm the statutory condition, declare it not satisfied based on verified records, or issue a formal request for supplemental evidence.
                  </p>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Requirement Targeted for Review
                      </label>
                      <select
                        value={selectedReqId}
                        onChange={e => setSelectedReqId(e.target.value)}
                        className="w-full text-xs rounded-lg border border-slate-300 p-2.5 bg-white text-slate-900 focus:ring-slate-900 focus:border-slate-900"
                      >
                        {selectedCase.assessmentResult.requirements.map(r => (
                          <option key={r.requirementId} value={r.requirementId}>
                            {r.requirementName} (Currently: {r.finding})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Reviewer Legal & Factual Justification Note
                      </label>
                      <textarea
                        rows={3}
                        value={actionNotes}
                        onChange={e => setActionNotes(e.target.value)}
                        placeholder="Detail the documentary review findings, verified third-party contacts, or reasons for this administrative decision..."
                        className="w-full text-xs rounded-lg border border-slate-300 p-2.5 bg-white text-slate-900 focus:ring-slate-900 focus:border-slate-900"
                      />
                    </div>

                    <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <Button
                        variant="primary"
                        size="md"
                        onClick={() => handleApplyDecision('satisfied')}
                        className="bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        Confirm Satisfied
                      </Button>

                      <Button
                        variant="danger"
                        size="md"
                        onClick={() => handleApplyDecision('not_satisfied')}
                        className="bg-rose-700 hover:bg-rose-800 text-white font-semibold text-xs"
                      >
                        <XCircle className="w-4 h-4" />
                        Confirm Not Satisfied
                      </Button>

                      <Button
                        variant="secondary"
                        size="md"
                        onClick={() => handleApplyDecision('request_evidence')}
                        className="border border-amber-300 bg-amber-50 text-amber-900 hover:bg-amber-100 font-semibold text-xs"
                      >
                        <AlertTriangle className="w-4 h-4 text-amber-600" />
                        Request Evidence
                      </Button>
                    </div>
                  </div>
                </div>

                {/* 5. Past Reviewer Audit Trail */}
                {selectedCase.reviewerDecisions.length > 0 && (
                  <div className="p-6 bg-white">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                      Adjudication Audit Trail
                    </h3>
                    <div className="space-y-3">
                      {selectedCase.reviewerDecisions.map((dec, idx) => (
                        <div
                          key={idx}
                          className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 text-xs space-y-1.5"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-900">{dec.reviewerName}</span>
                            <span className="text-slate-400 font-mono text-2xs">{dec.timestamp}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-slate-500">Action:</span>
                            <Badge variant={dec.resultingOutcome} size="sm">
                              {dec.resultingOutcome}
                            </Badge>
                          </div>
                          <p className="text-slate-700 text-xs italic">"{dec.notes}"</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-400">
              <Inbox className="w-12 h-12 mx-auto mb-3 stroke-1 text-slate-300" />
              <p className="text-sm font-medium">Select an application from the inbox to begin review.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
