import React, { useRef, useState } from 'react';
import { UploadCloud, FileText, CheckCircle2, AlertTriangle, Eye, X } from 'lucide-react';
import { EvidenceDocument, EvidenceRule, EvidenceStatus } from '@/types';

interface FileUploadProps {
  rule: EvidenceRule;
  currentDoc?: EvidenceDocument;
  onFileUploaded: (doc: EvidenceDocument) => void;
  onRemoveDoc: () => void;
  onInspectDoc: (doc: EvidenceDocument) => void;
}

export function FileUpload({
  rule,
  currentDoc,
  onFileUploaded,
  onRemoveDoc,
  onInspectDoc,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = (file: File) => {
    setIsProcessing(true);

    const reader = new FileReader();
    reader.onload = () => {
      const previewUrl = reader.result as string;
      const sizeFormatted =
        file.size > 1024 * 1024
          ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
          : `${Math.round(file.size / 1024)} KB`;

      // Smart mock OCR / inspection based on file name or simulated criteria
      let status: EvidenceStatus = 'verified';
      let issueNotes: string | undefined;

      const lowerName = file.name.toLowerCase();
      if (lowerName.includes('blur') || lowerName.includes('unreadable') || lowerName.includes('glare')) {
        status = 'unreadable';
        issueNotes = 'OCR read confidence 18%. Resolution below 200 DPI or document glare obscures legal figures.';
      } else if (lowerName.includes('conflict') || lowerName.includes('contradict')) {
        status = 'contradictory';
        issueNotes = 'Verified document data conflicts with self-reported application values.';
      } else if (lowerName.includes('part') || lowerName.includes('incomplete')) {
        status = 'incomplete';
        issueNotes = 'Only partial pages detected. Summary signature page missing.';
      }

      const newDoc: EvidenceDocument = {
        id: `doc-${Date.now()}`,
        ruleId: rule.id,
        fileName: file.name,
        fileSize: sizeFormatted,
        status,
        issueNotes,
        previewUrl,
        fileType: file.type || (file.name.endsWith('.pdf') ? 'application/pdf' : 'image/jpeg'),
        uploadedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setTimeout(() => {
        setIsProcessing(false);
        onFileUploaded(newDoc);
      }, 400);
    };

    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  if (currentDoc && currentDoc.status !== 'missing' && currentDoc.fileName) {
    return (
      <div className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3 min-w-0">
          <div className="p-2 rounded-lg bg-slate-100 text-slate-700 shrink-0">
            <FileText className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-900 truncate block max-w-[240px]">
                {currentDoc.fileName}
              </span>
              <span className="text-2xs font-mono text-slate-400">
                {currentDoc.fileSize}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-0.5 text-2xs">
              {currentDoc.status === 'verified' ? (
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Authenticated via OCR
                </span>
              ) : currentDoc.status === 'unreadable' ? (
                <span className="text-amber-800 font-semibold flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3 text-amber-600" /> Unreadable Scan Detected
                </span>
              ) : currentDoc.status === 'contradictory' ? (
                <span className="text-purple-800 font-semibold flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3 text-purple-600" /> Contradictory Records
                </span>
              ) : (
                <span className="text-amber-700 font-semibold flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3 text-amber-600" /> Incomplete Pages
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
          <button
            type="button"
            onClick={() => onInspectDoc(currentDoc)}
            className="px-2.5 py-1 rounded-md text-slate-700 bg-slate-100 hover:bg-slate-200 font-medium text-2xs flex items-center gap-1 transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            Inspect
          </button>
          <button
            type="button"
            onClick={onRemoveDoc}
            className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
            title="Remove document"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
      className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${
        isDragging
          ? 'border-slate-900 bg-slate-100'
          : 'border-slate-200 hover:border-slate-400 bg-slate-50/50 hover:bg-slate-50'
      }`}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png"
        className="hidden"
        onChange={handleInputChange}
      />
      <div className="flex flex-col items-center gap-1.5 text-xs text-slate-500">
        <UploadCloud className="w-5 h-5 text-slate-400" />
        <div>
          <span className="font-semibold text-slate-900 underline underline-offset-2">
            Click to upload
          </span>{' '}
          or drag and drop
        </div>
        <span className="text-2xs font-mono text-slate-400">
          PDF, JPG, PNG (Max 15MB)
        </span>
      </div>
    </div>
  );
}
