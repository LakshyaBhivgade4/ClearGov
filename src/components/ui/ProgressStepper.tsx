import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { FlowStep } from '@/types';
import { useApplication } from '@/context/ApplicationContext';

const steps: { id: FlowStep; label: string; shortLabel: string }[] = [
  { id: 'service', label: 'Choose Service', shortLabel: 'Service' },
  { id: 'info', label: 'Applicant Info', shortLabel: 'Info' },
  { id: 'evidence', label: 'Evidence', shortLabel: 'Evidence' },
  { id: 'review', label: 'Review', shortLabel: 'Review' },
  { id: 'assessment', label: 'Assessment', shortLabel: 'Assessment' },
  { id: 'decision', label: 'Decision', shortLabel: 'Decision' },
  { id: 'next-action', label: 'Next Action', shortLabel: 'Next' },
];

interface ProgressStepperProps {
  currentStep: FlowStep;
}

export function ProgressStepper({ currentStep }: ProgressStepperProps) {
  const { dispatch } = useApplication();
  const currentIndex = steps.findIndex(s => s.id === currentStep);

  return (
    <nav className="w-full" aria-label="Application progress journey">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;
          const isAccessible = index <= currentIndex;

          return (
            <React.Fragment key={step.id}>
              <button
                type="button"
                onClick={() => {
                  if (isAccessible) {
                    dispatch({ type: 'SET_STEP', payload: step.id });
                  }
                }}
                disabled={!isAccessible}
                className={`flex flex-col items-center gap-1.5 group transition-all ${
                  isAccessible ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'
                }`}
              >
                <div
                  className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold
                    transition-all duration-200
                    ${
                      isCompleted
                        ? 'bg-slate-900 text-white group-hover:bg-slate-800 ring-2 ring-slate-900 ring-offset-2'
                        : isCurrent
                        ? 'bg-teal-600 text-white ring-2 ring-teal-600 ring-offset-2'
                        : 'bg-slate-100 text-slate-400 border border-slate-200'
                    }
                  `}
                >
                  {isCompleted ? <Check className="w-4 h-4 stroke-[2.5]" /> : <span>{index + 1}</span>}
                </div>
                <span
                  className={`text-2xs font-medium transition-colors hidden md:block whitespace-nowrap ${
                    isCurrent
                      ? 'text-slate-900 font-semibold'
                      : isCompleted
                      ? 'text-slate-700'
                      : 'text-slate-400'
                  }`}
                >
                  {step.label}
                </span>
                <span
                  className={`text-2xs font-medium transition-colors md:hidden whitespace-nowrap ${
                    isCurrent ? 'text-slate-900 font-semibold' : 'text-slate-400'
                  }`}
                >
                  {step.shortLabel}
                </span>
              </button>

              {index < steps.length - 1 && (
                <div className="flex-1 mx-2 h-0.5 bg-slate-200 relative mb-4">
                  <motion.div
                    initial={false}
                    animate={{ scaleX: index < currentIndex ? 1 : 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="absolute inset-0 bg-slate-900 origin-left"
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </nav>
  );
}
