import React from 'react';
import { ProgressStepper } from '@/components/ui/ProgressStepper';
import { useApplication } from '@/context/ApplicationContext';

interface StepLayoutProps {
  children: React.ReactNode;
}

export function StepLayout({ children }: StepLayoutProps) {
  const { state } = useApplication();

  return (
    <div className="max-w-content mx-auto px-6 py-8">
      <div className="mb-10">
        <ProgressStepper currentStep={state.currentStep} />
      </div>
      {children}
    </div>
  );
}
