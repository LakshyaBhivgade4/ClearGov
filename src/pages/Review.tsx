import React from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  User,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Pencil,
  Zap,
} from 'lucide-react';
import { useApplication } from '@/context/ApplicationContext';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

export function Review() {
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

  const handleRunAssessment = () => {
    dispatch({ type: 'RUN_ASSESSMENT' });
    dispatch({ type: 'SET_STEP', payload: 'assessment' });
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
            Step 4 of 7
          </Badge>
          <span className="text-2xs font-mono text-slate-400">Pre-Evaluation Verification</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Review Application Submission
        </h1>
        <p className="text-sm text-slate-600">
          Verify your declared data and supporting evidence before the statutory assessment engine determines your outcome.
        </p>
      </motion.div>

      {/* 1. Chosen Service */}
      <div className="p-5 rounded-xl border border-slate-200 bg-white shadow-2xs flex items-center justify-between gap-4">
        <div>
          <span className="text-2xs font-mono uppercase text-slate-400 block font-semibold">
            Public Service Program
          </span>
          <h3 className="text-base font-bold text-slate-900">{service.name}</h3>
          <p className="text-xs text-slate-500 mt-0.5">{service.shortDescription}</p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => dispatch({ type: 'SET_STEP', payload: 'service' })}
          className="text-xs"
        >
          <Pencil className="w-3.5 h-3.5" />
          Change
        </Button>
      </div>

      {/* 2. Applicant Data Summary */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-slate-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 font-mono">
              Self-Reported Applicant Information
            </h3>
          </div>
          <button
            onClick={() => dispatch({ type: 'SET_STEP', payload: 'info' })}
            className="text-xs font-medium text-slate-600 hover:text-slate-900 flex items-center gap-1"
          >
            <Pencil className="w-3 h-3" />
            Edit
          </button>
        </div>

        <div className="p-5 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
          {service.fields.map(field => {
            const val = state.applicantData[field.id];
            return (
              <div key={field.id} className="space-y-0.5">
                <span className="text-slate-400 block text-2xs font-mono">{field.label}</span>
                <span className="font-semibold text-slate-900">
                  {val !== undefined && val !== '' ? (
                    field.type === 'number' && (field.label.toLowerCase().includes('income') || field.label.toLowerCase().includes('rent'))
                      ? `$${Number(val).toLocaleString()}`
                      : String(val)
                  ) : (
                    <em className="text-slate-300 font-normal">Not provided</em>
                  )}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Evidence Checklist Summary */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-slate-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 font-mono">
              Attached Evidence Records ({Object.keys(state.evidenceState).length} attached)
            </h3>
          </div>
          <button
            onClick={() => dispatch({ type: 'SET_STEP', payload: 'evidence' })}
            className="text-xs font-medium text-slate-600 hover:text-slate-900 flex items-center gap-1"
          >
            <Pencil className="w-3 h-3" />
            Manage
          </button>
        </div>

        <div className="divide-y divide-slate-100">
          {service.evidenceRules.map(rule => {
            const doc = state.evidenceState[rule.id];
            const hasDoc = !!doc && doc.status !== 'missing' && !!doc.fileName;

            return (
              <div key={rule.id} className="p-4 flex items-center justify-between gap-4 text-xs bg-white">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{rule.name}</span>
                    {rule.required ? (
                      <span className="text-2xs font-mono text-rose-600">Mandatory</span>
                    ) : (
                      <span className="text-2xs font-mono text-slate-400">Optional</span>
                    )}
                  </div>
                  <p className="text-2xs text-slate-500 font-mono">
                    {hasDoc ? `File: ${doc.fileName}` : 'No document attached'}
                  </p>
                </div>

                <div>
                  {hasDoc ? (
                    <Badge variant={doc.status} size="sm">
                      {doc.status}
                    </Badge>
                  ) : (
                    <Badge variant="pending" size="sm">
                      Missing
                    </Badge>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Assessment Readiness Callout */}
      <div className="p-5 rounded-xl border border-slate-900 bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-teal-400" />
            <h4 className="text-sm font-bold text-white tracking-tight">
              Ready for Explainable Adjudication
            </h4>
          </div>
          <p className="text-xs text-slate-300 max-w-xl">
            Click below to execute the multi-factor reasoning chain. The engine will evaluate information against evidence credibility to determine the final civic outcome.
          </p>
        </div>

        <Button
          size="lg"
          onClick={handleRunAssessment}
          className="bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shrink-0"
        >
          Run Assessment Engine
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Navigation */}
      <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
        <Button
          variant="ghost"
          size="md"
          onClick={() => dispatch({ type: 'SET_STEP', payload: 'evidence' })}
        >
          Back to Evidence
        </Button>
      </div>
    </div>
  );
}
