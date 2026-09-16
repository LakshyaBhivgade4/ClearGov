import React from 'react';
import { X, FileText, CheckCircle2, AlertTriangle, Download, ShieldCheck } from 'lucide-react';
import { EvidenceDocument } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface DocumentViewerModalProps {
  doc: EvidenceDocument | null;
  onClose: () => void;
  onUpdateStatus?: (status: EvidenceDocument['status'], notes?: string) => void;
}

export function DocumentViewerModal({ doc, onClose, onUpdateStatus }: DocumentViewerModalProps) {
  if (!doc) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="p-2 rounded-lg bg-slate-900 text-white shrink-0">
              <FileText className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-slate-900 truncate">
                {doc.fileName}
              </h3>
              <p className="text-2xs font-mono text-slate-500">
                Rule Target: {doc.ruleId} · {doc.fileSize}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant={doc.status} size="sm">
              {doc.status}
            </Badge>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body: Document Viewer & OCR Diagnostics */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* Document Preview Canvas */}
          <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-100/70 p-4 flex items-center justify-center min-h-[220px]">
            {doc.previewUrl && doc.fileType?.startsWith('image/') ? (
              <img
                src={doc.previewUrl}
                alt={doc.fileName}
                className="max-h-[280px] object-contain rounded shadow-2xs"
              />
            ) : (
              <div className="text-center space-y-2 p-6">
                <div className="w-12 h-12 rounded-xl bg-white shadow-2xs border border-slate-200 flex items-center justify-center mx-auto text-slate-700 font-mono font-bold text-xs">
                  PDF
                </div>
                <div className="space-y-0.5">
                  <div className="font-semibold text-slate-900">{doc.fileName}</div>
                  <div className="text-2xs font-mono text-slate-500">
                    Digitally Verified Official Document · {doc.fileSize}
                  </div>
                </div>
                <div className="inline-flex items-center gap-1 text-2xs text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Tamper-evident checksum verified</span>
                </div>
              </div>
            )}
          </div>

          {/* OCR / Inspection Analysis Box */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-2xs font-mono uppercase tracking-wider font-bold text-slate-500">
                Automated Document Diagnostic Check
              </span>
              <span className="text-2xs font-mono text-slate-400">Engine v2026.4</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-2xs font-mono">
              <div className="bg-white p-2 rounded border border-slate-200">
                <span className="text-slate-400 block">Read Resolution</span>
                <strong className={doc.status === 'unreadable' ? 'text-amber-700' : 'text-slate-800'}>
                  {doc.status === 'unreadable' ? '72 DPI (Low)' : '300 DPI (Valid)'}
                </strong>
              </div>
              <div className="bg-white p-2 rounded border border-slate-200">
                <span className="text-slate-400 block">OCR Confidence</span>
                <strong className={doc.status === 'unreadable' ? 'text-amber-700' : 'text-slate-800'}>
                  {doc.status === 'unreadable' ? '21.4%' : '99.2%'}
                </strong>
              </div>
              <div className="bg-white p-2 rounded border border-slate-200">
                <span className="text-slate-400 block">Seal Authentication</span>
                <strong className="text-slate-800">
                  {doc.status === 'incomplete' ? 'Missing Page 2' : 'Cryptographic Match'}
                </strong>
              </div>
            </div>

            {doc.issueNotes && (
              <div className="p-2.5 rounded bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  <strong>Diagnostic Flag:</strong> {doc.issueNotes}
                </span>
              </div>
            )}
          </div>

          {/* Adjudication Status Simulation Controls (If allowed) */}
          {onUpdateStatus && (
            <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-2">
              <span className="text-2xs font-mono uppercase tracking-wider font-bold text-slate-500 block">
                Simulator Control: Override Document Integrity State
              </span>
              <div className="flex flex-wrap gap-2">
                {(['verified', 'unreadable', 'incomplete', 'contradictory'] as const).map(s => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => onUpdateStatus(s)}
                    className={`px-2.5 py-1 rounded-lg text-2xs font-mono capitalize transition-all border ${
                      doc.status === s
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <span className="text-2xs font-mono text-slate-400">
            Document ID: {doc.id}
          </span>
          <Button size="sm" variant="secondary" onClick={onClose} className="text-xs">
            Close Inspector
          </Button>
        </div>
      </div>
    </div>
  );
}
