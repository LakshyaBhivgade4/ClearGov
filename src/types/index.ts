export type ServiceId = 'scholarship' | 'housing' | 'income-support' | 'healthcare' | 'fee-waiver';

export type FieldType = 'text' | 'number' | 'select' | 'textarea' | 'email' | 'date';

export interface SelectOption {
  value: string;
  label: string;
}

export interface FieldConfig {
  id: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  required: boolean;
  section: string;
  options?: SelectOption[];
  helpText?: string;
  min?: number;
  max?: number;
  suffix?: string;
}

export type EvidenceStatus = 'verified' | 'unreadable' | 'incomplete' | 'contradictory' | 'missing';

export interface EvidenceDocument {
  id: string;
  ruleId: string;
  fileName: string;
  fileSize: string;
  status: EvidenceStatus;
  issueNotes?: string;
  extractedData?: Record<string, any>;
  previewUrl?: string;
  fileType?: string;
  uploadedAt?: string;
}

export interface EvidenceRule {
  id: string;
  name: string;
  description: string;
  reason: string;
  required: boolean;
  acceptedFormats?: string;
}

export type RequirementFinding =
  | 'ESTABLISHED'
  | 'NOT SATISFIED'
  | 'MISSING'
  | 'INCOMPLETE'
  | 'UNREADABLE'
  | 'CONTRADICTORY'
  | 'REQUIRES HUMAN CONFIRMATION';

export type FinalOutcome =
  | 'SUFFICIENT EVIDENCE'
  | 'CONDITION NOT SATISFIED'
  | 'ADDITIONAL EVIDENCE REQUIRED'
  | 'HUMAN REVIEW REQUIRED';

export interface RequirementEvaluation {
  requirementId: string;
  requirementName: string;
  criterionDescription: string;
  relevantEvidenceRuleIds: string[];
  finding: RequirementFinding;
  actualValue: string;
  requiredValue: string;
  reasoningChain: {
    requirement: string;
    evidenceExamined: string;
    finding: RequirementFinding;
    explanation: string;
    subOutcome: string;
  };
  evidenceNotes: string;
  isBlockerForSatisfaction: boolean;
}

export interface NextActionItem {
  id: string;
  title: string;
  description: string;
  type: 'success' | 'warning' | 'info' | 'urgent';
  targetEvidenceId?: string;
  actionPrompt?: string;
  deadline?: string;
}

export interface AssessmentResult {
  outcome: FinalOutcome;
  canProceed: boolean;
  headline: string;
  executiveSummary: string;
  requirements: RequirementEvaluation[];
  establishedCount: number;
  notEstablishedCount: number;
  detectedIssues: {
    type: 'missing' | 'unreadable' | 'incomplete' | 'contradictory' | 'failed' | 'conflict';
    title: string;
    description: string;
    evidenceName: string;
    requirementName: string;
  }[];
  nextActions: NextActionItem[];
  evaluatedAt: string;
}

export interface RequirementRule {
  id: string;
  name: string;
  description: string;
  requiredEvidenceIds: string[];
  statutoryThreshold?: {
    label: string;
    value: string | number;
    type: 'min_gpa' | 'max_income' | 'min_burden_percent' | 'custom';
  };
  evaluate: (data: Record<string, any>, evidenceMap: Record<string, EvidenceDocument>) => RequirementEvaluation;
}

export interface ServiceConfig {
  id: ServiceId;
  name: string;
  shortDescription: string;
  description: string;
  icon: string;
  badge: string;
  fields: FieldConfig[];
  evidenceRules: EvidenceRule[];
  requirements: RequirementRule[];
}

export interface ApplicantData {
  [key: string]: any;
}

export interface EvidenceState {
  [evidenceRuleId: string]: EvidenceDocument;
}

export type FlowStep =
  | 'service'
  | 'info'
  | 'evidence'
  | 'review'
  | 'assessment'
  | 'decision'
  | 'next-action';

export interface ReviewerDecision {
  action: 'satisfied' | 'not_satisfied' | 'request_evidence';
  resultingOutcome: FinalOutcome;
  reviewerName: string;
  timestamp: string;
  notes: string;
  requirementId: string;
}

export interface ReviewerCase {
  id: string;
  applicantName: string;
  applicantEmail: string;
  serviceId: ServiceId;
  serviceName: string;
  submittedAt: string;
  applicantData: ApplicantData;
  evidenceState: EvidenceState;
  detectedIssue: string;
  evidenceInvolved: string[];
  initialOutcome: FinalOutcome;
  currentOutcome: FinalOutcome;
  assessmentResult: AssessmentResult;
  reviewerDecisions: ReviewerDecision[];
  status: 'pending' | 'resolved';
}

export interface ApplicationHistoryRecord {
  id: string;
  submittedAt: string;
  serviceId: ServiceId;
  serviceName: string;
  applicantName: string;
  applicantEmail: string;
  finalOutcome: FinalOutcome;
  establishedCount: number;
  totalConditions: number;
  summary: string;
}

export interface SystemAuditLogEntry {
  id: string;
  timestamp: string;
  actor: string;
  actorRole: 'Citizen Applicant' | 'Senior Reviewer' | 'Program Administrator' | 'System Engine';
  action: string;
  target: string;
  hash: string;
}

export interface ApplicationState {
  currentStep: FlowStep;
  activeView: 'applicant' | 'reviewer' | 'admin';
  selectedService: ServiceConfig | null;
  applicantData: ApplicantData;
  evidenceState: EvidenceState;
  assessmentResult: AssessmentResult | null;
  selectedCaseId?: string;
  reviewerCases: ReviewerCase[];
  applicationHistory: ApplicationHistoryRecord[];
  systemAuditLogs: SystemAuditLogEntry[];
  allServices: ServiceConfig[];
}
