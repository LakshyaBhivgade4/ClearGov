import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  ShieldCheck,
  FileCheck,
  HelpCircle,
  Sparkles,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  UserCheck,
  ChevronRight,
  Sliders,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useApplication } from '@/context/ApplicationContext';
import { demoJourneys } from '@/data/seedApplicants';

export function Landing() {
  const navigate = useNavigate();
  const { dispatch } = useApplication();

  const handleLaunchScenario = (journeyId: string) => {
    dispatch({ type: 'SET_ACTIVE_VIEW', payload: 'applicant' });
    dispatch({ type: 'LOAD_DEMO_JOURNEY', payload: journeyId });
    navigate('/apply');
  };

  const handleOpenReviewer = () => {
    dispatch({ type: 'SET_ACTIVE_VIEW', payload: 'reviewer' });
    navigate('/apply');
  };

  const handleOpenAdmin = () => {
    dispatch({ type: 'SET_ACTIVE_VIEW', payload: 'admin' });
    navigate('/apply');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fafafa] selection:bg-slate-900 selection:text-white">
      {/* Navigation Header */}
      <header className="border-b border-slate-200/80 bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-950 flex items-center justify-center text-white font-extrabold text-xs">
              CG
            </div>
            <div>
              <span className="text-base font-bold text-slate-900 tracking-tight block leading-tight">
                ClearGov
              </span>
              <span className="text-2xs text-slate-400 font-mono">
                Explainable Civic Decision Platform
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleOpenReviewer}
              className="text-xs font-medium"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reviewer Workspace</span>
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleOpenAdmin}
              className="text-xs font-medium"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Admin</span>
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                dispatch({ type: 'SET_ACTIVE_VIEW', payload: 'applicant' });
                dispatch({ type: 'SET_STEP', payload: 'service' });
                navigate('/apply');
              }}
              className="text-xs"
            >
              Start Application
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="py-16 sm:py-24 px-4 sm:px-6 max-w-5xl mx-auto text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-mono font-medium"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
            <span>Civic Tech Decision Engine · 2026 Standards</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="text-4xl sm:text-6xl font-extrabold text-slate-950 tracking-tight leading-[1.1]"
          >
            Public services should <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-950 via-slate-800 to-slate-600">
              explain themselves.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed"
          >
            ClearGov turns bureaucratic public-service determinations into transparent, verified decisions. See exactly what has been established, what cannot yet be established, and what direct next action to take.
          </motion.p>

          {/* Primary CTA Buttons for All 3 Experiences */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="flex flex-wrap items-center justify-center gap-3 pt-2"
          >
            <Button
              size="lg"
              onClick={() => {
                dispatch({ type: 'SET_ACTIVE_VIEW', payload: 'applicant' });
                dispatch({ type: 'SET_STEP', payload: 'service' });
                navigate('/apply');
              }}
              className="text-sm px-6 py-3 font-semibold"
            >
              Applicant Journey
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={handleOpenReviewer}
              className="text-sm px-6 py-3 font-semibold"
            >
              <UserCheck className="w-4 h-4" />
              Reviewer Workspace
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={handleOpenAdmin}
              className="text-sm px-6 py-3 font-semibold"
            >
              <Sliders className="w-4 h-4" />
              Admin Console
            </Button>
          </motion.div>

          {/* The Core Visual Chain */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="pt-12"
          >
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm text-left">
              <div className="text-2xs font-mono uppercase font-bold tracking-widest text-slate-400 mb-4 text-center">
                The ClearGov Decision Chain
              </div>
              <div className="grid grid-cols-2 md:grid-cols-6 gap-3 text-center">
                {[
                  { step: '01', title: 'Information', desc: 'Self-declared applicant details' },
                  { step: '02', title: 'Evidence', desc: 'Document verification & OCR check' },
                  { step: '03', title: 'Assessment', desc: 'Deterministic criteria evaluation' },
                  { step: '04', title: 'Explanation', desc: 'Plain-language statutory audit' },
                  { step: '05', title: 'Decision', desc: 'Strict 4-outcome civic certificate' },
                  { step: '06', title: 'Next Action', desc: 'Direct, actionable next step' },
                ].map((node, i) => (
                  <div
                    key={node.step}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex flex-col justify-between"
                  >
                    <div>
                      <span className="text-2xs font-mono font-bold text-slate-400 block mb-1">
                        {node.step}
                      </span>
                      <h4 className="text-xs font-bold text-slate-900">{node.title}</h4>
                    </div>
                    <p className="text-2xs text-slate-500 mt-1 leading-snug">{node.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </section>

        {/* 4 Standard Hackathon Benchmarks Section */}
        <section className="py-12 bg-white border-y border-slate-200/80 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
              <div>
                <span className="text-2xs font-mono uppercase tracking-wider text-teal-700 font-bold">
                  Hackathon Evaluation Scenarios
                </span>
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                  Test the 4 Exact Final Civic Outcomes
                </h2>
              </div>
              <p className="text-xs text-slate-500 max-w-md">
                Load fully-populated applications showing how real evidence flaws translate into explainable decisions.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {demoJourneys.map(demo => (
                <div
                  key={demo.id}
                  className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-slate-300 hover:shadow-sm transition-all flex flex-col justify-between space-y-4 text-left"
                >
                  <div className="space-y-2">
                    <Badge variant={demo.targetOutcome} size="sm">
                      {demo.targetOutcome}
                    </Badge>
                    <h3 className="text-sm font-bold text-slate-900">{demo.applicantName}</h3>
                    <span className="text-2xs font-mono text-slate-400 capitalize block">
                      Program: {demo.serviceId}
                    </span>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {demo.storyDescription}
                    </p>
                  </div>

                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleLaunchScenario(demo.id)}
                    className="w-full text-xs font-semibold"
                  >
                    Evaluate Journey
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Guarantees & Philosophy */}
        <section className="py-16 px-4 sm:px-6 max-w-5xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-slate-900">
              Deterministic, Not Probabilistic
            </h2>
            <p className="text-sm text-slate-500 max-w-xl mx-auto">
              ClearGov eliminates hallucination by grounding every civic finding in statutory code and verified evidence.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
            <div className="p-6 rounded-xl border border-slate-200 bg-white space-y-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs">
                ✓
              </div>
              <h3 className="text-sm font-bold text-slate-900">Strict Non-Conflation</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Missing or unreadable evidence is never misdiagnosed as failure. Failed conditions are never dismissed as missing docs.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-slate-200 bg-white space-y-2">
              <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center font-bold text-xs">
                ⚖
              </div>
              <h3 className="text-sm font-bold text-slate-900">Human-In-The-Loop</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                When documents contradict self-reports, decisions are routed directly to authorized case officers for manual adjudication.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-slate-200 bg-white space-y-2">
              <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center font-bold text-xs">
                →
              </div>
              <h3 className="text-sm font-bold text-slate-900">Direct Next Action</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Every applicant leaves knowing exactly what to do next—whether that's uploading a 300 DPI scan or filing an administrative hearing.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
