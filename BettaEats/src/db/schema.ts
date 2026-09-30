/**
 * Schema for the BettaEats database.
 *
 * The data lives as JSON under `data/`, is checked by `npm run db:validate`, and is bundled
 * into the app by `npm run db:build`. App code should import *types* from here only
 * (`import type`), so zod stays out of the app bundle.
 *
 * Every record is a strict object: an unknown key such as a misspelled `citationId` is an
 * error rather than being silently dropped.
 */
import { z } from 'zod';

import {
  BUILD_PROFILES,
  COMPOUND_KINDS,
  DIRECTIONS,
  EVIDENCE_LEVELS,
  INDICATION_KINDS,
  INTENTS,
  LICENSES,
  SOURCES,
  STUDY_TYPES,
  SUBJECT_KINDS,
} from './vocab';

/** Stable, human-readable record ids in lowercase kebab-case, e.g. `leafy-nitrates-blood-pressure`. */
export const Id = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'must be lowercase kebab-case');

const Text = z.string().trim().min(1, 'must not be empty');
const Hex = z.string().regex(/^#[0-9a-f]{6}$/i, 'must be a #rrggbb colour');
const Aliases = z.array(Text).default([]);

/** Where a record came from and what it may be redistributed under. Required on every record. */
export const Provenance = z.strictObject({
  source: z.enum(SOURCES),
  /** Location within the source: a file path, database accession, or URL. */
  sourceId: Text,
  license: z.enum(LICENSES),
  /** Date the record was imported or authored, YYYY-MM-DD. */
  retrievedAt: z.iso.date(),
});

const Palette = z.strictObject({ bg: Hex, border: Hex, accent: Hex });

export const FoodGroup = z.strictObject({
  id: Id,
  name: Text,
  emoji: Text,
  palette: Palette,
  provenance: Provenance,
});

export const Food = z.strictObject({
  id: Id,
  name: Text,
  /** Omitted for foods outside the canonical groups, such as olive oil or eggs. */
  groupId: Id.optional(),
  aliases: Aliases,
  provenance: Provenance,
});

export const Compound = z.strictObject({
  id: Id,
  name: Text,
  kind: z.enum(COMPOUND_KINDS),
  aliases: Aliases,
  provenance: Provenance,
});

/** Points at the food, group, or compound a claim is about. */
export const SubjectRef = z.strictObject({ kind: z.enum(SUBJECT_KINDS), id: Id });

/** A food or food group — the things that can contain compounds or be prepared. */
export const ContainerRef = z.strictObject({ kind: z.enum(['group', 'food']), id: Id });

/** A food or group contains a compound. Amounts arrive with the phase-2 composition imports. */
export const Constituent = z.strictObject({
  id: Id,
  subject: ContainerRef,
  compoundId: Id,
  provenance: Provenance,
});

export const BodySystem = z.strictObject({
  id: Id,
  name: Text,
  emoji: Text,
  palette: Palette,
  provenance: Provenance,
});

export const Indication = z.strictObject({
  id: Id,
  name: Text,
  kind: z.enum(INDICATION_KINDS),
  aliases: Aliases,
  /** The body system this belongs under when browsing. Omitted for cross-cutting ones like cancer. */
  systemId: Id.optional(),
  /** A broader indication, e.g. colorectal cancer → cancer. */
  parentId: Id.optional(),
  provenance: Provenance,
});

export const Citation = z
  .strictObject({
    id: Id,
    title: Text,
    /** As cited, e.g. "Siervo M, Lara J, Ogbonmwan I, Mathers JC". */
    authors: Text,
    journal: Text,
    year: z.number().int().min(1900).max(2100),
    pmid: z.string().regex(/^\d{1,9}$/, 'must be a numeric PubMed ID').optional(),
    doi: z.string().regex(/^10\.\d{4,9}\/\S+$/, 'must look like 10.xxxx/…').optional(),
    studyType: z.enum(STUDY_TYPES),
    provenance: Provenance,
  })
  .refine((c) => c.pmid !== undefined || c.doi !== undefined, {
    error: 'a citation needs a PMID or a DOI so it can be resolved',
    path: ['pmid'],
  });

const ClaimBase = {
  id: Id,
  /** What the claim is about: one or more foods, groups, or compounds. */
  subjects: z.array(SubjectRef).min(1, 'a claim needs at least one subject'),
  indicationId: Id,
  direction: z.enum(DIRECTIONS),
  /** Short lead-in for list rows, e.g. "Arterial protection". */
  headline: Text.optional(),
  statement: Text,
  provenance: Provenance,
};

/** Checked against published evidence: a citation, a grade, and an intent are all mandatory. */
const VerifiedClaim = z.strictObject({
  ...ClaimBase,
  status: z.literal('verified'),
  evidenceLevel: z.enum(EVIDENCE_LEVELS),
  intent: z.enum(INTENTS),
  /** e.g. "−4.4 mmHg systolic (95% CI −5.9 to −2.8)". */
  effectSize: Text.optional(),
  citationIds: z.array(Id).min(1, 'a verified claim needs at least one citation'),
});

/**
 * Not yet checked against a source. It deliberately has no evidence level: a grade is a
 * judgment made against citations. Candidate papers may be attached before grading.
 */
const UnverifiedClaim = z.strictObject({
  ...ClaimBase,
  status: z.literal('unverified'),
  intent: z.enum(INTENTS).optional(),
  citationIds: z.array(Id).default([]),
});

export const Claim = z.discriminatedUnion('status', [VerifiedClaim, UnverifiedClaim]);

const PrepBase = {
  id: Id,
  subject: ContainerRef,
  text: Text,
  provenance: Provenance,
};

/** Preparation advice makes factual claims too ("piperine boosts absorption"), so it is cited the same way. */
export const PrepNote = z.discriminatedUnion('status', [
  z.strictObject({
    ...PrepBase,
    status: z.literal('verified'),
    evidenceLevel: z.enum(EVIDENCE_LEVELS),
    citationIds: z.array(Id).min(1, 'a verified prep note needs at least one citation'),
  }),
  z.strictObject({
    ...PrepBase,
    status: z.literal('unverified'),
    citationIds: z.array(Id).default([]),
  }),
]);

/** Every collection, keyed by name, with its record schema and its file under `data/`. */
export const COLLECTIONS = {
  foodGroups: { schema: FoodGroup, file: 'food-groups.json' },
  foods: { schema: Food, file: 'foods.json' },
  compounds: { schema: Compound, file: 'compounds.json' },
  constituents: { schema: Constituent, file: 'constituents.json' },
  systems: { schema: BodySystem, file: 'systems.json' },
  indications: { schema: Indication, file: 'indications.json' },
  claims: { schema: Claim, file: 'claims.json' },
  prepNotes: { schema: PrepNote, file: 'prep-notes.json' },
  citations: { schema: Citation, file: 'citations.json' },
} as const;

export type CollectionName = keyof typeof COLLECTIONS;

/** The bundled database the app reads: every collection, plus the profile it was built for. */
export const Database = z.strictObject({
  profile: z.enum(BUILD_PROFILES),
  foodGroups: z.array(FoodGroup),
  foods: z.array(Food),
  compounds: z.array(Compound),
  constituents: z.array(Constituent),
  systems: z.array(BodySystem),
  indications: z.array(Indication),
  claims: z.array(Claim),
  prepNotes: z.array(PrepNote),
  citations: z.array(Citation),
});

export type Provenance = z.infer<typeof Provenance>;
export type FoodGroup = z.infer<typeof FoodGroup>;
export type Food = z.infer<typeof Food>;
export type Compound = z.infer<typeof Compound>;
export type SubjectRef = z.infer<typeof SubjectRef>;
export type ContainerRef = z.infer<typeof ContainerRef>;
export type Constituent = z.infer<typeof Constituent>;
export type BodySystem = z.infer<typeof BodySystem>;
export type Indication = z.infer<typeof Indication>;
export type Citation = z.infer<typeof Citation>;
export type Claim = z.infer<typeof Claim>;
export type PrepNote = z.infer<typeof PrepNote>;
export type Database = z.infer<typeof Database>;
export type Collections = Omit<Database, 'profile'>;
