/**
 * Add a paper to data/citations.json from its PMID or DOI, optionally attaching it to a claim.
 *
 *   npm run db:cite 23596162
 *   npm run db:cite -- 10.3945/jn.112.170233 --claim=leafy-nitrates-blood-pressure
 *   npm run db:cite -- <PMID|DOI|URL> [--claim=<claim-id>] [--study-type=<design>] [--id=<citation-id>]
 *
 * The bibliographic record comes from PubMed, or from Crossref for DOIs PubMed doesn't index.
 * Attaching a paper never verifies a claim: it becomes a candidate source, and grading the claim
 * stays a human judgment made in data/claims.json.
 */
import { Citation, Id } from '../../src/db/schema';
import { STUDY_TYPE_LABELS, STUDY_TYPES, type StudyType } from '../../src/db/vocab';
import { assemble, committedProfile, writeBundle } from './build';
import { loadRaw, OUT_FILE, rel, today, writeCollection } from './files';
import { printIssues } from './report';
import { fromCrossref, fromPubMed, inferStudyType, pmidForDoi, type PaperRecord } from './sources/papers';
import { checkIntegrity, parseCollections } from './validate';

type Json = Record<string, any>;

function fail(message: string): never {
  console.error(`✗ ${message}`);
  process.exit(1);
}

