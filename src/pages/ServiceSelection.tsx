import React from 'react';
import { motion } from 'framer-motion';
import {
  GraduationCap,
  Home,
  Wallet,
  HeartPulse,
  BookOpen,
  ArrowRight,
  Shield,
  Sparkles,
} from 'lucide-react';
import { useApplication } from '@/context/ApplicationContext';
import { services } from '@/data/services';
import { demoJourneys } from '@/data/seedApplicants';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ServiceConfig } from '@/types';

const iconMap: Record<string, React.ComponentType<any>> = {
  GraduationCap,
  Home,
  Wallet,
  HeartPulse,
  BookOpen,
};

export function ServiceSelection() {
  const { dispatch } = useApplication();

  const handleSelectService = (service: ServiceConfig) => {
    dispatch({ type: 'SELECT_SERVICE', payload: service });
  };

  const handleLaunchDemo = (journeyId: string) => {
    dispatch({ type: 'LOAD_DEMO_JOURNEY', payload: journeyId });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-12">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-3"
      >
        <div className="flex items-center gap-2">
          <Badge variant="neutral" size="sm">
            Step 1 of 7
          </Badge>
          <span className="text-2xs font-mono text-slate-400">Civic Decision Portal</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Select Public Service Program
        </h1>
        <p className="text-base text-slate-600 max-w-2xl leading-relaxed">
          ClearGov converts public-service rules into explainable eligibility chains. Choose a program below or explore one of the 4 benchmark test scenarios.
        </p>
      </motion.div>

      {/* 4 Hackathon Benchmark Journeys (Quick Access Bar) */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="p-5 rounded-2xl bg-slate-900 text-white shadow-sm space-y-3"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-teal-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-teal-300 font-mono">
              Quick Test: 4 Standard Outcome Scenarios
            </h3>
          </div>
          <span className="text-2xs text-slate-400 font-mono hidden sm:inline">1-Click Full Flow Evaluation</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {demoJourneys.map(d => (
            <button
              key={d.id}
              onClick={() => handleLaunchDemo(d.id)}
              className="p-3 rounded-xl bg-slate-800/90 hover:bg-slate-800 border border-slate-700/80 text-left transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="text-xs font-bold text-white group-hover:text-teal-300 transition-colors">
                    {d.applicantName}
                  </span>
                </div>
                <p className="text-2xs text-slate-400 line-clamp-2">
                  {d.storyDescription}
                </p>
              </div>
              <div className="mt-2.5">
                <Badge variant={d.targetOutcome} size="sm">
                  {d.targetOutcome}
                </Badge>
              </div>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Services Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">
            Available Public Programs ({services.length})
          </h2>
          <span className="text-2xs text-slate-400">Rules configured per statute</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {services.map((service, index) => {
            const Icon = iconMap[service.icon] || GraduationCap;
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
              >
                <Card
                  hover
                  onClick={() => handleSelectService(service)}
                  className="h-full flex flex-col justify-between border-slate-200 hover:border-slate-400 p-6 group transition-all"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-800 group-hover:bg-slate-900 group-hover:text-white transition-colors">
                        <Icon className="w-5 h-5" strokeWidth={1.8} />
                      </div>
                      <span className="text-2xs font-mono font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                        {service.badge}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                        {service.name}
                      </h3>
                      <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                        {service.description}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 group-hover:text-slate-900">
                    <span className="font-mono text-2xs">
                      {service.requirements.length} Statutory Conditions · {service.evidenceRules.length} Evidences
                    </span>
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
