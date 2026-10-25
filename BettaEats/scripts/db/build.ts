/** Load, validate, filter, and serialize the database into the bundle the app imports. */
import fs from 'node:fs';

import { Database, type Collections } from '../../src/db/schema';
import type { BuildProfile } from '../../src/db/vocab';
import { loadRaw, OUT_FILE } from './files';
import { applyProfile, checkIntegrity, parseCollections, type Issue } from './validate';

export interface Assembled {
  /** The filtered collections, or null when anything failed. */
  data: Collections | null;
  /** The collections as far as they parsed, for reporting counts even on failure. */
  stats: Collections;
  dropped: ReturnType<typeof applyProfile>['dropped'];
  errors: Issue[];
  warnings: Issue[];
}

/** Load data/, parse it, check integrity, and filter to `profile`. */
export function assemble(profile: BuildProfile): Assembled {
  const loaded = loadRaw();
  const parsed = parseCollections(loaded.raw);
  const errors = [...loaded.errors, ...parsed.errors];
  const integrity = checkIntegrity(parsed.data);
  errors.push(...integrity.errors);

  const { data, dropped } = applyProfile(parsed.data, profile);
  if (profile !== 'research') {
    for (const issue of checkIntegrity(data).errors) {
      errors.push({
        where: issue.where,
        message: `${issue.message} once the ${profile} profile drops non-commercial records`,
      });
    }
  }
  return { data: errors.length ? null : data, stats: data, dropped, errors, warnings: integrity.warnings };
}

/** Deterministic output, so an unchanged data/ rebuilds to a byte-identical file. */
export function serialize(profile: BuildProfile, data: Collections): string {
  const db = Database.parse({ profile, ...data });
  return `${JSON.stringify(db)}\n`;
}

/** Write the bundle and return its size in bytes. */
export function writeBundle(profile: BuildProfile, data: Collections): number {
  const json = serialize(profile, data);
  fs.writeFileSync(OUT_FILE, json);
  return Buffer.byteLength(json);
}

/** The profile the committed bundle was built for, or null if there is no bundle yet. */
export function committedProfile(): BuildProfile | null {
  if (!fs.existsSync(OUT_FILE)) return null;
  return (JSON.parse(fs.readFileSync(OUT_FILE, 'utf8')) as { profile: BuildProfile }).profile;
}
