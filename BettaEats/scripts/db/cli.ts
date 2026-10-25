/**
 * BettaEats database CLI.
 *
 *   npm run db:validate           check data/ without writing anything
 *   npm run db:build              validate, then write src/db/db.generated.json (research profile)
 *   npm run db:build:commercial   the same, dropping records under non-commercial licenses
 *   npm run db:check              fail if db.generated.json is out of date with data/
 *
 * Exits non-zero on any error, so it can gate CI. Adding citations lives in cite.ts.
 */
import fs from 'node:fs';

import { BUILD_PROFILES, type BuildProfile } from '../../src/db/vocab';
import { assemble, committedProfile, serialize, writeBundle } from './build';
import { OUT_FILE, rel } from './files';
import { LABELS, printIssues, summarize } from './report';

function parseProfile(args: string[]): BuildProfile {
  const flag = args.find((a) => a.startsWith('--profile='));
  const value = flag ? flag.slice('--profile='.length) : 'research';
  if (!(BUILD_PROFILES as readonly string[]).includes(value)) {
    console.error(`Unknown profile "${value}". Use one of: ${BUILD_PROFILES.join(', ')}.`);
    process.exit(2);
  }
  return value as BuildProfile;
}

function check(): void {
  const profile = committedProfile();
  if (!profile) {
    console.error(`✗ ${rel(OUT_FILE)} does not exist. Run: npm run db:build`);
    process.exit(1);
  }
  const result = assemble(profile);
  if (!result.data) {
    printIssues('✗', 'error', result.errors);
    process.exit(1);
  }
  if (serialize(profile, result.data) !== fs.readFileSync(OUT_FILE, 'utf8')) {
    console.error(`✗ ${rel(OUT_FILE)} is out of date with data/. Run: npm run db:build`);
    process.exit(1);
  }
  console.log(`✓ ${rel(OUT_FILE)} matches data/ (${profile} profile)`);
}

function main(): void {
  const [command, ...args] = process.argv.slice(2);

  if (command === 'check') return check();

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
    console.log(
      `  dropped for licensing: ${dropped.map(([n, k]) => `${k} ${LABELS[n as keyof typeof LABELS]}`).join(', ')}`
    );
  }
  printIssues('⚠', 'warning', result.warnings);
  printIssues('✗', 'error', result.errors);

  if (!result.data) process.exit(1);

  if (command === 'build') {
    const bytes = writeBundle(profile, result.data);
    console.log(`\n✓ Wrote ${rel(OUT_FILE)} (${(bytes / 1024).toFixed(1)} KB)`);
  } else {
    console.log('\n✓ Valid');
  }
}

main();
