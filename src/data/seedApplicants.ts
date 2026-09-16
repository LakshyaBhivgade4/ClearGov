import {
  ServiceId,
  ApplicantData,
  EvidenceState,
  FinalOutcome,
  ReviewerCase,
} from '@/types';
import { services, getServiceById } from '@/data/services';
import { runAssessment } from '@/engine/assess';

export interface DemoJourney {
  id: string;
  applicantName: string;
  serviceId: ServiceId;
  targetOutcome: FinalOutcome;
  badgeLabel: string;
  badgeColor: string;
  storyDescription: string;
  data: ApplicantData;
  evidence: EvidenceState;
}

export const demoJourneys: DemoJourney[] = [
  // 1. Scholarship → SUFFICIENT EVIDENCE
  {
    id: 'demo-scholarship-sufficient',
    applicantName: 'Maria Chen',
    serviceId: 'scholarship',
    targetOutcome: 'SUFFICIENT EVIDENCE',
    badgeLabel: '🟢 SUFFICIENT EVIDENCE',
    badgeColor: 'emerald',
    storyDescription: 'All statutory requirements established with cryptographic registrar transcript and IRS tax transcript.',
    data: {
      fullName: 'Maria Chen',
      email: 'maria.chen@state.edu',
      studentId: 'STU-884912',
      institution: 'State University - College of Engineering',
      gpa: 3.82,
      enrollmentStatus: 'full-time',
      householdIncome: 38000,
      householdSize: 4,
      extracurricular: 'Student Senate Vice Chair; Volunteer high school robotics mentor (120+ documented community service hours).',
    },
    evidence: {
      transcript: {
        id: 'ev-mc-1',
        ruleId: 'transcript',
        fileName: 'Official_Transcript_MariaChen_Verified.pdf',
        fileSize: '1.4 MB',
        status: 'verified',
        extractedData: { gpa: 3.82, degree: 'B.S. Computer Science' },
      },
      'tax-return': {
        id: 'ev-mc-2',
        ruleId: 'tax-return',
        fileName: 'IRS_Transcript_1040_2025_Chen.pdf',
        fileSize: '2.1 MB',
        status: 'verified',
        extractedData: { reportedIncome: 38000, dependents: 4 },
      },
      'enrollment-letter': {
        id: 'ev-mc-3',
        ruleId: 'enrollment-letter',
        fileName: 'Registrar_Matriculation_Fall2026.pdf',
        fileSize: '820 KB',
        status: 'verified',
        extractedData: { credits: 15, status: 'full-time' },
      },
      recommendation: {
        id: 'ev-mc-4',
        ruleId: 'recommendation',
        fileName: 'Faculty_Recommendation_DrKowalski.pdf',
        fileSize: '650 KB',
        status: 'verified',
      },
    },
  },

  // 2. Housing Assistance → CONDITION NOT SATISFIED
  {
    id: 'demo-housing-failed',
    applicantName: 'Marcus Vance',
    serviceId: 'housing',
    targetOutcome: 'CONDITION NOT SATISFIED',
    badgeLabel: '🔴 CONDITION NOT SATISFIED',
    badgeColor: 'rose',
    storyDescription: 'Reliable verified payroll records confirm household income exceeds the legal 60% AMI ceiling ($38,500).',
    data: {
      fullName: 'Marcus Vance',
      email: 'marcus.vance@example.com',
      rentalAddress: '742 Elm St, Apt 4B',
      monthlyRent: 1450,
      monthlyIncome: 4500, // $54,000/yr -> Exceeds $38,500 limit
      householdSize: 2,
      housingStatus: 'severely-burdened',
    },
    evidence: {
      'lease-agreement': {
        id: 'ev-mv-1',
        ruleId: 'lease-agreement',
        fileName: 'Executed_Lease_ElmSt_Unit4B.pdf',
        fileSize: '3.2 MB',
        status: 'verified',
        extractedData: { monthlyRent: 1450, tenantName: 'Marcus Vance' },
      },
      'pay-stubs': {
        id: 'ev-mv-2',
        ruleId: 'pay-stubs',
        fileName: 'Certified_PayStubs_Q2_2026.pdf',
        fileSize: '1.8 MB',
        status: 'verified',
        extractedData: { monthlyIncome: 4500, employer: 'Apex Logistics Inc' },
      },
    },
  },

  // 3. Income Support → ADDITIONAL EVIDENCE REQUIRED
  {
    id: 'demo-income-additional',
    applicantName: 'Elena Rostova',
    serviceId: 'income-support',
    targetOutcome: 'ADDITIONAL EVIDENCE REQUIRED',
    badgeLabel: '🟡 ADDITIONAL EVIDENCE REQUIRED',
    badgeColor: 'amber',
    storyDescription: 'Bank statement scan is blurry and unreadable; State Tax Declaration is missing. Proof cannot be established.',
    data: {
      fullName: 'Elena Rostova',
      email: 'elena.rostova@example.com',
      monthlyIncome: 750,
      dependents: 2,
      liquidAssets: 420,
      employmentStatus: 'underemployed',
    },
    evidence: {
      'bank-statement': {
        id: 'ev-er-1',
        ruleId: 'bank-statement',
        fileName: 'Mobile_Photo_Bank_Statement_Scan.jpg',
        fileSize: '480 KB',
        status: 'unreadable',
        issueNotes: 'Low resolution (72 DPI). Heavy glare obscures monthly ending balances and deposit ledger.',
      },
      'tax-declaration': {
        id: 'ev-er-2',
        ruleId: 'tax-declaration',
        fileName: '',
        fileSize: '',
        status: 'missing',
        issueNotes: 'Mandatory state benefit declaration document has not been uploaded.',
      },
    },
  },

  // 4. Healthcare Assistance → HUMAN REVIEW REQUIRED
  {
    id: 'demo-healthcare-review',
    applicantName: 'David K. Miller',
    serviceId: 'healthcare',
    targetOutcome: 'HUMAN REVIEW REQUIRED',
    badgeLabel: '🟣 HUMAN REVIEW REQUIRED',
    badgeColor: 'purple',
    storyDescription: 'Applicant declared "Uninsured" but employer severance record indicates active group health plan benefits.',
    data: {
      fullName: 'David K. Miller',
      email: 'david.miller@example.com',
      insuranceStatus: 'uninsured',
      medicalCondition: 'chronic-insulin',
      annualIncome: 26500,
    },
    evidence: {
      'coverage-letter': {
        id: 'ev-dm-1',
        ruleId: 'coverage-letter',
        fileName: 'Employer_Separation_Notice_HR.pdf',
        fileSize: '950 KB',
        status: 'contradictory',
        issueNotes: 'Direct conflict: Form states "Uninsured", but page 2 states health benefits remain active through Q3.',
      },
      'medical-diagnosis': {
        id: 'ev-dm-2',
        ruleId: 'medical-diagnosis',
        fileName: 'Endocrinology_CarePlan_Signed.pdf',
        fileSize: '1.2 MB',
        status: 'verified',
        extractedData: { condition: 'Type 1 Diabetes Mellitus', prescription: 'Insulin Glargine' },
      },
      'income-doc': {
        id: 'ev-dm-3',
        ruleId: 'income-doc',
        fileName: 'W2_PriorYear_Miller.pdf',
        fileSize: '1.1 MB',
        status: 'verified',
        extractedData: { reportedIncome: 26500 },
      },
    },
  },
];