/** Accepts 23596162, PMID:23596162, a PubMed URL, 10.xxxx/…, doi:10.xxxx/…, or a doi.org URL. */
function parseReference(input: string): { pmid: string } | { doi: string } {
  const s = input.trim();
  const fromUrl = s.match(/pubmed\.ncbi\.nlm\.nih\.gov\/(\d+)/);
  if (fromUrl) return { pmid: fromUrl[1] };
  const pmid = s.replace(/^pmid:?\s*/i, '');
  if (/^\d{1,9}$/.test(pmid)) return { pmid };
  const doi = s.replace(/^https?:\/\/(dx\.)?doi\.org\//i, '').replace(/^doi:\s*/i, '');
  if (/^10\.\d{4,9}\/\S+$/.test(doi)) return { doi };
  fail(`"${input}" isn't a PMID, a DOI, or a PubMed/doi.org link.`);
}

function parseFlags(args: string[]) {
  const flag = (name: string) => args.find((a) => a.startsWith(`--${name}=`))?.slice(name.length + 3);
  const studyType = flag('study-type');
  if (studyType && !(STUDY_TYPES as readonly string[]).includes(studyType)) {
    fail(`Unknown --study-type "${studyType}". Use one of: ${STUDY_TYPES.join(', ')}.`);
  }
  return { claim: flag('claim'), studyType: studyType as StudyType | undefined, id: flag('id') };
}

const slug = (s: string) =>
  s
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/['’]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

/** "siervo-2013", or "siervo-2013b" if that's taken — the author–year convention. */
function generateId(paper: PaperRecord, taken: Set<string>): string {
  const first = paper.authors[0] ?? '';
  const tokens = first.split(' ');
  // Names are "Surname Initials"; drop the initials. Collective names have none to drop.
  const surname = tokens.length > 1 && /^[A-Z]{1,4}$/.test(tokens.at(-1)!) ? tokens.slice(0, -1).join(' ') : first;
  const stem = slug(surname).split('-').slice(0, 3).join('-') || slug(paper.title).split('-').slice(0, 2).join('-');
  const base = `${stem}-${paper.year}`;
  if (!taken.has(base)) return base;
  for (const letter of 'bcdefghijklmnopqrstuvwxyz') {
    if (!taken.has(`${base}${letter}`)) return `${base}${letter}`;
  }
  fail(`Ran out of ids for ${base}; pass one with --id=.`);
}

/** Vancouver style: the first six authors, then "et al." */
function formatAuthors(authors: string[]): string {
  if (authors.length === 0) return '[No authors listed]';
  return authors.length > 6 ? `${authors.slice(0, 6).join(', ')}, et al.` : authors.join(', ');
}

const sameDoi = (a?: string, b?: string) => !!a && !!b && a.toLowerCase() === b.toLowerCase();

/** Add a citation id to a claim, keeping provenance as the record's last key. */
function attach(claim: Json, citationId: string): Json {
  if ((claim.citationIds ?? []).includes(citationId)) return claim;
  const { provenance, ...rest } = claim;
  return { ...rest, citationIds: [...(claim.citationIds ?? []), citationId], provenance };
}

async function lookUp(ref: { pmid: string } | { doi: string }): Promise<PaperRecord> {
  if ('pmid' in ref) {
    console.log(`Looking up PMID ${ref.pmid} on PubMed…`);
    return (await fromPubMed(ref.pmid)) ?? fail(`PubMed has no record for PMID ${ref.pmid}.`);
  }
  console.log(`Looking up DOI ${ref.doi}…`);
  const pmid = await pmidForDoi(ref.doi);
  if (pmid) return (await fromPubMed(pmid)) ?? fail(`PubMed lists PMID ${pmid} for this DOI but returned no record.`);
  console.log('  not indexed in PubMed — trying Crossref');
  return (await fromCrossref(ref.doi)) ?? fail(`Neither PubMed nor Crossref has a record for DOI ${ref.doi}.`);
}

async function main() {
  const args = process.argv.slice(2);
  const input = args.find((a) => !a.startsWith('--'));
  if (!input || args.includes('--help')) {
    console.log('Usage: npm run db:cite -- <PMID|DOI|URL> [--claim=<claim-id>] [--study-type=<design>] [--id=<citation-id>]');
    process.exit(input ? 0 : 2);
  }
  const ref = parseReference(input);
  const flags = parseFlags(args);

  const { raw, errors: loadErrors } = loadRaw();
  if (loadErrors.length) {
    printIssues('✗', 'error', loadErrors);
    fail('Fix the data files first; nothing was written.');
  }
  const citations = raw.citations as Json[];
  let claims = raw.claims as Json[];
  const claim = flags.claim ? claims.find((c) => c.id === flags.claim) : undefined;
  if (flags.claim && !claim) fail(`No claim with id "${flags.claim}" in data/claims.json.`);

  const findExisting = (pmid?: string, doi?: string) =>
    citations.find((c) => (pmid && c.pmid === pmid) || sameDoi(c.doi, doi));

  // Skip the network entirely when the paper is already entered.
  let existing = findExisting('pmid' in ref ? ref.pmid : undefined, 'doi' in ref ? ref.doi : undefined);
  let citation: Json | undefined;
  let designNote = '';

  if (!existing) {
    const paper = await lookUp(ref);
    existing = findExisting(paper.pmid, paper.doi);
    if (!existing) {
      if (!paper.title || !paper.journal || !Number.isInteger(paper.year)) {
        fail(`The ${paper.source} record is missing a title, journal, or year; add this one by hand.`);
      }
      const inferred = inferStudyType(paper.publicationTypes);
      const studyType = flags.studyType ?? inferred;
      if (!studyType) {
        fail(
          `Couldn't tell the study design from ${paper.source === 'pubmed' ? 'PubMed' : 'Crossref'}` +
            ` (${paper.publicationTypes.join(', ') || 'no publication types'}).\n` +
            `  Re-run with --study-type=<${STUDY_TYPES.join('|')}>`
        );
      }
      designNote = flags.studyType
        ? 'set with --study-type'
        : `from PubMed's publication types (${paper.publicationTypes.join(', ')})`;

      const taken = new Set(citations.map((c) => c.id as string));
      const id = flags.id ?? generateId(paper, taken);
      if (!Id.safeParse(id).success) fail(`--id "${id}" must be lowercase kebab-case.`);
      if (taken.has(id)) fail(`A citation with id "${id}" already exists.`);

      citation = {
        id,
        title: paper.title,
        authors: formatAuthors(paper.authors),
        journal: paper.journal,
        year: paper.year,
        ...(paper.pmid ? { pmid: paper.pmid } : {}),
        ...(paper.doi ? { doi: paper.doi } : {}),
        studyType,
        provenance: {
          source: paper.source,
          sourceId: paper.pmid ? `PMID:${paper.pmid}` : `DOI:${paper.doi}`,
          // Bibliographic facts: public domain via PubMed; Crossref releases its metadata as CC0.
          license: paper.source === 'pubmed' ? 'public-domain' : 'cc0',
          retrievedAt: today(),
        },
      };
      const check = Citation.safeParse(citation);
      if (!check.success) fail(`The new citation doesn't fit the schema: ${check.error.issues[0].message}`);
    }
  }

  const citationId = (existing ?? citation)!.id as string;
  if (claim) claims = claims.map((c) => (c === claim ? attach(c, citationId) : c));
  const nextCitations = citation ? [...citations, citation] : citations;

  // Validate the whole database as it would be written, before writing anything.
  const parsed = parseCollections({ ...raw, citations: nextCitations, claims });
  const issues = [...parsed.errors, ...checkIntegrity(parsed.data).errors];
  if (issues.length) {
    printIssues('✗', 'error', issues);
    fail('Nothing was written.');
  }

  if (citation) writeCollection('citations', nextCitations);
  if (claim) writeCollection('claims', claims);

  if (existing) console.log(`\n• Already in data/citations.json as ${existing.id}`);
  if (citation) {
    console.log(`\n✓ Added ${citation.id} to data/citations.json`);
    console.log(`  ${citation.title}`);
    console.log(`  ${citation.authors} · ${citation.journal} · ${citation.year}`);
    console.log(`  ${STUDY_TYPE_LABELS[citation.studyType as StudyType]} — ${designNote}`);
    console.log(`  ${[citation.pmid && `PMID ${citation.pmid}`, citation.doi && `DOI ${citation.doi}`].filter(Boolean).join(' · ')}`);
  }
  if (claim) {
    const state = claim.status === 'verified' ? 'added as a further source' : 'a candidate source — the claim is still unverified';
    console.log(`✓ Attached to ${claim.id}: ${state}`);
  }

  if (citation || claim) {
    const profile = committedProfile() ?? 'research';
    const built = assemble(profile);
    if (!built.data) fail('Rebuild failed; run npm run db:build to see why.');
    writeBundle(profile, built.data);
    console.log(`✓ Rebuilt ${rel(OUT_FILE)}`);
  }

  if (claim && claim.status !== 'verified') {
    console.log(
      `\nNext: once you've read the paper, set the claim's "status" to "verified" and add` +
        ` "evidenceLevel" and "intent" in data/claims.json, then run npm run db:build.`
    );
  }
}

main().catch((e: Error) => fail(e.message));
