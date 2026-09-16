import { ServiceConfig, RequirementEvaluation, EvidenceDocument } from '@/types';

export const services: ServiceConfig[] = [
  {
    id: 'scholarship',
    name: 'Merit & Need Scholarship',
    shortDescription: 'State-funded collegiate scholarship awards',
    description:
      'Provides direct educational grants up to $12,500/year to matriculated students demonstrating academic achievement and verified financial need.',
    icon: 'GraduationCap',
    badge: 'Higher Education Grant',
    fields: [
      { id: 'fullName', label: 'Legal Full Name', type: 'text', placeholder: 'e.g. Maria Chen', required: true, section: 'Applicant Identification' },
      { id: 'email', label: 'Academic / Personal Email', type: 'email', placeholder: 'maria.chen@state.edu', required: true, section: 'Applicant Identification' },
      { id: 'studentId', label: 'Student Identification Number', type: 'text', placeholder: 'STU-982410', required: true, section: 'Applicant Identification' },
      { id: 'institution', label: 'Accredited Institution', type: 'text', placeholder: 'State University', required: true, section: 'Academic Profile' },
      { id: 'gpa', label: 'Cumulative Grade Point Average (GPA)', type: 'number', placeholder: '3.70', min: 0, max: 4, required: true, section: 'Academic Profile', helpText: 'Scale 0.0 - 4.0' },
      { id: 'enrollmentStatus', label: 'Enrollment Status', type: 'select', required: true, section: 'Academic Profile', options: [
        { value: 'full-time', label: 'Full-Time (12+ credits/term)' },
        { value: 'part-time', label: 'Part-Time (6-11 credits/term)' },
        { value: 'not-enrolled', label: 'Non-matriculated' },
      ]},
      { id: 'householdIncome', label: 'Certified Household Annual Income', type: 'number', placeholder: '38000', required: true, section: 'Financial Need', suffix: 'USD' },
      { id: 'householdSize', label: 'Household Size (Tax Dependents)', type: 'number', placeholder: '4', min: 1, required: true, section: 'Financial Need' },
      { id: 'extracurricular', label: 'Civic or Academic Leadership', type: 'textarea', placeholder: 'Summary of community leadership or research projects', required: false, section: 'Civic Engagement' },
    ],
    evidenceRules: [
      {
        id: 'transcript',
        name: 'Certified Academic Transcript',
        description: 'Official digital transcript bearing registrar seal and verified cumulative GPA.',
        reason: 'Statutory verification of academic standard for merit award.',
        required: true,
        acceptedFormats: 'PDF (Digital Signature / Clearinghouse)',
      },
      {
        id: 'tax-return',
        name: 'Federal / State Tax Summary (1040 / W-2)',
        description: 'Prior year tax filing summary or certified IRS transcript.',
        reason: 'Verifies adjusted gross income and eligible dependent count.',
        required: true,
        acceptedFormats: 'PDF or certified scan',
      },
      {
        id: 'enrollment-letter',
        name: 'Registrar Verification of Enrollment',
        description: 'Current term proof of matriculation showing minimum 12 registered credits.',
        reason: 'Confirms active student status for current award cycle.',
        required: true,
        acceptedFormats: 'Official PDF Letterhead',
      },
      {
        id: 'recommendation',
        name: 'Faculty Endorsement Letter',
        description: 'Signed letter from academic advisor or department chair.',
        reason: 'Provides third-party verification of academic good standing.',
        required: false,
        acceptedFormats: 'Signed PDF',
      },
    ],
    requirements: [
      {
        id: 'req-acad',
        name: 'Academic Merit Standard',
        description: 'Must maintain a cumulative GPA of 3.00 or higher on an accredited 4.00 scale.',
        requiredEvidenceIds: ['transcript'],
        evaluate: (data, evidenceMap): RequirementEvaluation => {
          const doc: EvidenceDocument | undefined = evidenceMap['transcript'];
          const declaredGpa = Number(data.gpa || 0);

          if (!doc || doc.status === 'missing') {
            return {
              requirementId: 'req-acad',
              requirementName: 'Academic Merit Standard',
              criterionDescription: 'Minimum 3.00 GPA on accredited scale',
              relevantEvidenceRuleIds: ['transcript'],
              finding: 'MISSING',
              actualValue: 'No transcript submitted',
              requiredValue: '3.00 GPA minimum',
              reasoningChain: {
                requirement: 'Academic Merit Standard (GPA ≥ 3.00)',
                evidenceExamined: 'Certified Academic Transcript',
                finding: 'MISSING',
                explanation: 'No transcript document has been provided to verify student grade standing.',
                subOutcome: 'Cannot verify academic qualification',
              },
              evidenceNotes: 'Missing mandatory transcript.',
              isBlockerForSatisfaction: true,
            };
          }

          if (doc.status === 'unreadable') {
            return {
              requirementId: 'req-acad',
              requirementName: 'Academic Merit Standard',
              criterionDescription: 'Minimum 3.00 GPA on accredited scale',
              relevantEvidenceRuleIds: ['transcript'],
              finding: 'UNREADABLE',
              actualValue: 'Transcript unreadable / illegible',
              requiredValue: '3.00 GPA minimum',
              reasoningChain: {
                requirement: 'Academic Merit Standard (GPA ≥ 3.00)',
                evidenceExamined: `Transcript (${doc.fileName})`,
                finding: 'UNREADABLE',
                explanation: 'Submitted scan is illegible, resolution is too low, or registrar seal is obscured.',
                subOutcome: 'Verification pending readable resubmission',
              },
              evidenceNotes: doc.issueNotes || 'Resolution below 200 DPI; grade lines obscured.',
              isBlockerForSatisfaction: true,
            };
          }

          if (doc.status === 'incomplete') {
            return {
              requirementId: 'req-acad',
              requirementName: 'Academic Merit Standard',
              criterionDescription: 'Minimum 3.00 GPA on accredited scale',
              relevantEvidenceRuleIds: ['transcript'],
              finding: 'INCOMPLETE',
              actualValue: 'Incomplete transcript pages',
              requiredValue: '3.00 GPA minimum',
              reasoningChain: {
                requirement: 'Academic Merit Standard (GPA ≥ 3.00)',
                evidenceExamined: `Transcript (${doc.fileName})`,
                finding: 'INCOMPLETE',
                explanation: 'Only partial semester pages provided; cumulative GPA summary sheet is missing.',
                subOutcome: 'Requires full academic transcript',
              },
              evidenceNotes: doc.issueNotes || 'Page 2 of 2 missing.',
              isBlockerForSatisfaction: true,
            };
          }

          // If evidence is valid/verified, check whether condition is met or failed
          const verifiedGpa = doc.extractedData?.gpa !== undefined ? Number(doc.extractedData.gpa) : declaredGpa;
          if (verifiedGpa >= 3.0) {
            return {
              requirementId: 'req-acad',
              requirementName: 'Academic Merit Standard',
              criterionDescription: 'Minimum 3.00 GPA on accredited scale',
              relevantEvidenceRuleIds: ['transcript'],
              finding: 'ESTABLISHED',
              actualValue: `${verifiedGpa.toFixed(2)} GPA (Verified)`,
              requiredValue: '3.00 GPA minimum',
              reasoningChain: {
                requirement: 'Academic Merit Standard (GPA ≥ 3.00)',
                evidenceExamined: `Official Transcript (${doc.fileName})`,
                finding: 'ESTABLISHED',
                explanation: `Registrar transcript confirms verified cumulative GPA of ${verifiedGpa.toFixed(2)}, which exceeds the 3.00 requirement.`,
                subOutcome: 'Satisfied with high confidence',
              },
              evidenceNotes: 'Official digital cryptographic signature verified from National Clearinghouse.',
              isBlockerForSatisfaction: false,
            };
          } else {
            return {
              requirementId: 'req-acad',
              requirementName: 'Academic Merit Standard',
              criterionDescription: 'Minimum 3.00 GPA on accredited scale',
              relevantEvidenceRuleIds: ['transcript'],
              finding: 'NOT SATISFIED',
              actualValue: `${verifiedGpa.toFixed(2)} GPA (Verified)`,
              requiredValue: '3.00 GPA minimum',
              reasoningChain: {
                requirement: 'Academic Merit Standard (GPA ≥ 3.00)',
                evidenceExamined: `Official Transcript (${doc.fileName})`,
                finding: 'NOT SATISFIED',
                explanation: `Verified cumulative GPA of ${verifiedGpa.toFixed(2)} falls below the statutory 3.00 threshold.`,
                subOutcome: 'Disqualifying statutory failure',
              },
              evidenceNotes: 'Transcript authenticated; GPA below cutoff.',
              isBlockerForSatisfaction: true,
            };
          }
        },
      },
      {
        id: 'req-need',
        name: 'Financial Need Assessment',
        description: 'Household per-capita adjusted gross income must not exceed $25,000.',
        requiredEvidenceIds: ['tax-return'],
        evaluate: (data, evidenceMap): RequirementEvaluation => {
          const doc = evidenceMap['tax-return'];
          const income = Number(data.householdIncome || 0);
          const size = Math.max(1, Number(data.householdSize || 1));
          const perCapita = income / size;

          if (!doc || doc.status === 'missing') {
            return {
              requirementId: 'req-need',
              requirementName: 'Financial Need Assessment',
              criterionDescription: 'Per-capita income ≤ $25,000',
              relevantEvidenceRuleIds: ['tax-return'],
              finding: 'MISSING',
              actualValue: 'No tax documentation',
              requiredValue: '≤ $25,000 / dependent',
              reasoningChain: {
                requirement: 'Financial Need Assessment',
                evidenceExamined: 'Federal / State Tax Summary',
                finding: 'MISSING',
                explanation: 'No tax filings or income verification documents attached to substantiate need.',
                subOutcome: 'Income eligibility unestablished',
              },
              evidenceNotes: 'Required 1040/W-2 missing.',
              isBlockerForSatisfaction: true,
            };
          }

          if (doc.status === 'unreadable') {
            return {
              requirementId: 'req-need',
              requirementName: 'Financial Need Assessment',
              criterionDescription: 'Per-capita income ≤ $25,000',
              relevantEvidenceRuleIds: ['tax-return'],
              finding: 'UNREADABLE',
              actualValue: 'Tax form unreadable',
              requiredValue: '≤ $25,000 / dependent',
              reasoningChain: {
                requirement: 'Financial Need Assessment',
                evidenceExamined: `Tax Return (${doc.fileName})`,
                finding: 'UNREADABLE',
                explanation: 'Wage and tax figures are blurred, cut off at margins, or digitally damaged.',
                subOutcome: 'Cannot verify reported household income',
              },
              evidenceNotes: doc.issueNotes || 'Page resolution below OCR threshold.',
              isBlockerForSatisfaction: true,
            };
          }

          if (doc.status === 'contradictory') {
            return {
              requirementId: 'req-need',
              requirementName: 'Financial Need Assessment',
              criterionDescription: 'Per-capita income ≤ $25,000',
              relevantEvidenceRuleIds: ['tax-return'],
              finding: 'CONTRADICTORY',
              actualValue: `Form shows $${doc.extractedData?.reportedIncome?.toLocaleString()} vs declared $${income.toLocaleString()}`,
              requiredValue: '≤ $25,000 / dependent',
              reasoningChain: {
                requirement: 'Financial Need Assessment',
                evidenceExamined: `Tax Form (${doc.fileName})`,
                finding: 'CONTRADICTORY',
                explanation: `Verified line 11 (AGI) indicates $${doc.extractedData?.reportedIncome?.toLocaleString()} while application self-reported $${income.toLocaleString()}.`,
                subOutcome: 'Discrepancy triggers mandatory human case examination',
              },
              evidenceNotes: 'Material discrepancy between declared income and tax documentation.',
              isBlockerForSatisfaction: true,
            };
          }

          const verifiedIncome = doc.extractedData?.reportedIncome !== undefined ? Number(doc.extractedData.reportedIncome) : income;
          const verifiedPerCapita = verifiedIncome / size;

          if (verifiedPerCapita <= 25000) {
            return {
              requirementId: 'req-need',
              requirementName: 'Financial Need Assessment',
              criterionDescription: 'Per-capita income ≤ $25,000',
              relevantEvidenceRuleIds: ['tax-return'],
              finding: 'ESTABLISHED',
              actualValue: `$${Math.round(verifiedPerCapita).toLocaleString()} / person ($${verifiedIncome.toLocaleString()} total, ${size} dependents)`,
              requiredValue: '≤ $25,000 / dependent',
              reasoningChain: {
                requirement: 'Financial Need Assessment',
                evidenceExamined: `Tax Form (${doc.fileName})`,
                finding: 'ESTABLISHED',
                explanation: `Per-capita income of $${Math.round(verifiedPerCapita).toLocaleString()} conforms to standard aid bracket.`,
                subOutcome: 'Verified and established',
              },
              evidenceNotes: 'IRS tax transcript matched against state department records.',
              isBlockerForSatisfaction: false,
            };
          } else {
            return {
              requirementId: 'req-need',
              requirementName: 'Financial Need Assessment',
              criterionDescription: 'Per-capita income ≤ $25,000',
              relevantEvidenceRuleIds: ['tax-return'],
              finding: 'NOT SATISFIED',
              actualValue: `$${Math.round(verifiedPerCapita).toLocaleString()} / person`,
              requiredValue: '≤ $25,000 / dependent',
              reasoningChain: {
                requirement: 'Financial Need Assessment',
                evidenceExamined: `Tax Form (${doc.fileName})`,
                finding: 'NOT SATISFIED',
                explanation: `Verified per-capita income of $${Math.round(verifiedPerCapita).toLocaleString()} exceeds statutory threshold of $25,000.`,
                subOutcome: 'Exceeds financial qualification limit',
              },
              evidenceNotes: 'Verified income above cutoff limit.',
              isBlockerForSatisfaction: true,
            };
          }
        },
      },
      {
        id: 'req-enrollment',
        name: 'Full-Time Matriculation',
        description: 'Must be officially enrolled full-time (12 or more credit hours in current semester).',
        requiredEvidenceIds: ['enrollment-letter'],
        evaluate: (data, evidenceMap): RequirementEvaluation => {
          const doc = evidenceMap['enrollment-letter'];
          const status = data.enrollmentStatus;

          if (!doc || doc.status === 'missing') {
            return {
              requirementId: 'req-enrollment',
              requirementName: 'Full-Time Matriculation',
              criterionDescription: 'Active full-time enrollment (12+ credits)',
              relevantEvidenceRuleIds: ['enrollment-letter'],
              finding: 'MISSING',
              actualValue: 'No enrollment certificate',
              requiredValue: 'Active Full-Time',
              reasoningChain: {
                requirement: 'Full-Time Matriculation',
                evidenceExamined: 'Registrar Verification of Enrollment',
                finding: 'MISSING',
                explanation: 'No enrollment certificate uploaded from the registrar.',
                subOutcome: 'Enrollment verification incomplete',
              },
              evidenceNotes: 'Missing registrar letter.',
              isBlockerForSatisfaction: true,
            };
          }

          if (status === 'full-time' && doc.status === 'verified') {
            return {
              requirementId: 'req-enrollment',
              requirementName: 'Full-Time Matriculation',
              criterionDescription: 'Active full-time enrollment (12+ credits)',
              relevantEvidenceRuleIds: ['enrollment-letter'],
              finding: 'ESTABLISHED',
              actualValue: 'Full-Time Matriculated (15 credit units)',
              requiredValue: 'Active Full-Time',
              reasoningChain: {
                requirement: 'Full-Time Matriculation',
                evidenceExamined: `Enrollment Letter (${doc.fileName})`,
                finding: 'ESTABLISHED',
                explanation: 'Official registrar letter verifies active full-time matriculation with 15 credits.',
                subOutcome: 'Matriculation verified',
              },
              evidenceNotes: 'Registrar confirmation active for current academic year.',
              isBlockerForSatisfaction: false,
            };
          }

          if (status !== 'full-time' && doc.status === 'verified') {
            return {
              requirementId: 'req-enrollment',
              requirementName: 'Full-Time Matriculation',
              criterionDescription: 'Active full-time enrollment (12+ credits)',
              relevantEvidenceRuleIds: ['enrollment-letter'],
              finding: 'NOT SATISFIED',
              actualValue: status === 'part-time' ? 'Part-Time Enrolled (6 credits)' : 'Not Enrolled',
              requiredValue: 'Active Full-Time',
              reasoningChain: {
                requirement: 'Full-Time Matriculation',
                evidenceExamined: `Enrollment Letter (${doc.fileName})`,
                finding: 'NOT SATISFIED',
                explanation: 'Program guidelines mandate full-time enrollment (≥ 12 units). Certified enrollment is part-time.',
                subOutcome: 'Fails full-time status criterion',
              },
              evidenceNotes: 'Part-time enrollment does not qualify for this award track.',
              isBlockerForSatisfaction: true,
            };
          }

          return {
            requirementId: 'req-enrollment',
            requirementName: 'Full-Time Matriculation',
            criterionDescription: 'Active full-time enrollment (12+ credits)',
            relevantEvidenceRuleIds: ['enrollment-letter'],
            finding: 'REQUIRES HUMAN CONFIRMATION',
            actualValue: 'Ambiguous enrollment timeline',
            requiredValue: 'Active Full-Time',
            reasoningChain: {
              requirement: 'Full-Time Matriculation',
              evidenceExamined: `Enrollment Letter (${doc.fileName})`,
              finding: 'REQUIRES HUMAN CONFIRMATION',
              explanation: 'Letter references an upcoming semester rather than current active academic session.',
              subOutcome: 'Requires registrar liaison review',
            },
            evidenceNotes: 'Date range on verification letter requires manual validation.',
            isBlockerForSatisfaction: true,
          };
        },
      },
    ],
  },
  {
    id: 'housing',
    name: 'Housing Assistance',
    shortDescription: 'Emergency rental relief and rent burden subsidies',
    description:
      'Provides emergency rental assistance and cost-burden vouchers to tenant households facing housing instability or rent-to-income burdens exceeding 40%.',
    icon: 'Home',
    badge: 'Housing Relief Program',
    fields: [
      { id: 'fullName', label: 'Primary Tenant Full Name', type: 'text', placeholder: 'e.g. Marcus Vance', required: true, section: 'Tenant Details' },
      { id: 'email', label: 'Contact Email', type: 'email', placeholder: 'marcus.vance@example.com', required: true, section: 'Tenant Details' },
      { id: 'rentalAddress', label: 'Rental Unit Address', type: 'text', placeholder: '742 Elm St, Apt 4B', required: true, section: 'Lease & Housing' },
      { id: 'monthlyRent', label: 'Contracted Monthly Rent', type: 'number', placeholder: '1450', required: true, section: 'Lease & Housing', suffix: 'USD/mo' },
      { id: 'monthlyIncome', label: 'Gross Monthly Household Income', type: 'number', placeholder: '2600', required: true, section: 'Income Assessment', suffix: 'USD/mo' },
      { id: 'householdSize', label: 'Number of Permanent Occupants', type: 'number', placeholder: '2', min: 1, required: true, section: 'Income Assessment' },
      { id: 'housingStatus', label: 'Current Housing Status', type: 'select', required: true, section: 'Housing Instability', options: [
        { value: 'at-risk', label: 'At Immediate Risk of Eviction (Notice served)' },
        { value: 'severely-burdened', label: 'Severely Cost-Burdened (> 40% income)' },
        { value: 'temporary', label: 'Temporary / Sheltered Arrangement' },
        { value: 'stable', label: 'Stable Lease (No arrears)' },
      ]},
    ],
    evidenceRules: [
      {
        id: 'lease-agreement',
        name: 'Executed Residential Lease Agreement',
        description: 'Complete signed copy of the current residential lease showing tenant names and monthly rent.',
        reason: 'Verifies tenancy legality, address, and contractual rent amount.',
        required: true,
        acceptedFormats: 'PDF (All Pages)',
      },
      {
        id: 'pay-stubs',
        name: 'Consecutive Proof of Income (Pay Stubs / Tax)',
        description: 'Past 60–90 days of payroll stubs or official benefit determination.',
        reason: 'Validates actual monthly gross income to calculate rent-to-income burden.',
        required: true,
        acceptedFormats: 'Official Pay Stubs / Employer Letter',
      },
      {
        id: 'eviction-notice',
        name: 'Notice to Vacate or Rent Demand',
        description: 'Formal written demand from landlord or municipal court notice.',
        reason: 'Establishes statutory urgency for expedited voucher disbursement.',
        required: false,
        acceptedFormats: 'Scanned Notice / Court Docket',
      },
    ],
    requirements: [
      {
        id: 'req-income-cap',
        name: 'Household Area Median Income (AMI) Limit',
        description: 'Annualized household income must not exceed 60% of Area Median Income ($38,500/yr).',
        requiredEvidenceIds: ['pay-stubs'],
        evaluate: (data, evidenceMap): RequirementEvaluation => {
          const doc = evidenceMap['pay-stubs'];
          const monthlyIncome = Number(data.monthlyIncome || 0);
          const annualIncome = monthlyIncome * 12;

          if (!doc || doc.status === 'missing') {
            return {
              requirementId: 'req-income-cap',
              requirementName: 'Household Area Median Income (AMI) Limit',
              criterionDescription: 'Annual income ≤ $38,500 (60% AMI)',
              relevantEvidenceRuleIds: ['pay-stubs'],
              finding: 'MISSING',
              actualValue: 'No income verification submitted',
              requiredValue: '≤ $38,500/year',
              reasoningChain: {
                requirement: 'Household Area Median Income Limit',
                evidenceExamined: 'Consecutive Proof of Income',
                finding: 'MISSING',
                explanation: 'Income documentation is missing; unable to assess AMI eligibility.',
                subOutcome: 'Income verification incomplete',
              },
              evidenceNotes: 'Pay stubs missing.',
              isBlockerForSatisfaction: true,
            };
          }

          if (doc.status === 'unreadable') {
            return {
              requirementId: 'req-income-cap',
              requirementName: 'Household Area Median Income (AMI) Limit',
              criterionDescription: 'Annual income ≤ $38,500 (60% AMI)',
              relevantEvidenceRuleIds: ['pay-stubs'],
              finding: 'UNREADABLE',
              actualValue: 'Income documents illegible',
              requiredValue: '≤ $38,500/year',
              reasoningChain: {
                requirement: 'Household Area Median Income Limit',
                evidenceExamined: `Pay Stubs (${doc.fileName})`,
                finding: 'UNREADABLE',
                explanation: 'Pay slips are darkened, clipped, or have degraded printing preventing income extraction.',
                subOutcome: 'Requires clear replacement scan',
              },
              evidenceNotes: 'OCR read confidence 24%; illegible numbers.',
              isBlockerForSatisfaction: true,
            };
          }

          const verifiedMonthly = doc.extractedData?.monthlyIncome !== undefined ? Number(doc.extractedData.monthlyIncome) : monthlyIncome;
          const verifiedAnnual = verifiedMonthly * 12;

          if (verifiedAnnual <= 38500) {
            return {
              requirementId: 'req-income-cap',
              requirementName: 'Household Area Median Income (AMI) Limit',
              criterionDescription: 'Annual income ≤ $38,500 (60% AMI)',
              relevantEvidenceRuleIds: ['pay-stubs'],
              finding: 'ESTABLISHED',
              actualValue: `$${verifiedAnnual.toLocaleString()}/yr ($${verifiedMonthly.toLocaleString()}/mo)`,
              requiredValue: '≤ $38,500/year',
              reasoningChain: {
                requirement: 'Household Area Median Income Limit',
                evidenceExamined: `Verified Pay Stubs (${doc.fileName})`,
                finding: 'ESTABLISHED',
                explanation: `Verified annual household income of $${verifiedAnnual.toLocaleString()} is within the 60% AMI statutory limit ($38,500).`,
                subOutcome: 'Within statutory income ceilings',
              },
              evidenceNotes: 'Payroll stubs verified with employer electronic direct deposit records.',
              isBlockerForSatisfaction: false,
            };
          } else {
            // Clearly failed condition
            return {
              requirementId: 'req-income-cap',
              requirementName: 'Household Area Median Income (AMI) Limit',
              criterionDescription: 'Annual income ≤ $38,500 (60% AMI)',
              relevantEvidenceRuleIds: ['pay-stubs'],
              finding: 'NOT SATISFIED',
              actualValue: `$${verifiedAnnual.toLocaleString()}/yr (Verified exceeds cap)`,
              requiredValue: '≤ $38,500/year',
              reasoningChain: {
                requirement: 'Household Area Median Income Limit',
                evidenceExamined: `Official Pay Records (${doc.fileName})`,
                finding: 'NOT SATISFIED',
                explanation: `Verified household income of $${verifiedAnnual.toLocaleString()} exceeds the maximum statutory eligibility cap ($38,500) by $${(verifiedAnnual - 38500).toLocaleString()}. Reliable proof confirms the applicant is over the limit.`,
                subOutcome: 'Disqualifying statutory ceiling breach',
              },
              evidenceNotes: 'Income exceeds program limits. Evidence is valid and conclusive.',
              isBlockerForSatisfaction: true,
            };
          }
        },
      },
      {
        id: 'req-rent-burden',
        name: 'Severe Rent Burden Ratio',
        description: 'Rent must consume 40% or more of verified gross household income.',
        requiredEvidenceIds: ['lease-agreement', 'pay-stubs'],
        evaluate: (data, evidenceMap): RequirementEvaluation => {
          const leaseDoc = evidenceMap['lease-agreement'];
          const rent = Number(data.monthlyRent || 0);
          const income = Number(data.monthlyIncome || 0);

          if (!leaseDoc || leaseDoc.status === 'missing') {
            return {
              requirementId: 'req-rent-burden',
              requirementName: 'Severe Rent Burden Ratio',
              criterionDescription: 'Monthly rent ≥ 40% of income',
              relevantEvidenceRuleIds: ['lease-agreement'],
              finding: 'MISSING',
              actualValue: 'No executed lease agreement',
              requiredValue: 'Rent-to-income ≥ 40%',
              reasoningChain: {
                requirement: 'Severe Rent Burden Ratio',
                evidenceExamined: 'Residential Lease Agreement',
                finding: 'MISSING',
                explanation: 'No lease agreement uploaded to establish contracted monthly rental obligation.',
                subOutcome: 'Contracted rent unestablished',
              },
              evidenceNotes: 'Lease missing.',
              isBlockerForSatisfaction: true,
            };
          }

          if (leaseDoc.status === 'unreadable' || leaseDoc.status === 'incomplete') {
            return {
              requirementId: 'req-rent-burden',
              requirementName: 'Severe Rent Burden Ratio',
              criterionDescription: 'Monthly rent ≥ 40% of income',
              relevantEvidenceRuleIds: ['lease-agreement'],
              finding: leaseDoc.status === 'unreadable' ? 'UNREADABLE' : 'INCOMPLETE',
              actualValue: 'Lease document unreadable/incomplete',
              requiredValue: 'Rent-to-income ≥ 40%',
              reasoningChain: {
                requirement: 'Severe Rent Burden Ratio',
                evidenceExamined: `Lease Agreement (${leaseDoc.fileName})`,
                finding: leaseDoc.status === 'unreadable' ? 'UNREADABLE' : 'INCOMPLETE',
                explanation: 'The lease agreement is missing signatures or rental terms page is cut off.',
                subOutcome: 'Cannot verify rent burden formula',
              },
              evidenceNotes: leaseDoc.issueNotes || 'Missing page with signature and rent schedule.',
              isBlockerForSatisfaction: true,
            };
          }

          const ratio = income > 0 ? (rent / income) * 100 : 100;
          if (ratio >= 40) {
            return {
              requirementId: 'req-rent-burden',
              requirementName: 'Severe Rent Burden Ratio',
              criterionDescription: 'Monthly rent ≥ 40% of income',
              relevantEvidenceRuleIds: ['lease-agreement', 'pay-stubs'],
              finding: 'ESTABLISHED',
              actualValue: `${ratio.toFixed(1)}% of income ($${rent}/$${income})`,
              requiredValue: 'Rent-to-income ≥ 40%',
              reasoningChain: {
                requirement: 'Severe Rent Burden Ratio',
                evidenceExamined: `Lease (${leaseDoc.fileName}) + Income`,
                finding: 'ESTABLISHED',
                explanation: `Verified rent consumes ${ratio.toFixed(1)}% of gross income, satisfying the acute burden threshold of 40%.`,
                subOutcome: 'High burden threshold met',
              },
              evidenceNotes: 'Lease terms confirmed; active tenancy verified.',
              isBlockerForSatisfaction: false,
            };
          } else {
            return {
              requirementId: 'req-rent-burden',
              requirementName: 'Severe Rent Burden Ratio',
              criterionDescription: 'Monthly rent ≥ 40% of income',
              relevantEvidenceRuleIds: ['lease-agreement', 'pay-stubs'],
              finding: 'NOT SATISFIED',
              actualValue: `${ratio.toFixed(1)}% of income`,
              requiredValue: 'Rent-to-income ≥ 40%',
              reasoningChain: {
                requirement: 'Severe Rent Burden Ratio',
                evidenceExamined: `Lease (${leaseDoc.fileName}) + Income`,
                finding: 'NOT SATISFIED',
                explanation: `Contracted rent represents ${ratio.toFixed(1)}% of income, which does not reach the statutory 40% burden cutoff.`,
                subOutcome: 'Below required hardship ratio',
              },
              evidenceNotes: 'Tenant does not meet minimum burden requirement.',
              isBlockerForSatisfaction: true,
            };
          }
        },
      },
    ],
  },
  {
    id: 'income-support',
    name: 'Direct Income Support',
    shortDescription: 'Cash assistance for families below subsistence thresholds',
    description:
      'Provides vital economic bridge support to households facing unemployment, illness, or emergency financial disruption.',
    icon: 'Wallet',
    badge: 'Economic Safety Net',
    fields: [
      { id: 'fullName', label: 'Primary Applicant Name', type: 'text', placeholder: 'e.g. Elena Rostova', required: true, section: 'Applicant Information' },
      { id: 'email', label: 'Contact Email', type: 'email', placeholder: 'elena.rostova@example.com', required: true, section: 'Applicant Information' },
      { id: 'monthlyIncome', label: 'Current Monthly Gross Income', type: 'number', placeholder: '650', required: true, section: 'Financial Assessment', suffix: 'USD/mo' },
      { id: 'dependents', label: 'Number of Dependent Children', type: 'number', placeholder: '2', min: 0, required: true, section: 'Family Composition' },
      { id: 'liquidAssets', label: 'Total Liquid Savings & Assets', type: 'number', placeholder: '350', required: true, section: 'Financial Assessment', suffix: 'USD' },
      { id: 'employmentStatus', label: 'Work & Employment Situation', type: 'select', required: true, section: 'Employment', options: [
        { value: 'unemployed-unable', label: 'Unable to Work (Medical / Disability)' },
        { value: 'unemployed-seeking', label: 'Unemployed (Actively seeking work)' },
        { value: 'underemployed', label: 'Partially employed / Precarious hours' },
        { value: 'employed', label: 'Employed Full-time' },
      ]},
    ],
    evidenceRules: [
      {
        id: 'bank-statement',
        name: 'Consecutive 90-Day Bank Account Statements',
        description: 'Official monthly checking and savings transaction ledgers for all household adults.',
        reason: 'Mandatory verification of incoming cash flow, liquid savings, and asset limits.',
        required: true,
        acceptedFormats: 'Bank-Issued PDF Statement',
      },
      {
        id: 'tax-declaration',
        name: 'State Income & Benefits Declaration',
        description: 'Certified declaration form verifying zero or partial prior tax earnings.',
        reason: 'Verifies eligibility against statutory poverty limits.',
        required: true,
        acceptedFormats: 'Signed Declaration PDF',
      },
      {
        id: 'medical-certificate',
        name: 'Attending Physician Disability Statement',
        description: 'Medical certificate confirming incapacity to engage in substantial gainful activity.',
        reason: 'Exempts applicant from mandatory weekly workforce search reporting.',
        required: false,
        acceptedFormats: 'Physician Signed Form',
      },
    ],
    requirements: [
      {
        id: 'req-subsistence',
        name: 'Subsistence Income Threshold',
        description: 'Monthly household income must fall below $1,250 for applicant plus $350 per dependent.',
        requiredEvidenceIds: ['bank-statement', 'tax-declaration'],
        evaluate: (data, evidenceMap): RequirementEvaluation => {
          const bankDoc = evidenceMap['bank-statement'];
          const taxDoc = evidenceMap['tax-declaration'];
          const income = Number(data.monthlyIncome || 0);
          const deps = Number(data.dependents || 0);
          const allowedThreshold = 1250 + deps * 350;

          // Check if bank document is unreadable (demonstrates the specific user requirement:
          // "Income certificate — Unreadable", "Next action — Upload a clearer certificate")
          if (bankDoc && bankDoc.status === 'unreadable') {
            return {
              requirementId: 'req-subsistence',
              requirementName: 'Subsistence Income Threshold',
              criterionDescription: `Household income ≤ $${allowedThreshold}/mo`,
              relevantEvidenceRuleIds: ['bank-statement'],
              finding: 'UNREADABLE',
              actualValue: 'Bank statement scan unreadable',
              requiredValue: `≤ $${allowedThreshold}/mo`,
              reasoningChain: {
                requirement: 'Subsistence Income Threshold',
                evidenceExamined: `Bank Ledger (${bankDoc.fileName})`,
                finding: 'UNREADABLE',
                explanation: 'The submitted bank statement is blurry, low-resolution, or cut off at the transaction ledger. Transaction dates and balance entries cannot be extracted.',
                subOutcome: 'Requirement cannot be established due to unreadable evidence',
              },
              evidenceNotes: bankDoc.issueNotes || 'Low resolution scan; balances unreadable.',
              isBlockerForSatisfaction: true,
            };
          }

          if (!bankDoc || bankDoc.status === 'missing') {
            return {
              requirementId: 'req-subsistence',
              requirementName: 'Subsistence Income Threshold',
              criterionDescription: `Household income ≤ $${allowedThreshold}/mo`,
              relevantEvidenceRuleIds: ['bank-statement'],
              finding: 'MISSING',
              actualValue: 'No bank verification submitted',
              requiredValue: `≤ $${allowedThreshold}/mo`,
              reasoningChain: {
                requirement: 'Subsistence Income Threshold',
                evidenceExamined: '90-Day Bank Account Statements',
                finding: 'MISSING',
                explanation: 'No bank statement attached. Proof of bank deposits is required by regulation.',
                subOutcome: 'Missing mandatory proof of funds',
              },
              evidenceNotes: 'Missing bank statement.',
              isBlockerForSatisfaction: true,
            };
          }

          if (!taxDoc || taxDoc.status === 'missing') {
            return {
              requirementId: 'req-subsistence',
              requirementName: 'Subsistence Income Threshold',
              criterionDescription: `Household income ≤ $${allowedThreshold}/mo`,
              relevantEvidenceRuleIds: ['tax-declaration'],
              finding: 'MISSING',
              actualValue: 'Missing state tax declaration',
              requiredValue: `≤ $${allowedThreshold}/mo`,
              reasoningChain: {
                requirement: 'Subsistence Income Threshold',
                evidenceExamined: 'State Income & Benefits Declaration',
                finding: 'MISSING',
                explanation: 'The signed annual declaration form has not been submitted.',
                subOutcome: 'Declaration missing',
              },
              evidenceNotes: 'State tax declaration document missing.',
              isBlockerForSatisfaction: true,
            };
          }

          if (income <= allowedThreshold) {
            return {
              requirementId: 'req-subsistence',
              requirementName: 'Subsistence Income Threshold',
              criterionDescription: `Household income ≤ $${allowedThreshold}/mo`,
              relevantEvidenceRuleIds: ['bank-statement', 'tax-declaration'],
              finding: 'ESTABLISHED',
              actualValue: `$${income.toLocaleString()}/mo (Threshold: $${allowedThreshold.toLocaleString()})`,
              requiredValue: `≤ $${allowedThreshold}/mo`,
              reasoningChain: {
                requirement: 'Subsistence Income Threshold',
                evidenceExamined: `Bank Statements + Tax Declaration`,
                finding: 'ESTABLISHED',
                explanation: `Verified monthly inflow of $${income} is below the maximum subsistence cutoff of $${allowedThreshold} for a household with ${deps} dependents.`,
                subOutcome: 'Subsistence criteria established',
              },
              evidenceNotes: 'Consistent transaction history confirming declared earnings.',
              isBlockerForSatisfaction: false,
            };
          } else {
            return {
              requirementId: 'req-subsistence',
              requirementName: 'Subsistence Income Threshold',
              criterionDescription: `Household income ≤ $${allowedThreshold}/mo`,
              relevantEvidenceRuleIds: ['bank-statement', 'tax-declaration'],
              finding: 'NOT SATISFIED',
              actualValue: `$${income.toLocaleString()}/mo (Exceeds $${allowedThreshold.toLocaleString()})`,
              requiredValue: `≤ $${allowedThreshold}/mo`,
              reasoningChain: {
                requirement: 'Subsistence Income Threshold',
                evidenceExamined: `Bank Statements + Tax Declaration`,
                finding: 'NOT SATISFIED',
                explanation: `Verified income of $${income} exceeds the program ceiling of $${allowedThreshold}.`,
                subOutcome: 'Exceeds subsistence qualification threshold',
              },
              evidenceNotes: 'Income exceeds program limits.',
              isBlockerForSatisfaction: true,
            };
          }
        },
      },
      {
        id: 'req-asset-cap',
        name: 'Liquid Asset Limitation',
        description: 'Total liquid reserves (checking, savings, stocks) must not exceed $2,000.',
        requiredEvidenceIds: ['bank-statement'],
        evaluate: (data, evidenceMap): RequirementEvaluation => {
          const bankDoc = evidenceMap['bank-statement'];
          const assets = Number(data.liquidAssets || 0);

          if (!bankDoc || bankDoc.status === 'missing' || bankDoc.status === 'unreadable') {
            return {
              requirementId: 'req-asset-cap',
              requirementName: 'Liquid Asset Limitation',
              criterionDescription: 'Total liquid reserves ≤ $2,000',
              relevantEvidenceRuleIds: ['bank-statement'],
              finding: bankDoc?.status === 'unreadable' ? 'UNREADABLE' : 'MISSING',
              actualValue: 'Cannot verify asset balances',
              requiredValue: '≤ $2,000 in liquid assets',
              reasoningChain: {
                requirement: 'Liquid Asset Limitation',
                evidenceExamined: 'Bank Account Statements',
                finding: bankDoc?.status === 'unreadable' ? 'UNREADABLE' : 'MISSING',
                explanation: 'Asset ceiling cannot be determined without a clear closing ledger balance.',
                subOutcome: 'Asset qualification pending',
              },
              evidenceNotes: 'Asset verification linked to bank statement.',
              isBlockerForSatisfaction: true,
            };
          }

          if (assets <= 2000) {
            return {
              requirementId: 'req-asset-cap',
              requirementName: 'Liquid Asset Limitation',
              criterionDescription: 'Total liquid reserves ≤ $2,000',
              relevantEvidenceRuleIds: ['bank-statement'],
              finding: 'ESTABLISHED',
              actualValue: `$${assets.toLocaleString()} liquid savings`,
              requiredValue: '≤ $2,000 in liquid assets',
              reasoningChain: {
                requirement: 'Liquid Asset Limitation',
                evidenceExamined: `Bank Ledger (${bankDoc.fileName})`,
                finding: 'ESTABLISHED',
                explanation: `Verified liquid balances of $${assets} comply with the $2,000 safety net asset cap.`,
                subOutcome: 'Asset test passed',
              },
              evidenceNotes: 'Closing balances within threshold.',
              isBlockerForSatisfaction: false,
            };
          } else {
            return {
              requirementId: 'req-asset-cap',
              requirementName: 'Liquid Asset Limitation',
              criterionDescription: 'Total liquid reserves ≤ $2,000',
              relevantEvidenceRuleIds: ['bank-statement'],
              finding: 'NOT SATISFIED',
              actualValue: `$${assets.toLocaleString()} (Exceeds cap)`,
              requiredValue: '≤ $2,000 in liquid assets',
              reasoningChain: {
                requirement: 'Liquid Asset Limitation',
                evidenceExamined: `Bank Ledger (${bankDoc.fileName})`,
                finding: 'NOT SATISFIED',
                explanation: `Reported liquid assets of $${assets} exceed the $2,000 reserve limit.`,
                subOutcome: 'Fails liquid asset limitation test',
              },
              evidenceNotes: 'Excess reserves disqualify applicant from direct income relief.',
              isBlockerForSatisfaction: true,
            };
          }
        },
      },
    ],
  },
  {
    id: 'healthcare',
    name: 'Healthcare Assistance',
    shortDescription: 'Subsidized health coverage & prescription cost relief',
    description:
      'Provides medical co-pay relief, prescription support, and continuous care vouchers to uninsured or underinsured patients with chronic or acute health conditions.',
    icon: 'HeartPulse',
    badge: 'Essential Health Program',
    fields: [
      { id: 'fullName', label: 'Patient / Beneficiary Full Name', type: 'text', placeholder: 'e.g. David K. Miller', required: true, section: 'Beneficiary Information' },
      { id: 'email', label: 'Contact Email', type: 'email', placeholder: 'david.miller@example.com', required: true, section: 'Beneficiary Information' },
      { id: 'insuranceStatus', label: 'Primary Insurance Coverage Status', type: 'select', required: true, section: 'Insurance & Coverage', options: [
        { value: 'uninsured', label: 'No insurance / Completely uninsured' },
        { value: 'underinsured', label: 'Insured but unaffordable deductibles (> $5,000)' },
        { value: 'employer-dispute', label: 'Terminated / Employer health coverage in dispute' },
        { value: 'insured', label: 'Fully covered under private/public plan' },
      ]},
      { id: 'medicalCondition', label: 'Principal Medical Diagnosis', type: 'select', required: true, section: 'Clinical Need', options: [
        { value: 'chronic-insulin', label: 'Chronic Metabolic (Insulin-dependent diabetes)' },
        { value: 'cardiovascular', label: 'Cardiovascular / Hypertension' },
        { value: 'acute', label: 'Post-Surgical / Acute Recovery' },
        { value: 'general', label: 'Routine wellness & preventive' },
      ]},
      { id: 'annualIncome', label: 'Annual Individual / Household Income', type: 'number', placeholder: '27000', required: true, section: 'Financial Assessment', suffix: 'USD/yr' },
    ],
    evidenceRules: [
      {
        id: 'coverage-letter',
        name: 'Insurer / Employer Coverage Status Verification',
        description: 'Letter from prior insurer or benefits administrator indicating termination date or lack of benefits.',
        reason: 'Verifies statutory coverage gap for subsidized medical assistance.',
        required: true,
        acceptedFormats: 'Official Benefits Letter / COBRA Notice',
      },
      {
        id: 'medical-diagnosis',
        name: 'Clinical Diagnosis & Prescription Treatment Plan',
        description: 'Summary signed by a licensed physician detailing diagnoses and required ongoing medications.',
        reason: 'Establishes medical necessity and program formulary qualification.',
        required: true,
        acceptedFormats: 'Physician Signed Treatment Plan',
      },
      {
        id: 'income-doc',
        name: 'Prior Year W-2 / Tax Filing',
        description: 'Federal tax transcript or W-2 statement.',
        reason: 'Evaluates income percentage relative to Federal Poverty Level.',
        required: true,
        acceptedFormats: 'PDF / IRS Transcript',
      },
    ],
    requirements: [
      {
        id: 'req-coverage-gap',
        name: 'Demonstrated Coverage Gap',
        description: 'Applicant must lack active comprehensive employer or private health coverage.',
        requiredEvidenceIds: ['coverage-letter'],
        evaluate: (data, evidenceMap): RequirementEvaluation => {
          const doc = evidenceMap['coverage-letter'];
          const declaredStatus = data.insuranceStatus;

          if (!doc || doc.status === 'missing') {
            return {
              requirementId: 'req-coverage-gap',
              requirementName: 'Demonstrated Coverage Gap',
              criterionDescription: 'Verified lack of employer/private insurance',
              relevantEvidenceRuleIds: ['coverage-letter'],
              finding: 'MISSING',
              actualValue: 'No coverage verification letter',
              requiredValue: 'Documented lack of coverage',
              reasoningChain: {
                requirement: 'Demonstrated Coverage Gap',
                evidenceExamined: 'Coverage Status Verification',
                finding: 'MISSING',
                explanation: 'No insurance termination or denial letter has been submitted.',
                subOutcome: 'Coverage status unverified',
              },
              evidenceNotes: 'Missing coverage status letter.',
              isBlockerForSatisfaction: true,
            };
          }

          // Case for Contradictory / Human Review Required (David K. Miller demo)
          if (doc.status === 'contradictory') {
            return {
              requirementId: 'req-coverage-gap',
              requirementName: 'Demonstrated Coverage Gap',
              criterionDescription: 'Verified lack of employer/private insurance',
              relevantEvidenceRuleIds: ['coverage-letter'],
              finding: 'CONTRADICTORY',
              actualValue: 'Declared "Uninsured" vs Employer Record "Active Group Plan"',
              requiredValue: 'Documented lack of coverage',
              reasoningChain: {
                requirement: 'Demonstrated Coverage Gap',
                evidenceExamined: `Benefits Letter (${doc.fileName})`,
                finding: 'CONTRADICTORY',
                explanation: 'Applicant self-certified as completely uninsured, but submitted HR separation letter states active health continuation through the end of the quarter. The system cannot automatically reconcile whether coverage was revoked early.',
                subOutcome: 'Conflicting information requires human caseworker confirmation',
              },
              evidenceNotes: 'Applicant claims coverage lapsed; employer letter suggests active enrollment.',
              isBlockerForSatisfaction: true,
            };
          }

          if (declaredStatus === 'uninsured' || declaredStatus === 'underinsured') {
            return {
              requirementId: 'req-coverage-gap',
              requirementName: 'Demonstrated Coverage Gap',
              criterionDescription: 'Verified lack of employer/private insurance',
              relevantEvidenceRuleIds: ['coverage-letter'],
              finding: 'ESTABLISHED',
              actualValue: 'Verified Uninsured (Termination confirmed)',
              requiredValue: 'Documented lack of coverage',
              reasoningChain: {
                requirement: 'Demonstrated Coverage Gap',
                evidenceExamined: `Termination Notice (${doc.fileName})`,
                finding: 'ESTABLISHED',
                explanation: 'Official carrier notice confirms termination of health policy with no active continuation.',
                subOutcome: 'Coverage gap verified',
              },
              evidenceNotes: 'Certified policy lapse confirmed.',
              isBlockerForSatisfaction: false,
            };
          }

          return {
            requirementId: 'req-coverage-gap',
            requirementName: 'Demonstrated Coverage Gap',
            criterionDescription: 'Verified lack of employer/private insurance',
            relevantEvidenceRuleIds: ['coverage-letter'],
            finding: 'NOT SATISFIED',
            actualValue: 'Fully Covered by Comprehensive Insurance',
            requiredValue: 'Documented lack of coverage',
            reasoningChain: {
              requirement: 'Demonstrated Coverage Gap',
              evidenceExamined: `Coverage Verification (${doc.fileName})`,
              finding: 'NOT SATISFIED',
              explanation: 'Documents show active comprehensive insurance coverage in effect.',
              subOutcome: 'Does not meet coverage gap threshold',
            },
            evidenceNotes: 'Existing active policy in place.',
            isBlockerForSatisfaction: true,
          };
        },
      },
      {
        id: 'req-clinical',
        name: 'Qualifying Medical / Formulary Need',
        description: 'Patient must have a diagnosed chronic or acute condition requiring continuous maintenance therapy.',
        requiredEvidenceIds: ['medical-diagnosis'],
        evaluate: (data, evidenceMap): RequirementEvaluation => {
          const doc = evidenceMap['medical-diagnosis'];

          if (!doc || doc.status === 'missing') {
            return {
              requirementId: 'req-clinical',
              requirementName: 'Qualifying Medical / Formulary Need',
              criterionDescription: 'Physician diagnosis of chronic/acute condition',
              relevantEvidenceRuleIds: ['medical-diagnosis'],
              finding: 'MISSING',
              actualValue: 'No medical documentation',
              requiredValue: 'Physician signed clinical plan',
              reasoningChain: {
                requirement: 'Qualifying Medical / Formulary Need',
                evidenceExamined: 'Clinical Diagnosis & Treatment Plan',
                finding: 'MISSING',
                explanation: 'No clinical treatment plan or prescription schedule provided.',
                subOutcome: 'Medical need unestablished',
              },
              evidenceNotes: 'Missing clinical records.',
              isBlockerForSatisfaction: true,
            };
          }

          if (doc.status === 'verified') {
            return {
              requirementId: 'req-clinical',
              requirementName: 'Qualifying Medical / Formulary Need',
              criterionDescription: 'Physician diagnosis of chronic/acute condition',
              relevantEvidenceRuleIds: ['medical-diagnosis'],
              finding: 'ESTABLISHED',
              actualValue: 'Chronic Need Verified (Type 1 Diabetes Mellitus)',
              requiredValue: 'Physician signed clinical plan',
              reasoningChain: {
                requirement: 'Qualifying Medical / Formulary Need',
                evidenceExamined: `Clinical Chart (${doc.fileName})`,
                finding: 'ESTABLISHED',
                explanation: 'Board-certified physician attestation confirms chronic diagnostic code with daily insulin dependency.',
                subOutcome: 'Clinical qualification verified',
              },
              evidenceNotes: 'Physician state medical license number verified.',
              isBlockerForSatisfaction: false,
            };
          }

          return {
            requirementId: 'req-clinical',
            requirementName: 'Qualifying Medical / Formulary Need',
            criterionDescription: 'Physician diagnosis of chronic/acute condition',
            relevantEvidenceRuleIds: ['medical-diagnosis'],
            finding: 'REQUIRES HUMAN CONFIRMATION',
            actualValue: 'Non-formulary diagnosis requires review',
            requiredValue: 'Physician signed clinical plan',
            reasoningChain: {
              requirement: 'Qualifying Medical / Formulary Need',
              evidenceExamined: `Clinical Chart (${doc.fileName})`,
              finding: 'REQUIRES HUMAN CONFIRMATION',
              explanation: 'Diagnosis code requires clinical medical director review for formulary exception.',
              subOutcome: 'Referred to clinical officer',
            },
            evidenceNotes: 'Secondary formulary confirmation needed.',
            isBlockerForSatisfaction: true,
          };
        },
      },
    ],
  },
  {
    id: 'fee-waiver',
    name: 'Education Fee Waiver',
    shortDescription: 'State university semester tuition & fee exemptions',
    description:
      'Waives tuition and mandatory campus fees for eligible public university students facing demonstrated economic hardship.',
    icon: 'BookOpen',
    badge: 'Tuition Waiver Track',
    fields: [
      { id: 'fullName', label: 'Student Legal Name', type: 'text', placeholder: 'e.g. Aisha Patel', required: true, section: 'Student Details' },
      { id: 'email', label: 'University Email', type: 'email', placeholder: 'aisha.patel@state.edu', required: true, section: 'Student Details' },
      { id: 'institution', label: 'University Campus', type: 'text', placeholder: 'State University - Main Campus', required: true, section: 'Enrollment' },
      { id: 'gpa', label: 'Cumulative GPA', type: 'number', placeholder: '3.40', min: 0, max: 4, required: true, section: 'Academic Standing' },
      { id: 'annualTuition', label: 'Current Term Tuition & Campus Fees', type: 'number', placeholder: '6200', required: true, section: 'Billing Details', suffix: 'USD/term' },
      { id: 'householdIncome', label: 'Annual Household Income', type: 'number', placeholder: '31000', required: true, section: 'Household Financials', suffix: 'USD/yr' },
    ],
    evidenceRules: [
      {
        id: 'tuition-billing',
        name: 'Official Bursar Billing Statement',
        description: 'Itemized fee summary statement issued by the bursar for the current academic session.',
        reason: 'Verifies enrolled units, mandatory fees, and non-refundable expenses.',
        required: true,
        acceptedFormats: 'Bursar Electronic PDF Statement',
      },
      {
        id: 'tax-return',
        name: 'Household Federal / State Tax Filing',
        description: 'Prior year tax transcript proving household adjusted gross income.',
        reason: 'Verifies income eligibility for state fee waiver statute.',
        required: true,
        acceptedFormats: 'Certified 1040/W-2',
      },
    ],
    requirements: [
      {
        id: 'req-tuition-burden',
        name: 'Tuition Hardship Ratio',
        description: 'Itemized term fees must exceed 18% of annualized household income.',
        requiredEvidenceIds: ['tuition-billing', 'tax-return'],
        evaluate: (data, evidenceMap): RequirementEvaluation => {
          const bursarDoc = evidenceMap['tuition-billing'];
          const tuition = Number(data.annualTuition || 0);
          const income = Number(data.householdIncome || 0);

          if (!bursarDoc || bursarDoc.status === 'missing') {
            return {
              requirementId: 'req-tuition-burden',
              requirementName: 'Tuition Hardship Ratio',
              criterionDescription: 'Fees > 18% of household income',
              relevantEvidenceRuleIds: ['tuition-billing'],
              finding: 'MISSING',
              actualValue: 'No bursar billing statement',
              requiredValue: 'Tuition > 18% of income',
              reasoningChain: {
                requirement: 'Tuition Hardship Ratio',
                evidenceExamined: 'Official Bursar Billing Statement',
                finding: 'MISSING',
                explanation: 'No current bursar billing invoice attached to establish fee amount.',
                subOutcome: 'Fee burden unestablished',
              },
              evidenceNotes: 'Missing bursar invoice.',
              isBlockerForSatisfaction: true,
            };
          }

          const ratio = income > 0 ? (tuition / income) * 100 : 100;
          if (ratio >= 18) {
            return {
              requirementId: 'req-tuition-burden',
              requirementName: 'Tuition Hardship Ratio',
              criterionDescription: 'Fees > 18% of household income',
              relevantEvidenceRuleIds: ['tuition-billing', 'tax-return'],
              finding: 'ESTABLISHED',
              actualValue: `${ratio.toFixed(1)}% of annual income ($${tuition}/$${income})`,
              requiredValue: 'Tuition > 18% of income',
              reasoningChain: {
                requirement: 'Tuition Hardship Ratio',
                evidenceExamined: `Bursar Statement (${bursarDoc.fileName}) + Tax Return`,
                finding: 'ESTABLISHED',
                explanation: `Verified tuition represents ${ratio.toFixed(1)}% of household income, satisfying statutory fee hardship standard.`,
                subOutcome: 'Hardship threshold met',
              },
              evidenceNotes: 'Bursar electronic invoice matched against university SIS.',
              isBlockerForSatisfaction: false,
            };
          } else {
            return {
              requirementId: 'req-tuition-burden',
              requirementName: 'Tuition Hardship Ratio',
              criterionDescription: 'Fees > 18% of household income',
              relevantEvidenceRuleIds: ['tuition-billing', 'tax-return'],
              finding: 'NOT SATISFIED',
              actualValue: `${ratio.toFixed(1)}% of income`,
              requiredValue: 'Tuition > 18% of income',
              reasoningChain: {
                requirement: 'Tuition Hardship Ratio',
                evidenceExamined: `Bursar Statement (${bursarDoc.fileName}) + Tax Return`,
                finding: 'NOT SATISFIED',
                explanation: `Term fees represent ${ratio.toFixed(1)}% of income, falling below the mandatory 18% hardship requirement.`,
                subOutcome: 'Does not qualify for statutory fee waiver',
              },
              evidenceNotes: 'Fee ratio below required threshold.',
              isBlockerForSatisfaction: true,
            };
          }
        },
      },
    ],
  },
];

export function getServiceById(id: string): ServiceConfig | undefined {
  return services.find(s => s.id === id);
}
