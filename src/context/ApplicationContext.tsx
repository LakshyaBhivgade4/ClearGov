import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import {
  ApplicationState,
  FlowStep,
  ServiceConfig,
  ApplicantData,
  EvidenceState,
  AssessmentResult,
  EvidenceDocument,
  EvidenceStatus,
  ReviewerCase,
  ReviewerDecision,
  FinalOutcome,
} from '@/types';
import { runAssessment } from '@/engine/assess';
import { services, getServiceById } from '@/data/services';
import { demoJourneys, generateInitialReviewerCases } from '@/data/seedApplicants';

type Action =
  | { type: 'SELECT_SERVICE'; payload: ServiceConfig }
  | { type: 'SET_STEP'; payload: FlowStep }
  | { type: 'SET_ACTIVE_VIEW'; payload: 'applicant' | 'reviewer' }
  | { type: 'UPDATE_APPLICANT_DATA'; payload: Record<string, any> }
  | { type: 'SET_EVIDENCE_STATUS'; payload: { ruleId: string; status: EvidenceStatus; issueNotes?: string } }
  | { type: 'ATTACH_EVIDENCE_DOC'; payload: EvidenceDocument }
  | { type: 'REMOVE_EVIDENCE_DOC'; payload: string }
  | { type: 'LOAD_DEMO_JOURNEY'; payload: string } // journey id
  | { type: 'RUN_ASSESSMENT' }
  | { type: 'SELECT_REVIEWER_CASE'; payload: string }
  | {
      type: 'SUBMIT_REVIEWER_DECISION';
      payload: {
        caseId: string;
        action: 'satisfied' | 'not_satisfied' | 'request_evidence';
        requirementId: string;
        notes: string;
        reviewerName: string;
      };
    }
  | { type: 'RESET' };

const defaultService = services[0];
const initialDemo = demoJourneys[0];

const initialState: ApplicationState = {
  currentStep: 'service',
  activeView: 'applicant',
  selectedService: defaultService,
  applicantData: { ...initialDemo.data },
  evidenceState: { ...initialDemo.evidence },
  assessmentResult: null,
  selectedCaseId: 'case-dm-01',
  reviewerCases: generateInitialReviewerCases(),
};

function reducer(state: ApplicationState, action: Action): ApplicationState {
  switch (action.type) {
    case 'SELECT_SERVICE':
      return {
        ...state,
        selectedService: action.payload,
        applicantData: {},
        evidenceState: {},
        assessmentResult: null,
        currentStep: 'info',
      };

    case 'SET_STEP':
      return { ...state, currentStep: action.payload };

    case 'SET_ACTIVE_VIEW':
      return { ...state, activeView: action.payload };

    case 'UPDATE_APPLICANT_DATA':
      return {
        ...state,
        applicantData: { ...state.applicantData, ...action.payload },
      };

    case 'SET_EVIDENCE_STATUS': {
      const existing = state.evidenceState[action.payload.ruleId];
      if (!existing) {
        return state;
      }
      return {
        ...state,
        evidenceState: {
          ...state.evidenceState,
          [action.payload.ruleId]: {
            ...existing,
            status: action.payload.status,
            issueNotes: action.payload.issueNotes !== undefined ? action.payload.issueNotes : existing.issueNotes,
          },
        },
      };
    }

    case 'ATTACH_EVIDENCE_DOC':
      return {
        ...state,
        evidenceState: {
          ...state.evidenceState,
          [action.payload.ruleId]: action.payload,
        },
      };

    case 'REMOVE_EVIDENCE_DOC': {
      const copy = { ...state.evidenceState };
      delete copy[action.payload];
      return {
        ...state,
        evidenceState: copy,
      };
    }

    case 'LOAD_DEMO_JOURNEY': {
      const demo = demoJourneys.find(d => d.id === action.payload);
      if (!demo) return state;
      const srv = getServiceById(demo.serviceId) || state.selectedService;
      const assessment = srv ? runAssessment(srv, demo.data, demo.evidence) : null;
      return {
        ...state,
        selectedService: srv,
        applicantData: { ...demo.data },
        evidenceState: { ...demo.evidence },
        assessmentResult: assessment,
        currentStep: 'assessment', // take user straight to assessment/decision
      };
    }

    case 'RUN_ASSESSMENT': {
      if (!state.selectedService) return state;
      const result = runAssessment(state.selectedService, state.applicantData, state.evidenceState);
      return {
        ...state,
        assessmentResult: result,
      };
    }

    case 'SELECT_REVIEWER_CASE':
      return {
        ...state,
        selectedCaseId: action.payload,
      };

    case 'SUBMIT_REVIEWER_DECISION': {
      const { caseId, action: decAction, requirementId, notes, reviewerName } = action.payload;

      let resultingOutcome: FinalOutcome;
      if (decAction === 'satisfied') {
        resultingOutcome = 'SUFFICIENT EVIDENCE';
      } else if (decAction === 'not_satisfied') {
        resultingOutcome = 'CONDITION NOT SATISFIED';
      } else {
        resultingOutcome = 'ADDITIONAL EVIDENCE REQUIRED';
      }

      const newDecision: ReviewerDecision = {
        action: decAction,
        resultingOutcome,
        reviewerName: reviewerName || 'Senior Case Officer',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' today',
        notes,
        requirementId,
      };

      const updatedCases = state.reviewerCases.map(c => {
        if (c.id !== caseId) return c;
        return {
          ...c,
          currentOutcome: resultingOutcome,
          status: 'resolved' as const,
          reviewerDecisions: [newDecision, ...c.reviewerDecisions],
        };
      });

      return {
        ...state,
        reviewerCases: updatedCases,
      };
    }

    case 'RESET': {
      return {
        ...state,
        currentStep: 'service',
        applicantData: {},
        evidenceState: {},
        assessmentResult: null,
      };
    }

    default:
      return state;
  }
}

interface ApplicationContextValue {
  state: ApplicationState;
  dispatch: React.Dispatch<Action>;
}

const ApplicationContext = createContext<ApplicationContextValue | null>(null);

export function ApplicationProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <ApplicationContext.Provider value={{ state, dispatch }}>
      {children}
    </ApplicationContext.Provider>
  );
}

export function useApplication() {
  const ctx = useContext(ApplicationContext);
  if (!ctx) throw new Error('useApplication must be used within ApplicationProvider');
  return ctx;
}
