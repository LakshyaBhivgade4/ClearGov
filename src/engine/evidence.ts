import { ServiceConfig, EvidenceState, EvidenceRule, EvidenceDocument, EvidenceStatus } from '@/types';

export interface EvidenceValidationResult {
  complete: boolean;
  hasIssues: boolean;
  totalRequired: number;
  totalOptional: number;
  providedCount: number;
  verifiedCount: number;
  unreadableCount: number;
  incompleteCount: number;
  contradictoryCount: number;
  missingCount: number;
  missingRules: EvidenceRule[];
  problematicRules: { rule: EvidenceRule; doc: EvidenceDocument }[];
  verifiedRules: { rule: EvidenceRule; doc: EvidenceDocument }[];
  optionalPendingRules: EvidenceRule[];
}

export function validateEvidence(
  service: ServiceConfig,
  evidenceState: EvidenceState
): EvidenceValidationResult {
  const required = service.evidenceRules.filter(r => r.required);
  const optional = service.evidenceRules.filter(r => !r.required);

  const missingRules: EvidenceRule[] = [];
  const problematicRules: { rule: EvidenceRule; doc: EvidenceDocument }[] = [];
  const verifiedRules: { rule: EvidenceRule; doc: EvidenceDocument }[] = [];
  const optionalPendingRules: EvidenceRule[] = [];

  let verifiedCount = 0;
  let unreadableCount = 0;
  let incompleteCount = 0;
  let contradictoryCount = 0;
  let providedCount = 0;

  service.evidenceRules.forEach(rule => {
    const doc = evidenceState[rule.id];
    if (!doc || doc.status === 'missing' || !doc.fileName) {
      if (rule.required) {
        missingRules.push(rule);
      } else {
        optionalPendingRules.push(rule);
      }
    } else {
      providedCount++;
      if (doc.status === 'verified') {
        verifiedCount++;
        verifiedRules.push({ rule, doc });
      } else {
        if (doc.status === 'unreadable') unreadableCount++;
        if (doc.status === 'incomplete') incompleteCount++;
        if (doc.status === 'contradictory') contradictoryCount++;
        problematicRules.push({ rule, doc });
      }
    }
  });

  const complete = missingRules.length === 0 && problematicRules.length === 0;
  const hasIssues = problematicRules.length > 0 || missingRules.length > 0;

  return {
    complete,
    hasIssues,
    totalRequired: required.length,
    totalOptional: optional.length,
    providedCount,
    verifiedCount,
    unreadableCount,
    incompleteCount,
    contradictoryCount,
    missingCount: missingRules.length,
    missingRules,
    problematicRules,
    verifiedRules,
    optionalPendingRules,
  };
}

export function createDefaultDocument(rule: EvidenceRule, status: EvidenceStatus = 'verified'): EvidenceDocument {
  const ext = rule.acceptedFormats?.includes('PDF') ? 'pdf' : 'pdf';
  const cleanRuleName = rule.name.replace(/[^a-zA-Z0-9]/g, '_');
  return {
    id: `doc-${Date.now()}-${rule.id}`,
    ruleId: rule.id,
    fileName: `${cleanRuleName}_Verified.${ext}`,
    fileSize: '1.2 MB',
    status,
  };
}
