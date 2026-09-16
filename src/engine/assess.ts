import {
  ServiceConfig,
  ApplicantData,
  EvidenceState,
  AssessmentResult,
  RequirementEvaluation,
  FinalOutcome,
  NextActionItem,
} from '@/types';

export function runAssessment(
  service: ServiceConfig,
  data: ApplicantData,
  evidenceState: EvidenceState
): AssessmentResult {
  // 1. Evaluate all requirements
  const evaluatedRequirements: RequirementEvaluation[] = service.requirements.map(req =>
    req.evaluate(data, evidenceState)
  );

  const establishedReqs = evaluatedRequirements.filter(r => r.finding === 'ESTABLISHED');
  const notSatisfiedReqs = evaluatedRequirements.filter(r => r.finding === 'NOT SATISFIED');
  const humanReviewReqs = evaluatedRequirements.filter(
    r => r.finding === 'CONTRADICTORY' || r.finding === 'REQUIRES HUMAN CONFIRMATION'
  );
  const additionalEvidenceReqs = evaluatedRequirements.filter(
    r => r.finding === 'MISSING' || r.finding === 'INCOMPLETE' || r.finding === 'UNREADABLE'
  );

  // 2. Strict 4 Final Outcomes determination based on user rules:
  // - A clearly failed condition must NEVER become ADDITIONAL EVIDENCE REQUIRED.
  // - Missing/unreadable evidence must NEVER become CONDITION NOT SATISFIED.
  let outcome: FinalOutcome;
  let canProceed = false;
  let headline = '';
  let executiveSummary = '';

  if (notSatisfiedReqs.length > 0) {
    // Verified evidence proves condition is NOT satisfied
    outcome = 'CONDITION NOT SATISFIED';
    canProceed = false;
    headline = 'Eligibility Condition Not Met';
    const failedNames = notSatisfiedReqs.map(r => `"${r.requirementName}"`).join(', ');
    executiveSummary = `Reliable submitted evidence demonstrates that required condition (${failedNames}) is not met. While other documents may be present, this foundational criterion cannot be satisfied under statutory program guidelines.`;
  } else if (humanReviewReqs.length > 0) {
    // Discrepancies, contradictions or ambiguous information
    outcome = 'HUMAN REVIEW REQUIRED';
    canProceed = false;
    headline = 'Case Escalated for Human Review';
    const reviewNames = humanReviewReqs.map(r => `"${r.requirementName}"`).join(', ');
    executiveSummary = `Automatic determination cannot be completed due to conflicting records or ambiguities in (${reviewNames}). A specialized caseworker has been assigned to verify and confirm the submission.`;
  } else if (additionalEvidenceReqs.length > 0) {
    // Missing, incomplete, unreadable or insufficient evidence
    outcome = 'ADDITIONAL EVIDENCE REQUIRED';
    canProceed = false;
    headline = 'Supplemental Evidence Required';
    const missingDocs = additionalEvidenceReqs.map(r => r.requirementName).join(', ');
    executiveSummary = `Key eligibility requirements (${missingDocs}) cannot yet be established because the supporting evidence is either unreadable, incomplete, or missing. The applicant may submit corrected documentation.`;
  } else {
    // All requirements are ESTABLISHED
    outcome = 'SUFFICIENT EVIDENCE';
    canProceed = true;
    headline = 'All Statutory Criteria Established';
    executiveSummary = `Every required qualification for ${service.name} has been verified against reliable documentation. The application meets all statutory thresholds and is approved to proceed.`;
  }

  // 3. Compile detected issues
  const detectedIssues: AssessmentResult['detectedIssues'] = [];

  evaluatedRequirements.forEach(req => {
    if (req.finding === 'UNREADABLE') {
      detectedIssues.push({
        type: 'unreadable',
        title: `Unreadable Document for ${req.requirementName}`,
        description: req.reasoningChain.explanation,
        evidenceName: req.reasoningChain.evidenceExamined,
        requirementName: req.requirementName,
      });
    } else if (req.finding === 'MISSING') {
      detectedIssues.push({
        type: 'missing',
        title: `Missing Evidence for ${req.requirementName}`,
        description: req.reasoningChain.explanation,
        evidenceName: req.reasoningChain.evidenceExamined,
        requirementName: req.requirementName,
      });
    } else if (req.finding === 'INCOMPLETE') {
      detectedIssues.push({
        type: 'incomplete',
        title: `Incomplete Submission for ${req.requirementName}`,
        description: req.reasoningChain.explanation,
        evidenceName: req.reasoningChain.evidenceExamined,
        requirementName: req.requirementName,
      });
    } else if (req.finding === 'CONTRADICTORY') {
      detectedIssues.push({
        type: 'contradictory',
        title: `Discrepancy in ${req.requirementName}`,
        description: req.reasoningChain.explanation,
        evidenceName: req.reasoningChain.evidenceExamined,
        requirementName: req.requirementName,
      });
    } else if (req.finding === 'REQUIRES HUMAN CONFIRMATION') {
      detectedIssues.push({
        type: 'conflict',
        title: `Manual Confirmation Needed: ${req.requirementName}`,
        description: req.reasoningChain.explanation,
        evidenceName: req.reasoningChain.evidenceExamined,
        requirementName: req.requirementName,
      });
    } else if (req.finding === 'NOT SATISFIED') {
      detectedIssues.push({
        type: 'failed',
        title: `Disqualifying Condition: ${req.requirementName}`,
        description: req.reasoningChain.explanation,
        evidenceName: req.reasoningChain.evidenceExamined,
        requirementName: req.requirementName,
      });
    }
  });

  // 4. Generate direct next actions based on the exact outcome
  const nextActions = generateOutcomeNextActions(
    service,
    outcome,
    evaluatedRequirements,
    additionalEvidenceReqs,
    humanReviewReqs,
    notSatisfiedReqs
  );

  return {
    outcome,
    canProceed,
    headline,
    executiveSummary,
    requirements: evaluatedRequirements,
    establishedCount: establishedReqs.length,
    notEstablishedCount: evaluatedRequirements.length - establishedReqs.length,
    detectedIssues,
    nextActions,
    evaluatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  };
}

