import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  AlertTriangle,
  FileUp,
  Download,
  PhoneCall,
  Calendar,
  RotateCcw,
  ArrowRight,
  ShieldCheck,
  Send,
} from 'lucide-react';
import { useApplication } from '@/context/ApplicationContext';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

export function NextAction() {
  const { state, dispatch } = useApplication();
  const result = state.assessmentResult;
  const service = state.selectedService;
  const [clarificationNote, setClarificationNote] = useState('');
  const [noteSubmitted, setNoteSubmitted] = useState(false);

  if (!result || !service) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center">
        <p className="text-sm text-slate-500">No actions available. Please complete an assessment.</p>
        <Button className="mt-4" onClick={() => dispatch({ type: 'SET_STEP', payload: 'service' })}>
          Choose a Service
        </Button>
      </div>
    );
  }

  const handleClarificationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clarificationNote.trim()) return;
    setNoteSubmitted(true);
    setTimeout(() => {
      setClarificationNote('');
      setNoteSubmitted(false);
    }, 4000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-12">
      {/* Header Banner */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-2"
      >
        <div className="flex items-center gap-2">
          <Badge variant={result.outcome} size="sm">
            {result.outcome}
          </Badge>
          <span className="text-2xs text-slate-400 font-mono">Action Plan</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Required & Recommended Next Actions
        </h1>
        <p className="text-sm text-slate-600">
          Clear steps to finalize your application or address identified evidence blockers.
        </p>
      </motion.div>

      {/* Action Cards List */}
      <div className="space-y-4">
        {result.nextActions.map((action, idx) => (
          <motion.div
            key={action.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: idx * 0.08 }}
            className="p-6 rounded-xl border border-slate-200 bg-white shadow-2xs hover:border-slate-300 transition-colors"
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-2xs font-mono uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold">
                    Step {idx + 1}
                  </span>
                  {action.deadline && (
                    <span className="text-2xs text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 font-mono font-medium">
                      Deadline: {action.deadline}
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-slate-900 tracking-tight">
                  {action.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
                  {action.description}
                </p>
              </div>

              <div className="shrink-0 self-start sm:self-center">
                {action.targetEvidenceId ? (
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => dispatch({ type: 'SET_STEP', payload: 'evidence' })}
                    className="text-xs"
                  >
                    <FileUp className="w-3.5 h-3.5" />
                    Replace / Upload
                  </Button>
                ) : action.actionPrompt ? (
                  <Button
                    size="sm"
                    variant="secondary"
                    className="text-xs font-semibold"
                    onClick={() => {
                      alert(`Initiated action: "${action.actionPrompt}"`);
                    }}
                  >
                    {action.actionPrompt}
                  </Button>
                ) : null}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Optional Contextual Note Form (For Human Review or Additional Evidence cases) */}
      {(result.outcome === 'HUMAN REVIEW REQUIRED' || result.outcome === 'ADDITIONAL EVIDENCE REQUIRED') && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="p-6 rounded-xl border border-slate-200 bg-slate-50/60 space-y-4"
        >
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Optional: Submit Clarification Statement to Case Reviewer
            </span>
          </div>
          <p className="text-xs text-slate-500">
            If you have additional context regarding discrepancies, dates, or missing documentation, enter it here for the assigned caseworker.
          </p>

          {noteSubmitted ? (
            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Your note has been appended to your case docket. The reviewer will see it in their workspace.
            </div>
          ) : (
            <form onSubmit={handleClarificationSubmit} className="space-y-3">
              <textarea
                rows={3}
                value={clarificationNote}
                onChange={e => setClarificationNote(e.target.value)}
                placeholder="e.g. My employer health policy was terminated last month, but the official termination letter was delayed..."
                className="w-full text-xs rounded-lg border border-slate-300 p-3 bg-white text-slate-900 focus:ring-slate-900 focus:border-slate-900"
              />
              <Button type="submit" size="sm" variant="secondary" className="text-xs">
                <Send className="w-3.5 h-3.5" />
                Submit Clarification to Reviewer
              </Button>
            </form>
          )}
        </motion.div>
      )}

      {/* Bottom Actions */}
      <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Button
          variant="ghost"
          size="md"
          onClick={() => dispatch({ type: 'SET_STEP', payload: 'decision' })}
        >
          Back to Decision Record
        </Button>

        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="md"
            onClick={() => dispatch({ type: 'SET_ACTIVE_VIEW', payload: 'reviewer' })}
            className="text-xs"
          >
            Review in Reviewer Workspace
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={() => dispatch({ type: 'RESET' })}
          >
            <RotateCcw className="w-4 h-4" />
            Start New Application
          </Button>
        </div>
      </div>
    </div>
  );
}
