/**
 * BettaEats database CLI.
 *
 *   npm run db:validate           check data/ without writing anything
 *   npm run db:build              validate, then write src/db/db.generated.json (research profile)
 *   npm run db:build:commercial   the same, dropping records under non-commercial licenses
 *   npm run db:check              fail if db.generated.json is out of date with data/
 *
 * Exits non-zero on any error, so it can gate CI.
 */
import fs from 'node:fs';
import path from 'node:path';

import { COLLECTIONS, Database, type CollectionName, type Collections } from '../../src/db/schema';
import { BUILD_PROFILES, type BuildProfile } from '../../src/db/vocab';
import {
  applyProfile,
  checkIntegrity,
  COLLECTION_NAMES,
  parseCollections,
  type Issue,
} from './validate';

const ROOT = path.resolve(__dirname, '../..');
const DATA_DIR = path.join(ROOT, 'data');
const OUT_FILE = path.join(ROOT, 'src/db/db.generated.json');
const rel = (p: string) => path.relative(ROOT, p);

const LABELS: Record<CollectionName, string> = {
  foodGroups: 'food groups',
  foods: 'foods',
  compounds: 'compounds',
  constituents: 'constituents',
  systems: 'body systems',
  indications: 'indications',
  claims: 'claims',
  prepNotes: 'prep notes',
  citations: 'citations',
};

function loadRaw(): { raw: Partial<Record<CollectionName, unknown>>; errors: Issue[] } {
  const raw: Partial<Record<CollectionName, unknown>> = {};
  const errors: Issue[] = [];
  for (const name of COLLECTION_NAMES) {
    const file = path.join(DATA_DIR, COLLECTIONS[name].file);
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

/** Load, parse, integrity-check, and filter to `profile`. Returns null data if anything failed. */
function assemble(profile: BuildProfile) {
  const loaded = loadRaw();
  const parsed = parseCollections(loaded.raw);
  const errors = [...loaded.errors, ...parsed.errors];
  const integrity = checkIntegrity(parsed.data);
  errors.push(...integrity.errors);

  const { data, dropped } = applyProfile(parsed.data, profile);
  if (profile !== 'research') {
    for (const issue of checkIntegrity(data).errors) {
      errors.push({ where: issue.where, message: `${issue.message} once the ${profile} profile drops non-commercial records` });
    }
  }
  return { data: errors.length ? null : data, stats: data, dropped, errors, warnings: integrity.warnings };
}

/** Deterministic output, so an unchanged data/ rebuilds to a byte-identical file. */
function serialize(profile: BuildProfile, data: Collections): string {
  const db = Database.parse({ profile, ...data });
  return `${JSON.stringify(db)}\n`;
}

function summarize(d: Collections): string {
  const verified = d.claims.filter((c) => c.status === 'verified').length;
  return COLLECTION_NAMES.map((name) => {
    const n = d[name].length;
    return name === 'claims' ? `${n} ${LABELS[name]} (${verified} verified)` : `${n} ${LABELS[name]}`;
  }).join(' · ');
}

function printIssues(symbol: string, noun: string, issues: Issue[]) {
  if (!issues.length) return;
  console.log(`\n${symbol} ${issues.length} ${noun}${issues.length === 1 ? '' : 's'}`);
  for (const { where, message } of issues) console.log(`  ${where}: ${message}`);
}

function parseProfile(args: string[]): BuildProfile {
  const flag = args.find((a) => a.startsWith('--profile='));
  const value = flag ? flag.slice('--profile='.length) : 'research';
  if (!(BUILD_PROFILES as readonly string[]).includes(value)) {
    console.error(`Unknown profile "${value}". Use one of: ${BUILD_PROFILES.join(', ')}.`);
    process.exit(2);
  }
  return value as BuildProfile;
}

function main() {
  const [command, ...args] = process.argv.slice(2);

  if (command === 'check') {
    if (!fs.existsSync(OUT_FILE)) {
      console.error(`✗ ${rel(OUT_FILE)} does not exist. Run: npm run db:build`);
      process.exit(1);
    }
    const committed = fs.readFileSync(OUT_FILE, 'utf8');
    const profile = (JSON.parse(committed) as { profile: BuildProfile }).profile;
    const result = assemble(profile);
    if (!result.data) {
      printIssues('✗', 'error', result.errors);
      process.exit(1);
    }
    if (serialize(profile, result.data) !== committed) {
      console.error(`✗ ${rel(OUT_FILE)} is out of date with data/. Run: npm run db:build`);
      process.exit(1);
    }
    console.log(`✓ ${rel(OUT_FILE)} matches data/ (${profile} profile)`);
    return;
  }

  if (command !== 'validate' && command !== 'build') {
    console.error('Usage: cli.ts <validate | build [--profile=research|commercial] | check>');
    process.exit(2);
  }

  const profile = command === 'build' ? parseProfile(args) : 'research';
  const result = assemble(profile);

  console.log(`BettaEats database — ${profile} profile`);
  console.log(`  ${summarize(result.stats)}`);
  const dropped = Object.entries(result.dropped);
  if (dropped.length) {
    console.log(`  dropped for licensing: ${dropped.map(([n, k]) => `${k} ${LABELS[n as CollectionName]}`).join(', ')}`);
  }
  printIssues('⚠', 'warning', result.warnings);
  printIssues('✗', 'error', result.errors);

  if (!result.data) process.exit(1);

  if (command === 'build') {
    const json = serialize(profile, result.data);
    fs.writeFileSync(OUT_FILE, json);
    console.log(`\n✓ Wrote ${rel(OUT_FILE)} (${(Buffer.byteLength(json) / 1024).toFixed(1)} KB)`);
  } else {
    console.log('\n✓ Valid');
  }
}

main();
