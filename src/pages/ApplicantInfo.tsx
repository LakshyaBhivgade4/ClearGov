import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { User, Sparkles, ArrowRight } from 'lucide-react';
import { useApplication } from '@/context/ApplicationContext';
import { Input, Select, Textarea } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { demoJourneys } from '@/data/seedApplicants';
import { FieldConfig } from '@/types';

export function ApplicantInfo() {
  const { state, dispatch } = useApplication();
  const service = state.selectedService;

  if (!service) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center">
        <p className="text-slate-500">Please select a public service first.</p>
        <Button className="mt-4" onClick={() => dispatch({ type: 'SET_STEP', payload: 'service' })}>
          Choose Service
        </Button>
      </div>
    );
  }

  // Group fields by section
  const sections = useMemo(() => {
    const map = new Map<string, FieldConfig[]>();
    service.fields.forEach(field => {
      if (!map.has(field.section)) map.set(field.section, []);
      map.get(field.section)!.push(field);
    });
    return Array.from(map.entries());
  }, [service.fields]);

  const handleFieldChange = (fieldId: string, value: any) => {
    dispatch({
      type: 'UPDATE_APPLICANT_DATA',
      payload: { [fieldId]: value },
    });
  };

  const matchingDemos = demoJourneys.filter(d => d.serviceId === service.id);

  const canContinue = service.fields
    .filter(f => f.required)
    .every(f => {
      const val = state.applicantData[f.id];
      return val !== undefined && val !== '' && val !== null;
    });

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
            Step 2 of 7
          </Badge>
          <span className="text-2xs font-mono text-slate-400">Declarative Information Intake</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Applicant Information
        </h1>
        <p className="text-sm text-slate-600">
          Provide your legal details and demographic information for the <strong className="text-slate-900">{service.name}</strong> program.
        </p>
      </motion.div>

      {/* Preset Demo Profiles for this service */}
      {matchingDemos.length > 0 && (
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
          <div className="flex items-center gap-2 mb-2.5">
            <Sparkles className="w-4 h-4 text-teal-600" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 font-mono">
              Pre-Seeded Demo Profile
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {matchingDemos.map(demo => (
              <button
                key={demo.id}
                onClick={() => dispatch({ type: 'LOAD_DEMO_JOURNEY', payload: demo.id })}
                className="text-xs px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-800 hover:border-slate-900 hover:text-slate-950 font-medium transition-all shadow-2xs flex items-center gap-2"
              >
                <span>{demo.applicantName}</span>
                <Badge variant={demo.targetOutcome} size="sm">
                  {demo.targetOutcome}
                </Badge>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Dynamic Form Sections */}
      <div className="space-y-8">
        {sections.map(([sectionName, fields], sIdx) => (
          <motion.div
            key={sectionName}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.05 + sIdx * 0.08 }}
            className="p-6 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-5"
          >
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono border-b border-slate-100 pb-2">
              {sectionName}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {fields.map(field => {
                const value = state.applicantData[field.id] ?? '';
                const isFullWidth = field.type === 'textarea' || field.id === 'rentalAddress';

                if (field.type === 'select' && field.options) {
                  return (
                    <div key={field.id} className={isFullWidth ? 'sm:col-span-2' : ''}>
                      <Select
                        label={field.label}
                        options={field.options}
                        value={value}
                        onChange={e => handleFieldChange(field.id, e.target.value)}
                        required={field.required}
                        helpText={field.helpText}
                      />
                    </div>
                  );
                }

                if (field.type === 'textarea') {
                  return (
                    <div key={field.id} className="sm:col-span-2">
                      <Textarea
                        label={field.label}
                        value={value}
                        onChange={e => handleFieldChange(field.id, e.target.value)}
                        placeholder={field.placeholder}
                        required={field.required}
                        helpText={field.helpText}
                      />
                    </div>
                  );
                }

                return (
                  <div key={field.id} className={isFullWidth ? 'sm:col-span-2' : ''}>
                    <Input
                      label={field.label}
                      type={field.type === 'number' ? 'number' : field.type === 'email' ? 'email' : 'text'}
                      value={value}
                      onChange={e => handleFieldChange(field.id, e.target.value)}
                      placeholder={field.placeholder}
                      required={field.required}
                      helpText={field.helpText}
                      suffix={field.suffix}
                      min={field.min}
                      max={field.max}
                      step={field.type === 'number' && field.max && field.max <= 4 ? 0.01 : undefined}
                    />
                  </div>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Navigation */}
      <div className="pt-6 border-t border-slate-200 flex items-center justify-between">
        <Button
          variant="ghost"
          size="md"
          onClick={() => dispatch({ type: 'SET_STEP', payload: 'service' })}
        >
          Back to Services
        </Button>

        <Button
          size="md"
          disabled={!canContinue}
          onClick={() => dispatch({ type: 'SET_STEP', payload: 'evidence' })}
        >
          Proceed to Evidence
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
