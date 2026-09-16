import React, { useState } from 'react';
import { RotateCcw, ShieldCheck, UserCheck, ChevronDown, Sparkles } from 'lucide-react';
import { useApplication } from '@/context/ApplicationContext';
import { demoJourneys } from '@/data/seedApplicants';
import { Badge } from '@/components/ui/Badge';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { state, dispatch } = useApplication();
  const [showDemoMenu, setShowDemoMenu] = useState(false);

  const pendingReviewCount = state.reviewerCases.filter(c => c.status === 'pending').length;

  return (
    <div className="min-h-screen flex flex-col bg-[#fafafa]">
      {/* Top Navigation Bar */}
      <header className="border-b border-slate-200 sticky top-0 bg-white/95 backdrop-blur-md z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          {/* Brand & Active Service */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                dispatch({ type: 'SET_ACTIVE_VIEW', payload: 'applicant' });
                dispatch({ type: 'SET_STEP', payload: 'service' });
              }}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity text-left"
            >
              <div className="w-8 h-8 rounded-lg bg-slate-950 flex items-center justify-center text-white shadow-xs">
                <span className="font-extrabold text-xs tracking-tighter">CG</span>
              </div>
              <div>
                <span className="text-base font-bold text-slate-900 tracking-tight block leading-tight">
                  ClearGov
                </span>
                <span className="text-2xs text-slate-400 font-mono hidden sm:block">
                  Explainable Civic Decisions
                </span>
              </div>
            </button>

            {state.selectedService && state.activeView === 'applicant' && (
              <div className="hidden md:flex items-center gap-2 pl-3 border-l border-slate-200">
                <span className="text-2xs font-mono uppercase text-slate-400">Program:</span>
                <span className="text-xs font-semibold text-slate-800">
                  {state.selectedService.name}
                </span>
              </div>
            )}
          </div>

          {/* Quick Demo Switcher & Mode Switcher */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Demo Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowDemoMenu(!showDemoMenu)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-medium transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                <span className="hidden sm:inline">Scenarios</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {showDemoMenu && (
                <div
                  className="absolute right-0 mt-2 w-72 rounded-xl bg-white border border-slate-200 shadow-lg py-2 z-50 text-xs"
                  onClick={() => setShowDemoMenu(false)}
                >
                  <div className="px-3 py-1.5 text-2xs font-mono uppercase text-slate-400 font-semibold border-b border-slate-100">
                    Load Benchmark Journey
                  </div>
                  {demoJourneys.map(demo => (
                    <button
                      key={demo.id}
                      onClick={() => {
                        dispatch({ type: 'SET_ACTIVE_VIEW', payload: 'applicant' });
                        dispatch({ type: 'LOAD_DEMO_JOURNEY', payload: demo.id });
                      }}
                      className="w-full text-left px-3 py-2.5 hover:bg-slate-50 flex items-start justify-between gap-2 transition-colors"
                    >
                      <div>
                        <div className="font-semibold text-slate-900">{demo.applicantName}</div>
                        <div className="text-2xs text-slate-500 capitalize">{demo.serviceId}</div>
                      </div>
                      <Badge variant={demo.targetOutcome} size="sm">
                        {demo.targetOutcome}
                      </Badge>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Mode Switcher: Applicant Journey vs Reviewer Workspace */}
            <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs font-medium">
              <button
                onClick={() => dispatch({ type: 'SET_ACTIVE_VIEW', payload: 'applicant' })}
                className={`px-3 py-1 rounded-md transition-all ${
                  state.activeView === 'applicant'
                    ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Applicant View
              </button>

              <button
                onClick={() => dispatch({ type: 'SET_ACTIVE_VIEW', payload: 'reviewer' })}
                className={`px-3 py-1 rounded-md transition-all flex items-center gap-1.5 ${
                  state.activeView === 'reviewer'
                    ? 'bg-slate-900 text-white shadow-2xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Reviewer</span>
                {pendingReviewCount > 0 && (
                  <span className="w-4 h-4 rounded-full bg-purple-600 text-white text-2xs flex items-center justify-center font-mono">
                    {pendingReviewCount}
                  </span>
                )}
              </button>
            </div>

            {/* Reset */}
            <button
              onClick={() => dispatch({ type: 'RESET' })}
              title="Reset application"
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1">{children}</main>

      {/* Modern Civic-Tech Minimal Footer */}
      <footer className="border-t border-slate-200 bg-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-sans">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800">ClearGov Civic Engine</span>
            <span>·</span>
            <span>Zero-Black-Box Public Decision Protocol</span>
          </div>
          <div className="flex items-center gap-4 text-2xs font-mono text-slate-400">
            <span>Deterministic Rules v2026.4</span>
            <span>Tamper-Evident Reasoning</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
