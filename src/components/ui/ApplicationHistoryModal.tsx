import React from 'react';
import { X, Clock, FileText, CheckCircle2, ChevronRight, Shield } from 'lucide-react';
import { useApplication } from '@/context/ApplicationContext';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface ApplicationHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ApplicationHistoryModal({ isOpen, onClose }: ApplicationHistoryModalProps) {
  const { state, dispatch } = useApplication();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-slate-900 text-white">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Civic Determination History & Audit Vault
              </h3>
              <p className="text-2xs font-mono text-slate-500">
                Persistent filing history and immutable determination certificates
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* List of Applications */}
        <div className="p-5 overflow-y-auto divide-y divide-slate-100 space-y-3 flex-1 text-xs">
          {state.applicationHistory.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <FileText className="w-8 h-8 mx-auto mb-2 text-slate-300" />
              <p className="text-xs">No prior applications filed in this session.</p>
            </div>
          ) : (
            state.applicationHistory.map(item => (
              <div
                key={item.id}
                className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-colors space-y-2.5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">
                        {item.applicantName}
                      </span>
                      <span className="text-2xs font-mono text-slate-400">
                        {item.serviceName}
                      </span>
                    </div>
                    <span className="text-2xs text-slate-400 font-mono block">
                      Submitted: {item.submittedAt} · Docket ID: {item.id}
                    </span>
                  </div>

                  <Badge variant={item.finalOutcome} size="sm">
                    {item.finalOutcome}
                  </Badge>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed font-sans">
                  {item.summary}
                </p>

                <div className="flex items-center justify-between text-2xs font-mono text-slate-500 pt-2 border-t border-slate-100">
                  <span>
                    Verified: <strong>{item.establishedCount} of {item.totalConditions}</strong> conditions established
                  </span>
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    <Shield className="w-3 h-3 text-emerald-600" /> Tamper-Proof Audit
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <span className="text-2xs font-mono text-slate-400">
            Records stored securely in municipal civic ledger
          </span>
          <Button size="sm" variant="secondary" onClick={onClose} className="text-xs font-semibold">
            Close Vault
          </Button>
        </div>
      </div>
    </div>
  );
}
