/** Where the database lives on disk, and reading and writing it in its canonical format. */
import fs from 'node:fs';
import path from 'node:path';

import { COLLECTIONS, type CollectionName } from '../../src/db/schema';
import { COLLECTION_NAMES, type Issue } from './validate';

export const ROOT = path.resolve(__dirname, '../..');
export const DATA_DIR = path.join(ROOT, 'data');
export const OUT_FILE = path.join(ROOT, 'src/db/db.generated.json');
export const rel = (p: string) => path.relative(ROOT, p);

const fileFor = (name: CollectionName) => path.join(DATA_DIR, COLLECTIONS[name].file);

export type RawCollections = Partial<Record<CollectionName, unknown>>;

/** Read every data file. A missing or malformed file is reported as an issue, not thrown. */
export function loadRaw(): { raw: RawCollections; errors: Issue[] } {
  const raw: RawCollections = {};
  const errors: Issue[] = [];
  for (const name of COLLECTION_NAMES) {
    const file = fileFor(name);
    if (!fs.existsSync(file)) {
      errors.push({ where: rel(file), message: 'file is missing (use [] for an empty collection)' });
      continue;
    }
    try {
      raw[name] = JSON.parse(fs.readFileSync(file, 'utf8'));
    } catch (e) {
      errors.push({ where: rel(file), message: `is not valid JSON: ${(e as Error).message}` });
    }
  }
  return { raw, errors };
}

/**
 * Write one collection back as two-space JSON with a trailing newline — the format every data
 * file is already in, so a tool's edit shows up as a minimal diff.
 */
export function writeCollection(name: CollectionName, rows: unknown[]): void {
  fs.writeFileSync(fileFor(name), `${JSON.stringify(rows, null, 2)}\n`);
}

/** Today in the local time zone, YYYY-MM-DD. (toISOString would give the UTC date.) */
export const today = () => new Date().toLocaleDateString('en-CA');
