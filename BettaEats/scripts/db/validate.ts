/**
 * Validation for the BettaEats database. Pure functions — no file system — so the CLI and
 * any future tests can share them.
 *
 * Two layers: `parseCollections` checks each record against its schema; `checkIntegrity`
 * checks the relationships between records (dangling ids, duplicates, loops).
 */
import type { z } from 'zod';

import {
  COLLECTIONS,
  type CollectionName,
  type Collections,
  type ContainerRef,
  type SubjectRef,
} from '../../src/db/schema';
import { COMMERCIAL_LICENSES, type BuildProfile } from '../../src/db/vocab';

export interface Issue {
  where: string;
  message: string;
}

export interface Report {
  errors: Issue[];
  warnings: Issue[];
}

export const COLLECTION_NAMES = Object.keys(COLLECTIONS) as CollectionName[];

const describe = (record: unknown) =>
  record && typeof record === 'object' && typeof (record as { id?: unknown }).id === 'string'
    ? ` (${(record as { id: string }).id})`
    : '';

/** Parse every record, keeping the valid ones and reporting each failure with its location. */
export function parseCollections(raw: Partial<Record<CollectionName, unknown>>): {
  data: Collections;
  errors: Issue[];
} {
  const errors: Issue[] = [];
  const data = {} as Record<CollectionName, unknown[]>;

  for (const name of COLLECTION_NAMES) {
    const { schema, file } = COLLECTIONS[name];
    const records = raw[name];
    data[name] = [];
    if (!Array.isArray(records)) {
      errors.push({ where: `data/${file}`, message: 'must contain a JSON array' });
      continue;
    }
    records.forEach((record, i) => {
      const result = (schema as z.ZodType).safeParse(record);
      const where = `${file}[${i}]${describe(record)}`;
      if (result.success) {
        data[name].push(result.data);
        return;
      }
      for (const issue of result.error.issues) {
        errors.push({
          where: issue.path.length ? `${where} → ${issue.path.join('.')}` : where,
          message: issue.message,
        });
      }
    });
  }

  return { data: data as unknown as Collections, errors };
}

