/**
 * Read-only access to the bundled database, for app screens.
 *
 * db.generated.json is validated when it is built (`npm run db:build`), so it is trusted here
 * rather than re-parsed at startup. Only types come from ./schema, which keeps zod out of the
 * app bundle.
 */
import raw from './db.generated.json';
import type {
  BodySystem,
  Citation,
  Claim,
  Compound,
  Database,
  Food,
  FoodGroup,
  Indication,
  PrepNote,
  SubjectRef,
} from './schema';
import type { EvidenceLevel } from './vocab';

export const db = raw as unknown as Database;

const byId = <T extends { id: string }>(items: T[]) => new Map(items.map((item) => [item.id, item]));
const groupsById = byId(db.foodGroups);
const foodsById = byId(db.foods);
const compoundsById = byId(db.compounds);
const systemsById = byId(db.systems);
const indicationsById = byId(db.indications);
const citationsById = byId(db.citations);

const unique = <T,>(items: T[]) => [...new Set(items)];
const defined = <T,>(item: T | undefined): item is T => item !== undefined;

export const getGroup = (id: string): FoodGroup | undefined => groupsById.get(id);
export const getSystem = (id: string): BodySystem | undefined => systemsById.get(id);
export const getIndication = (id: string): Indication | undefined => indicationsById.get(id);

export const foodsInGroup = (groupId: string): Food[] => db.foods.filter((f) => f.groupIds.includes(groupId));

/** True when a subject reference is the group itself or one of the group's foods. */
function refersToGroup(ref: SubjectRef, groupId: string): boolean {
  if (ref.kind === 'group') return ref.id === groupId;
  if (ref.kind === 'food') return foodsById.get(ref.id)?.groupIds.includes(groupId) ?? false;
  return false;
}

/** Key compounds recorded for the group or any of its foods, in data order. */
export function compoundsForGroup(groupId: string): Compound[] {
  const ids = db.constituents.filter((c) => refersToGroup(c.subject, groupId)).map((c) => c.compoundId);
  return unique(ids).map((id) => compoundsById.get(id)).filter(defined);
}

/**
 * Claims naming the group or one of its foods. Claims reached only through a compound the group
 * contains are left to the compound pages, since trace amounts would otherwise attach every
 * quercetin claim to every food with a little quercetin in it.
 */
export const claimsForGroup = (groupId: string): Claim[] =>
  db.claims.filter((c) => c.subjects.some((s) => refersToGroup(s, groupId)));

export const prepNotesForGroup = (groupId: string): PrepNote[] =>
  db.prepNotes.filter((p) => refersToGroup(p.subject, groupId));

/** The indications a set of claims address, in first-mention order. */
export const indicationsOf = (claims: Claim[]): Indication[] =>
  unique(claims.map((c) => c.indicationId)).map((id) => indicationsById.get(id)).filter(defined);

export interface IndicationClaims {
  indication: Indication;
  claims: Claim[];
}

/** Claims grouped under their indication, in the order indications are listed in the data. */
export const byIndication = (claims: Claim[]): IndicationClaims[] =>
  db.indications
    .map((indication) => ({ indication, claims: claims.filter((c) => c.indicationId === indication.id) }))
    .filter((group) => group.claims.length > 0);

/** Claims under a body system's indications, grouped by indication. */
export function claimsForSystem(systemId: string): IndicationClaims[] {
  const ids = new Set(db.indications.filter((i) => i.systemId === systemId).map((i) => i.id));
  return byIndication(db.claims.filter((c) => ids.has(c.indicationId)));
}

export function subjectName(ref: SubjectRef): string {
  const record =
    ref.kind === 'group' ? groupsById.get(ref.id) : ref.kind === 'food' ? foodsById.get(ref.id) : compoundsById.get(ref.id);
  return record?.name ?? ref.id;
}

/** The foods and groups a claim is about — the "what to eat" answer, without compounds. */
export const foodSubjectNames = (claim: Claim): string[] =>
  claim.subjects.filter((s) => s.kind !== 'compound').map(subjectName);

/** The foods and groups mentioned most often across a body system's claims. */
export function topFoodsForSystem(systemId: string, limit = 6): string[] {
  const counts = new Map<string, number>();
  for (const { claims } of claimsForSystem(systemId)) {
    for (const claim of claims) {
      for (const name of foodSubjectNames(claim)) counts.set(name, (counts.get(name) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([name]) => name);
}

export const citationsFor = (item: { citationIds: string[] }): Citation[] =>
  item.citationIds.map((id) => citationsById.get(id)).filter(defined);

/** The evidence level to display, or undefined for an unverified claim or prep note. */
export const levelOf = (item: Claim | PrepNote): EvidenceLevel | undefined =>
  item.status === 'verified' ? item.evidenceLevel : undefined;

export const verifiedCount = (claims: Claim[]): number => claims.filter((c) => c.status === 'verified').length;

// ── Search ───────────────────────────────────────────────────────────────────────────────────

/** Lowercase, strip accents and apostrophes, so "alzheimers" finds "Alzheimer's disease". */
const normalize = (text: string) =>
  text.toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/['’]/g, '');

/**
 * Three tiers per record, so a query matching a record's own name outranks one that only
 * matches a food, compound, or indication inside it, which outranks a match in body text.
 */
type Tiers = [name: string, entities: string, text: string];
const tiers = (name: string, entities: string[], text: string[]): Tiers => [
  normalize(name),
  normalize(entities.join('\n')),
  normalize(text.join('\n')),
];

interface Indexed<T> {
  item: T;
  tiers: Tiers;
}

const groupIndex: Indexed<FoodGroup>[] = db.foodGroups.map((group) => {
  const claims = claimsForGroup(group.id);
  return {
    item: group,
    tiers: tiers(
      group.name,
      [
        ...foodsInGroup(group.id).flatMap((f) => [f.name, ...f.aliases]),
        ...compoundsForGroup(group.id).flatMap((c) => [c.name, ...c.aliases]),
        ...indicationsOf(claims).flatMap((i) => [i.name, ...i.aliases]),
      ],
      [...claims.flatMap((c) => [c.headline ?? '', c.statement]), ...prepNotesForGroup(group.id).map((p) => p.text)]
    ),
  };
});

const systemIndex: Indexed<BodySystem>[] = db.systems.map((system) => {
  const grouped = claimsForSystem(system.id);
  const claims = grouped.flatMap((g) => g.claims);
  return {
    item: system,
    tiers: tiers(
      system.name,
      [
        ...grouped.flatMap((g) => [g.indication.name, ...g.indication.aliases]),
        ...claims.flatMap((c) => c.subjects.map(subjectName)),
      ],
      claims.flatMap((c) => [c.headline ?? '', c.statement])
    ),
  };
});

/** Records matching the query, best tier first; ties keep data order. */
const rank = <T,>(index: Indexed<T>[], query: string): T[] =>
  index
    .map(({ item, tiers: t }) => ({ item, tier: t.findIndex((text) => text.includes(query)) }))
    .filter(({ tier }) => tier !== -1)
    .sort((a, b) => a.tier - b.tier)
    .map(({ item }) => item);

export interface SearchResults {
  groups: FoodGroup[];
  systems: BodySystem[];
}

export function search(query: string): SearchResults {
  const q = normalize(query.trim());
  if (!q) return { groups: db.foodGroups, systems: [] };
  return { groups: rank(groupIndex, q), systems: rank(systemIndex, q) };
}
