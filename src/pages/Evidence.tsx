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
  Eye,
  Link2,
} from 'lucide-react';
import { useApplication } from '@/context/ApplicationContext';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { FileUpload } from '@/components/ui/FileUpload';
import { DocumentViewerModal } from '@/components/ui/DocumentViewerModal';
import { validateEvidence, createDefaultDocument } from '@/engine/evidence';
import { EvidenceStatus, EvidenceRule, EvidenceDocument } from '@/types';

export function Evidence() {
  const { state, dispatch } = useApplication();
  const service = state.selectedService;
  const [inspectingDoc, setInspectingDoc] = useState<EvidenceDocument | null>(null);

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

  const handleDocumentUploaded = (doc: EvidenceDocument) => {
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

  const handleStatusOverride = (status: EvidenceStatus, notes?: string) => {
    if (!inspectingDoc) return;
    dispatch({
      type: 'SET_EVIDENCE_STATUS',
      payload: { ruleId: inspectingDoc.ruleId, status, issueNotes: notes },
    });
    setInspectingDoc(prev => (prev ? { ...prev, status, issueNotes: notes || prev.issueNotes } : null));
  };

  // Find linked requirement for each evidence rule
  const getLinkedRequirements = (ruleId: string) => {
    return service.requirements.filter(req => req.requiredEvidenceIds.includes(ruleId));
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
          <span className="text-2xs font-mono text-slate-400">
            Requirement-to-Evidence Verification Layer
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Supporting Evidence & Documents
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          ClearGov verifies document integrity, resolution, and consistency. Drag and drop real PDF, JPG, or PNG files, or inspect verified credentials.
        </p>
      </motion.div>

      {/* Validation Summary Bar */}
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-bold text-slate-800 font-mono text-2xs uppercase">
            <ShieldCheck className="w-4 h-4 text-slate-600" />
            <span>Document Audit:</span>
          </div>
          <Badge variant={validation.complete ? 'verified' : 'urgent'} size="sm">
            {validation.verifiedCount} / {validation.totalRequired} required authenticated
          </Badge>
          {validation.hasIssues && (
            <span className="text-amber-800 font-medium bg-amber-100/70 px-2 py-0.5 rounded text-2xs font-mono">
              {validation.unreadableCount + validation.incompleteCount + validation.contradictoryCount} issue(s) flagged
            </span>
          )}
        </div>
        <span className="text-2xs text-slate-500 font-mono">
          Formats: PDF, JPG, PNG (Max 15MB)
        </span>
      </div>

      {/* Evidence Rules Checklist with Requirement Mapping */}
      <div className="space-y-5">
        {service.evidenceRules.map((rule, idx) => {
          const doc: EvidenceDocument | undefined = state.evidenceState[rule.id];
          const hasDoc = !!doc && doc.status !== 'missing' && !!doc.fileName;
          const linkedReqs = getLinkedRequirements(rule.id);

          return (
            <motion.div
              key={rule.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              className="p-5 rounded-2xl border border-slate-200 bg-white shadow-2xs space-y-4"
            >
              {/* Evidence Rule Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900">{rule.name}</span>
                    {rule.required ? (
                      <span className="text-2xs font-mono uppercase px-1.5 py-0.5 rounded bg-rose-50 text-rose-700 font-bold border border-rose-200">
                        Required
                      </span>
                    ) : (
                      <span className="text-2xs font-mono uppercase px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 font-medium">
                        Optional
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">{rule.description}</p>
                </div>

                {hasDoc && (
                  <div className="flex items-center gap-1.5 shrink-0 self-start sm:self-center">
                    <Badge variant={doc.status} size="sm">
                      {doc.status}
                    </Badge>
                  </div>
                )}
              </div>

              {/* Requirement-to-Evidence Mapping Callout */}
              <div className="flex flex-wrap items-center gap-2 text-2xs p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-1 text-slate-500 font-mono font-semibold">
                  <Link2 className="w-3.5 h-3.5 text-teal-600" />
                  <span>Substantiates Statutory Requirement:</span>
                </div>
                {linkedReqs.length > 0 ? (
                  linkedReqs.map(r => (
                    <span
                      key={r.id}
                      className="font-semibold text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-200"
                    >
                      {r.name}
                    </span>
                  ))
                ) : (
                  <span className="text-slate-400">General Program Verification</span>
                )}
              </div>

              {/* Functional File Upload / Attached View */}
              <div className="pt-1">
                <FileUpload
                  rule={rule}
                  currentDoc={doc}
                  onFileUploaded={handleDocumentUploaded}
                  onRemoveDoc={() => handleRemoveDoc(rule.id)}
                  onInspectDoc={d => setInspectingDoc(d)}
                />
              </div>

              {/* Inspector Flag / Notes if unreadable or contradictory */}
              {hasDoc && doc.issueNotes && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="font-semibold font-mono text-2xs uppercase block">
                        Automated Integrity Check Flag:
                      </strong>
                      <span className="leading-relaxed">{doc.issueNotes}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setInspectingDoc(doc)}
                    className="text-2xs font-bold text-amber-900 underline underline-offset-2 shrink-0 self-center"
                  >
                    View in Inspector
                  </button>
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

      {/* Document Inspector Modal */}
      <DocumentViewerModal
        doc={inspectingDoc}
        onClose={() => setInspectingDoc(null)}
        onUpdateStatus={handleStatusOverride}
      />
    </div>
  );
}
