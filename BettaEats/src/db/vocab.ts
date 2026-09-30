/**
 * Controlled vocabulary for the BettaEats database.
 *
 * Plain constants with no zod dependency, so app screens can import them without
 * pulling the schema library into the bundle. `schema.ts` builds its enums from these.
 */

/** How strong the published evidence behind a verified claim is. */
export const EVIDENCE_LEVELS = [
  'well-established',
  'emerging',
  'mixed',
  'correlational',
  'preclinical',
] as const;
export type EvidenceLevel = (typeof EVIDENCE_LEVELS)[number];

export const EVIDENCE_LABELS: Record<EvidenceLevel, string> = {
  'well-established': 'Well-established',
  emerging: 'Emerging',
  mixed: 'Mixed',
  correlational: 'Correlational',
  preclinical: 'Preclinical',
};

export const EVIDENCE_DESCRIPTIONS: Record<EvidenceLevel, string> = {
  'well-established': 'Consistent human evidence — meta-analyses or multiple RCTs pointing the same way.',
  emerging: 'Promising human data, but limited trials or unsettled effect sizes.',
  mixed: 'Human studies disagree: some show a benefit, others don’t.',
  correlational: 'Observational only. Association is real; causation has not been shown.',
  preclinical: 'Cell or animal work. Mechanistically interesting, not yet shown in people.',
};

/**
 * Whether a claim has been checked against published sources. Unverified claims carry no
 * evidence level at all — a grade is a judgment made against citations.
 */
export const CLAIM_STATUSES = ['verified', 'unverified'] as const;
export type ClaimStatus = (typeof CLAIM_STATUSES)[number];

export const UNVERIFIED_LABEL = 'Unverified';
export const UNVERIFIED_DESCRIPTION =
  'Carried over from an early draft and not yet checked against a published source.';

export const DIRECTIONS = ['protective', 'harmful', 'no-effect', 'context-dependent'] as const;
export type Direction = (typeof DIRECTIONS)[number];

export const INTENTS = ['prevention', 'alleviation', 'treatment'] as const;
export type Intent = (typeof INTENTS)[number];

export const STUDY_TYPES = [
  'meta-analysis',
  'systematic-review',
  'rct',
  'cohort',
  'case-control',
  'cross-sectional',
  'animal',
  'in-vitro',
  'review',
] as const;
export type StudyType = (typeof STUDY_TYPES)[number];

export const STUDY_TYPE_LABELS: Record<StudyType, string> = {
  'meta-analysis': 'Meta-analysis',
  'systematic-review': 'Systematic review',
  rct: 'RCT',
  cohort: 'Cohort study',
  'case-control': 'Case-control study',
  'cross-sectional': 'Cross-sectional study',
  animal: 'Animal study',
  'in-vitro': 'In vitro',
  review: 'Narrative review',
};

/** A condition to prevent or manage, or a positive goal such as microbiome diversity. */
export const INDICATION_KINDS = ['condition', 'goal'] as const;

/** A single molecule, or a family of related ones (anthocyanins, glucosinolates). */
export const COMPOUND_KINDS = ['compound', 'class'] as const;

export const SUBJECT_KINDS = ['group', 'food', 'compound'] as const;
export type SubjectKind = (typeof SUBJECT_KINDS)[number];

/** Where a record came from. `prototype` is the original mock data; `curated` is hand-authored. */
export const SOURCES = [
  'prototype',
  'curated',
  'usda',
  'phenol-explorer',
  'foodb',
  'ctd',
  'pubchem',
] as const;

export const LICENSES = ['original', 'cc0', 'public-domain', 'cc-by-nc', 'nc-permission'] as const;
export type License = (typeof LICENSES)[number];

/** Licenses a commercially distributed build may include. Everything else is research-only. */
export const COMMERCIAL_LICENSES: readonly License[] = ['original', 'cc0', 'public-domain'];

/** `research` ships every record; `commercial` drops anything under a non-commercial license. */
export const BUILD_PROFILES = ['research', 'commercial'] as const;
export type BuildProfile = (typeof BUILD_PROFILES)[number];