export function getDemoById(id: string): DemoJourney | undefined {
  return demoJourneys.find(d => d.id === id);
}

// Generate initial reviewer inbox cases
export function generateInitialReviewerCases(): ReviewerCase[] {
  const initialCases: ReviewerCase[] = [
    {
      id: 'case-dm-01',
      applicantName: 'David K. Miller',
      applicantEmail: 'david.miller@example.com',
      serviceId: 'healthcare',
      serviceName: 'Healthcare Assistance',
      submittedAt: 'Today, 09:42 AM',
      applicantData: demoJourneys[3].data,
      evidenceState: demoJourneys[3].evidence,
      detectedIssue: 'Discrepancy: Self-reported Uninsured vs Employer notice showing active group policy through Q3.',
      evidenceInvolved: ['Employer_Separation_Notice_HR.pdf', 'Endocrinology_CarePlan_Signed.pdf'],
      initialOutcome: 'HUMAN REVIEW REQUIRED',
      currentOutcome: 'HUMAN REVIEW REQUIRED',
      assessmentResult: runAssessment(getServiceById('healthcare')!, demoJourneys[3].data, demoJourneys[3].evidence),
      reviewerDecisions: [],
      status: 'pending',
    },
    {
      id: 'case-er-02',
      applicantName: 'Elena Rostova',
      applicantEmail: 'elena.rostova@example.com',
      serviceId: 'income-support',
      serviceName: 'Direct Income Support',
      submittedAt: 'Today, 08:15 AM',
      applicantData: demoJourneys[2].data,
      evidenceState: demoJourneys[2].evidence,
      detectedIssue: 'Evidence deficiency: Bank statement is unreadable (72 DPI scan); tax declaration is missing.',
      evidenceInvolved: ['Mobile_Photo_Bank_Statement_Scan.jpg'],
      initialOutcome: 'ADDITIONAL EVIDENCE REQUIRED',
      currentOutcome: 'ADDITIONAL EVIDENCE REQUIRED',
      assessmentResult: runAssessment(getServiceById('income-support')!, demoJourneys[2].data, demoJourneys[2].evidence),
      reviewerDecisions: [],
      status: 'pending',
    },
    {
      id: 'case-al-03',
      applicantName: 'Amina Al-Mansoor',
      applicantEmail: 'amina.m@example.edu',
      serviceId: 'scholarship',
      serviceName: 'Merit & Need Scholarship',
      submittedAt: 'Yesterday, 04:30 PM',
      applicantData: {
        fullName: 'Amina Al-Mansoor',
        email: 'amina.m@example.edu',
        studentId: 'STU-491023',
        institution: 'Polytechnic Institute',
        gpa: 3.65,
        enrollmentStatus: 'full-time',
        householdIncome: 34000,
        householdSize: 3,
      },
      evidenceState: {
        transcript: {
          id: 'ev-am-1',
          ruleId: 'transcript',
          fileName: 'Polytechnic_Transcript_Amina.pdf',
          fileSize: '1.2 MB',
          status: 'verified',
          extractedData: { gpa: 3.65 },
        },
        'tax-return': {
          id: 'ev-am-2',
          ruleId: 'tax-return',
          fileName: 'TaxSummary_Foreign_Income_Statement.pdf',
          fileSize: '2.4 MB',
          status: 'contradictory',
          issueNotes: 'Foreign currency exchange rate used on statement requires human verification against state treasury conversion index.',
        },
        'enrollment-letter': {
          id: 'ev-am-3',
          ruleId: 'enrollment-letter',
          fileName: 'Enrollment_Cert_Amina.pdf',
          fileSize: '650 KB',
          status: 'verified',
        },
      },
      detectedIssue: 'Currency conversion verification needed for foreign source income documentation.',
      evidenceInvolved: ['TaxSummary_Foreign_Income_Statement.pdf'],
      initialOutcome: 'HUMAN REVIEW REQUIRED',
      currentOutcome: 'HUMAN REVIEW REQUIRED',
      assessmentResult: runAssessment(getServiceById('scholarship')!, {
        fullName: 'Amina Al-Mansoor',
        email: 'amina.m@example.edu',
        studentId: 'STU-491023',
        institution: 'Polytechnic Institute',
        gpa: 3.65,
        enrollmentStatus: 'full-time',
        householdIncome: 34000,
        householdSize: 3,
      }, {
        transcript: {
          id: 'ev-am-1',
          ruleId: 'transcript',
          fileName: 'Polytechnic_Transcript_Amina.pdf',
          fileSize: '1.2 MB',
          status: 'verified',
          extractedData: { gpa: 3.65 },
        },
        'tax-return': {
          id: 'ev-am-2',
          ruleId: 'tax-return',
          fileName: 'TaxSummary_Foreign_Income_Statement.pdf',
          fileSize: '2.4 MB',
          status: 'contradictory',
          issueNotes: 'Foreign currency exchange rate used on statement requires human verification against state treasury conversion index.',
        },
        'enrollment-letter': {
          id: 'ev-am-3',
          ruleId: 'enrollment-letter',
          fileName: 'Enrollment_Cert_Amina.pdf',
          fileSize: '650 KB',
          status: 'verified',
        },
      }),
      reviewerDecisions: [],
      status: 'pending',
    },
  ];

  return initialCases;
}
