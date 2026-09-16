import React from 'react';
import { useApplication } from '@/context/ApplicationContext';
import { AppLayout } from '@/components/layout/AppLayout';
import { StepLayout } from '@/components/layout/StepLayout';
import { ServiceSelection } from '@/pages/ServiceSelection';
import { ApplicantInfo } from '@/pages/ApplicantInfo';
import { Evidence } from '@/pages/Evidence';
import { Review } from '@/pages/Review';
import { Assessment } from '@/pages/Assessment';
import { Decision } from '@/pages/Decision';
import { NextAction } from '@/pages/NextAction';
import { ReviewerWorkspace } from '@/pages/ReviewerWorkspace';

export function AppShell() {
  const { state } = useApplication();

  if (state.activeView === 'reviewer') {
    return (
      <AppLayout>
        <ReviewerWorkspace />
      </AppLayout>
    );
  }

  const renderStep = () => {
    switch (state.currentStep) {
      case 'service':
        return <ServiceSelection />;
      case 'info':
        return <ApplicantInfo />;
      case 'evidence':
        return <Evidence />;
      case 'review':
        return <Review />;
      case 'assessment':
        return <Assessment />;
      case 'decision':
        return <Decision />;
      case 'next-action':
        return <NextAction />;
      default:
        return <ServiceSelection />;
    }
  };

  return (
    <AppLayout>
      {state.currentStep === 'service' ? (
        <div className="py-8 px-4 sm:px-6">{renderStep()}</div>
      ) : (
        <StepLayout>{renderStep()}</StepLayout>
      )}
    </AppLayout>
  );
}
