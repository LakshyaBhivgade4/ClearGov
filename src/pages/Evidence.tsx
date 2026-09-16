import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  FileUp,
  Trash2,
  RefreshCw,
  Info,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { useApplication } from '@/context/ApplicationContext';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { validateEvidence, createDefaultDocument } from '@/engine/evidence';
import { EvidenceStatus, EvidenceRule, EvidenceDocument } from '@/types';

export function Evidence() {
  const { state, dispatch } = useApplication();
  const service = state.selectedService;

  if (!service) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center">
        <p className="text-slate-500">Please select a service first.</p>
        <Button className="mt-4" onClick={() => dispatch({ type: 'SET_STEP', payload: 'service' })}>
          Choose Service
        </Button>
      </div>
    );
  }

  const validation = validateEvidence(service, state.evidenceState);

  const handleStatusChange = (ruleId: string, status: EvidenceStatus) => {
    dispatch({
      type: 'SET_EVIDENCE_STATUS',
      payload: { ruleId, status },
    });
  };

  const handleAttachDoc = (rule: EvidenceRule) => {
    const doc = createDefaultDocument(rule, 'verified');
    dispatch({
      type: 'ATTACH_EVIDENCE_DOC',
      payload: doc,
    });
  };

  const handleRemoveDoc = (ruleId: string) => {
    dispatch({
      type: 'REMOVE_EVIDENCE_DOC',
      payload: ruleId,
    });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-2"
      >
        <div className="flex items-center gap-2">
          <Badge variant="neutral" size="sm">
            Step 3 of 7
          </Badge>
          <span className="text-2xs font-mono text-slate-400">Evidence Adjudication Layer</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Supporting Evidence & Documentation
        </h1>
        <p className="text-sm text-slate-600">
          ClearGov evaluates the legal credibility, readability, and consistency of every submitted document. Evidence directly influences assessment findings.
        </p>
      </motion.div>

      {/* Validation Summary Bar */}
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-medium text-slate-800">
            <ShieldCheck className="w-4 h-4 text-slate-600" />
            <span>Audit Status:</span>
          </div>
          <Badge variant={validation.complete ? 'verified' : 'urgent'} size="sm">
            {validation.verifiedCount} / {validation.totalRequired} required verified
          </Badge>
          {validation.hasIssues && (
            <span className="text-amber-800 font-medium bg-amber-100/70 px-2 py-0.5 rounded text-2xs">
              {validation.unreadableCount + validation.incompleteCount + validation.contradictoryCount} issue(s) detected
            </span>
          )}
        </div>
        <span className="text-2xs text-slate-500 font-mono">
          Accepted: PDF, OCR-Ready 300 DPI Scans
        </span>
      </div>

      {/* Evidence Rules Checklist */}
      <div className="space-y-4">
        {service.evidenceRules.map((rule, idx) => {
          const doc: EvidenceDocument | undefined = state.evidenceState[rule.id];
          const hasDoc = !!doc && doc.status !== 'missing' && !!doc.fileName;

          return (
            <motion.div
              key={rule.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              className={`p-5 rounded-xl border transition-all ${
                hasDoc
                  ? doc.status === 'verified'
                    ? 'border-emerald-200 bg-white shadow-2xs'
                    : doc.status === 'contradictory'
                    ? 'border-purple-200 bg-purple-50/30'
                    : 'border-amber-200 bg-amber-50/30'
                  : rule.required
                  ? 'border-slate-200 bg-white'
                  : 'border-slate-200/80 bg-slate-50/40'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900">{rule.name}</span>
                    {rule.required ? (
                      <span className="text-2xs font-mono uppercase px-1.5 py-0.5 rounded bg-rose-50 text-rose-700 font-semibold border border-rose-200">
                        Mandatory
                      </span>
                    ) : (
                      <span className="text-2xs font-mono uppercase px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 font-medium">
                        Optional
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-600">{rule.description}</p>
                  <p className="text-2xs text-slate-400 font-mono">
                    <strong>Statutory Purpose:</strong> {rule.reason}
                  </p>
                </div>

                {/* Document Status / Action */}
                <div className="shrink-0 self-start sm:self-center text-right space-y-2">
                  {hasDoc ? (
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 justify-end">
                        <span className="text-xs font-mono font-medium text-slate-700">
                          {doc.fileName}
                        </span>
                        <Badge variant={doc.status} size="sm">
                          {doc.status}
                        </Badge>
                      </div>

                      {/* Interactive Document State Selector (Hackathon Simulator) */}
                      <div className="flex items-center gap-1.5 text-2xs justify-end">
                        <span className="text-slate-400 font-mono">Simulate state:</span>
                        <select
                          value={doc.status}
                          onChange={e => handleStatusChange(rule.id, e.target.value as EvidenceStatus)}
                          className="text-2xs font-mono rounded border border-slate-300 py-0.5 px-1.5 bg-white text-slate-800"
                        >
                          <option value="verified">Verified</option>
                          <option value="unreadable">Unreadable</option>
                          <option value="incomplete">Incomplete</option>
                          <option value="contradictory">Contradictory</option>
                        </select>
                        <button
                          onClick={() => handleRemoveDoc(rule.id)}
                          className="p-1 rounded text-slate-400 hover:text-rose-600 transition-colors"
                          title="Remove document"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleAttachDoc(rule)}
                      className="text-xs font-medium"
                    >
                      <FileUp className="w-3.5 h-3.5" />
                      Attach Document
                    </Button>
                  )}
                </div>
              </div>

              {/* Inspector Flag / Notes if unreadable or contradictory */}
              {hasDoc && doc.issueNotes && (
                <div className="mt-3 p-2.5 rounded bg-amber-50 border border-amber-200/80 text-xs text-amber-900 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-semibold font-mono text-2xs uppercase">Automated Document Inspection:</strong>{' '}
                    <span>{doc.issueNotes}</span>
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Navigation */}
      <div className="pt-6 border-t border-slate-200 flex items-center justify-between">
        <Button
          variant="ghost"
          size="md"
          onClick={() => dispatch({ type: 'SET_STEP', payload: 'info' })}
        >
          Back to Information
        </Button>
        <Button
          size="md"
          onClick={() => dispatch({ type: 'SET_STEP', payload: 'review' })}
        >
          Proceed to Review
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