/** Cross-record checks: every reference resolves, nothing is duplicated, nothing loops. */
export function checkIntegrity(d: Collections): Report {
  const errors: Issue[] = [];
  const warnings: Issue[] = [];
  const at = (name: CollectionName, id: string) => `${COLLECTIONS[name].file} (${id})`;

  for (const name of COLLECTION_NAMES) {
    const seen = new Set<string>();
    for (const { id } of d[name] as { id: string }[]) {
      if (seen.has(id)) errors.push({ where: at(name, id), message: 'duplicate id' });
      seen.add(id);
    }
  }

  const ids = {
    group: new Set(d.foodGroups.map((x) => x.id)),
    food: new Set(d.foods.map((x) => x.id)),
    compound: new Set(d.compounds.map((x) => x.id)),
    system: new Set(d.systems.map((x) => x.id)),
    indication: new Set(d.indications.map((x) => x.id)),
    citation: new Set(d.citations.map((x) => x.id)),
  };
  const resolves = (ref: SubjectRef | ContainerRef) => ids[ref.kind].has(ref.id);
  const missing = (what: string, id: string) => `${what} "${id}" does not exist`;

  for (const f of d.foods) {
    if (f.groupId && !ids.group.has(f.groupId)) {
      errors.push({ where: at('foods', f.id), message: missing('food group', f.groupId) });
    }
  }

  const pairs = new Set<string>();
  for (const c of d.constituents) {
    const where = at('constituents', c.id);
    if (!resolves(c.subject)) errors.push({ where, message: missing(c.subject.kind, c.subject.id) });
    if (!ids.compound.has(c.compoundId)) errors.push({ where, message: missing('compound', c.compoundId) });
    const pair = `${c.subject.kind}:${c.subject.id}→${c.compoundId}`;
    if (pairs.has(pair)) errors.push({ where, message: `repeats ${pair}, which another constituent already records` });
    pairs.add(pair);
  }

  const parentOf = new Map(d.indications.map((i) => [i.id, i.parentId]));
  for (const ind of d.indications) {
    const where = at('indications', ind.id);
    if (ind.systemId && !ids.system.has(ind.systemId)) {
      errors.push({ where, message: missing('body system', ind.systemId) });
    }
    if (ind.parentId && !ids.indication.has(ind.parentId)) {
      errors.push({ where, message: missing('parent indication', ind.parentId) });
      continue;
    }
    const chain = new Set([ind.id]);
    for (let p = ind.parentId; p; p = parentOf.get(p)) {
      if (chain.has(p)) {
        errors.push({ where, message: `parent chain loops back through "${p}"` });
        break;
      }
      chain.add(p);
    }
  }

  const checkCitations = (where: string, citationIds: string[]) => {
    for (const cid of citationIds) {
      if (!ids.citation.has(cid)) errors.push({ where, message: missing('citation', cid) });
    }
  };

  for (const c of d.claims) {
    const where = at('claims', c.id);
    const listed = new Set<string>();
    for (const s of c.subjects) {
      if (!resolves(s)) errors.push({ where, message: missing(s.kind, s.id) });
      const key = `${s.kind} "${s.id}"`;
      if (listed.has(key)) errors.push({ where, message: `lists ${key} twice` });
      listed.add(key);
    }
    if (!ids.indication.has(c.indicationId)) {
      errors.push({ where, message: missing('indication', c.indicationId) });
    }
    checkCitations(where, c.citationIds);
  }

  for (const p of d.prepNotes) {
    const where = at('prepNotes', p.id);
    if (!resolves(p.subject)) errors.push({ where, message: missing(p.subject.kind, p.subject.id) });
    checkCitations(where, p.citationIds);
  }

  // The same paper entered twice would let one study count as two lines of evidence.
  const byPmid = new Map<string, string>();
  const byDoi = new Map<string, string>();
  for (const c of d.citations) {
    const where = at('citations', c.id);
    if (c.pmid) {
      const other = byPmid.get(c.pmid);
      if (other) errors.push({ where, message: `PMID ${c.pmid} is already entered as "${other}"` });
      else byPmid.set(c.pmid, c.id);
    }
    if (c.doi) {
      const doi = c.doi.toLowerCase();
      const other = byDoi.get(doi);
      if (other) errors.push({ where, message: `DOI ${c.doi} is already entered as "${other}"` });
      else byDoi.set(doi, c.id);
    }
  }

  // Warnings: not wrong, but worth a curator's attention.
  const cited = new Set([...d.claims, ...d.prepNotes].flatMap((x) => x.citationIds));
  for (const c of d.citations) {
    if (!cited.has(c.id)) warnings.push({ where: at('citations', c.id), message: 'is not cited by any claim or prep note' });
  }

  const usedCompounds = new Set([
    ...d.constituents.map((c) => c.compoundId),
    ...d.claims.flatMap((c) => c.subjects.filter((s) => s.kind === 'compound').map((s) => s.id)),
  ]);
  for (const c of d.compounds) {
    if (!usedCompounds.has(c.id)) warnings.push({ where: at('compounds', c.id), message: 'no food contains it and no claim mentions it' });
  }

  const claimed = new Set(d.claims.map((c) => c.indicationId));
  // `visited` guards against parent loops, which are reported above but still present here.
  const hasClaims = (id: string, visited = new Set<string>()): boolean => {
    if (claimed.has(id)) return true;
    visited.add(id);
    return d.indications.some(
      (child) => child.parentId === id && !visited.has(child.id) && hasClaims(child.id, visited)
    );
  };
  for (const ind of d.indications) {
    if (!hasClaims(ind.id)) warnings.push({ where: at('indications', ind.id), message: 'has no claims yet' });
  }

  return { errors, warnings };
}

/**
 * Drop every record whose license a commercial build can't ship. Run `checkIntegrity` on the
 * result: a surviving record that points at a dropped one is an error, because the commercial
 * build would ship a dangling reference.
 */
export function applyProfile(
  d: Collections,
  profile: BuildProfile
): { data: Collections; dropped: Partial<Record<CollectionName, number>> } {
  if (profile === 'research') return { data: d, dropped: {} };

  const data = {} as Record<CollectionName, unknown[]>;
  const dropped: Partial<Record<CollectionName, number>> = {};
  for (const name of COLLECTION_NAMES) {
    const records = d[name] as { provenance: { license: (typeof COMMERCIAL_LICENSES)[number] } }[];
    const kept = records.filter((r) => COMMERCIAL_LICENSES.includes(r.provenance.license));
    data[name] = kept;
    if (kept.length < records.length) dropped[name] = records.length - kept.length;
  }
  return { data: data as unknown as Collections, dropped };
}
