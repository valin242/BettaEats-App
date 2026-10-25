/** Console formatting shared by the database commands. */
import type { CollectionName, Collections } from '../../src/db/schema';
import { COLLECTION_NAMES, type Issue } from './validate';

export const LABELS: Record<CollectionName, string> = {
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

/** One line of counts, e.g. "9 food groups · 43 foods · … · 27 claims (0 verified) · …". */
export function summarize(d: Collections): string {
  const verified = d.claims.filter((c) => c.status === 'verified').length;
  return COLLECTION_NAMES.map((name) => {
    const n = d[name].length;
    return name === 'claims' ? `${n} ${LABELS[name]} (${verified} verified)` : `${n} ${LABELS[name]}`;
  }).join(' · ');
}

export function printIssues(symbol: string, noun: string, issues: Issue[]): void {
  if (!issues.length) return;
  console.log(`\n${symbol} ${issues.length} ${noun}${issues.length === 1 ? '' : 's'}`);
  for (const { where, message } of issues) console.log(`  ${where}: ${message}`);
}