function generateOutcomeNextActions(
  service: ServiceConfig,
  outcome: FinalOutcome,
  allReqs: RequirementEvaluation[],
  additionalReqs: RequirementEvaluation[],
  humanReqs: RequirementEvaluation[],
  failedReqs: RequirementEvaluation[]
): NextActionItem[] {
  const actions: NextActionItem[] = [];

  switch (outcome) {
    case 'SUFFICIENT EVIDENCE':
      actions.push({
        id: 'act-1',
        title: 'Confirm Enrollment & Disbursement Preference',
        description: `Your eligibility for ${service.name} is fully verified. Select your direct electronic benefit transfer or institutional grant account.`,
        type: 'success',
        deadline: 'Within 5 business days',
        actionPrompt: 'Set Payment Preference',
      });
      actions.push({
        id: 'act-2',
        title: 'Download Official Determination Certificate',
        description: 'Retain your digitally signed verification record with tamper-proof audit hash for tax and institutional records.',
        type: 'info',
        actionPrompt: 'Download PDF Certificate',
      });
      break;

    case 'CONDITION NOT SATISFIED':
      const failed = failedReqs[0];
      actions.push({
        id: 'act-fail-1',
        title: 'Review Statutory Thresholds & Alternative Relief',
        description: failed
          ? `Your certified actual value (${failed.actualValue}) exceeds the legal limit of ${failed.requiredValue}. You may explore adjacent civic programs tailored to your income band.`
          : 'Review the statutory guidelines and see if your household qualifies for alternative municipal support.',
        type: 'warning',
        actionPrompt: 'Explore Alternative Programs',
      });
      actions.push({
        id: 'act-fail-2',
        title: 'File Administrative Reconsideration / Appeal',
        description: 'If you believe verified evidence has been attributed erroneously or catastrophic changes occurred post-filing, you may request an administrative hearing.',
        type: 'info',
        deadline: '30 days from notice date',
        actionPrompt: 'Request Administrative Hearing',
      });
      break;

    case 'ADDITIONAL EVIDENCE REQUIRED':
      additionalReqs.forEach((r, idx) => {
        let title = `Upload Replacement Document: ${r.reasoningChain.evidenceExamined}`;
        let desc = r.reasoningChain.explanation;
        if (r.finding === 'UNREADABLE') {
          title = `Upload Legible Scan: ${r.reasoningChain.evidenceExamined}`;
          desc = `The currently attached document was flagged as unreadable (blurred, cut-off, or corrupted). Please submit a high-resolution PDF or 300 DPI scan showing all official stamps and signatures.`;
        } else if (r.finding === 'MISSING') {
          title = `Submit Required Document: ${r.reasoningChain.evidenceExamined}`;
          desc = `No document has been attached for ${r.requirementName}. Upload certified official documentation to proceed.`;
        } else if (r.finding === 'INCOMPLETE') {
          title = `Provide Complete Copy: ${r.reasoningChain.evidenceExamined}`;
          desc = `Only partial pages were detected. Please upload the complete multi-page document including summary declaration pages.`;
        }

        actions.push({
          id: `act-add-${idx}`,
          title,
          description: desc,
          type: 'urgent',
          targetEvidenceId: r.relevantEvidenceRuleIds[0],
          deadline: '14 calendar days',
          actionPrompt: 'Replace / Upload Document',
        });
      });

      actions.push({
        id: 'act-add-support',
        title: 'Schedule Civic Navigators Assistance',
        description: 'Need help obtaining certified transcripts or records? Connect with a local civic document specialist free of charge.',
        type: 'info',
        actionPrompt: 'Book Free Guidance Session',
      });
      break;

    case 'HUMAN REVIEW REQUIRED':
      const humanReq = humanReqs[0];
      actions.push({
        id: 'act-rev-1',
        title: 'No Action Needed from Applicant Right Now',
        description: `Your application has been queued with Senior Case Reviewers to clarify ${humanReq ? humanReq.requirementName : 'discrepant submissions'}. You do not need to resubmit unless specifically requested.`,
        type: 'info',
        deadline: 'Estimated review: 2–3 business days',
      });
      actions.push({
        id: 'act-rev-2',
        title: 'Optional: Provide Written Clarification Note',
        description: 'You may submit an optional contextual statement to assist the case officer in interpreting conflicting dates or multi-employer records.',
        type: 'warning',
        actionPrompt: 'Add Contextual Note',
      });
      break;
  }

  return actions;
}
