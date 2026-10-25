/**
 * Looks up a paper's bibliographic record: PubMed first (NCBI E-utilities), then Crossref for
 * DOIs PubMed doesn't index. Only bibliographic facts are kept — title, authors, journal, year,
 * identifiers. Abstracts are never fetched, since many are under the publisher's copyright.
 */
import type { StudyType } from '../../../src/db/vocab';

const EUTILS = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils';
const HEADERS = { 'User-Agent': 'BettaEats/1.0 (citation importer)' };

export interface PaperRecord {
  title: string;
  /** "Surname Initials", PubMed style. */
  authors: string[];
  journal: string;
  year: number;
  pmid?: string;
  doi?: string;
  /** PubMed publication types, e.g. "Meta-Analysis"; Crossref only gives "journal-article". */
  publicationTypes: string[];
  source: 'pubmed' | 'crossref';
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** GET JSON, retrying briefly on HTTP 429: without an API key NCBI allows 3 requests a second. */
async function getJson(url: string): Promise<{ status: number; body: any }> {
  for (let attempt = 0; ; attempt++) {
    const res = await fetch(url, { headers: HEADERS, signal: AbortSignal.timeout(20_000) });
    if (res.status === 429 && attempt < 3) {
      await sleep(1000 * (attempt + 1));
      continue;
    }
    if (res.status === 404) return { status: 404, body: null };
    if (!res.ok) throw new Error(`${new URL(url).host} responded ${res.status}`);
    return { status: res.status, body: await res.json() };
  }
}

/** Drop markup such as <i>Helicobacter pylori</i>, decode the few entities that appear, trim a final period. */
function cleanTitle(raw: string): string {
  return raw
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\.$/, '');
}

export async function pmidForDoi(doi: string): Promise<string | undefined> {
  const term = encodeURIComponent(`${doi}[doi]`);
  const { body } = await getJson(`${EUTILS}/esearch.fcgi?db=pubmed&retmode=json&tool=bettaeats&term=${term}`);
  const ids: string[] = body?.esearchresult?.idlist ?? [];
  return ids.length === 1 ? ids[0] : undefined;
}

export async function fromPubMed(pmid: string): Promise<PaperRecord | undefined> {
  const { body } = await getJson(`${EUTILS}/esummary.fcgi?db=pubmed&retmode=json&tool=bettaeats&id=${pmid}`);
  const r = body?.result?.[pmid];
  if (!r || r.error) return undefined;
  return {
    title: cleanTitle(r.title ?? ''),
    authors: (r.authors ?? []).map((a: { name: string }) => a.name),
    journal: r.source || r.fulljournalname,
    // pubdate is "2013 Jun" or "2012 Dec-2013 Jan"; epubdate covers records with no print date.
    year: parseInt(String(r.pubdate || r.epubdate).slice(0, 4), 10),
    pmid,
    doi: r.articleids?.find((a: { idtype: string }) => a.idtype === 'doi')?.value,
    publicationTypes: r.pubtype ?? [],
    source: 'pubmed',
  };
}

const initials = (given = '') =>
  given
    .split(/[\s.\-]+/)
    .filter(Boolean)
    .map((part) => part[0].toUpperCase())
    .join('');

export async function fromCrossref(doi: string): Promise<PaperRecord | undefined> {
  const { status, body } = await getJson(`https://api.crossref.org/works/${encodeURIComponent(doi)}`);
  if (status === 404) return undefined;
  const m = body.message;
  return {
    title: cleanTitle(m.title?.[0] ?? ''),
    authors: (m.author ?? []).map((a: { family?: string; given?: string; name?: string }) =>
      a.family ? `${a.family} ${initials(a.given)}`.trim() : (a.name ?? '')
    ),
    journal: m['short-container-title']?.[0] ?? m['container-title']?.[0] ?? '',
    year: m.issued?.['date-parts']?.[0]?.[0] ?? m.published?.['date-parts']?.[0]?.[0],
    doi: m.DOI,
    publicationTypes: m.type ? [m.type] : [],
    source: 'crossref',
  };
}

/**
 * PubMed publication types that settle the design on their own, most specific first: a paper
 * tagged both "Meta-Analysis" and "Systematic Review" is a meta-analysis. "Observational Study"
 * is deliberately absent — it could be a cohort, case-control, or cross-sectional design.
 */
const DESIGN_BY_PUBTYPE: [string, StudyType][] = [
  ['Meta-Analysis', 'meta-analysis'],
  ['Systematic Review', 'systematic-review'],
  ['Randomized Controlled Trial, Veterinary', 'animal'],
  ['Randomized Controlled Trial', 'rct'],
  ['Review', 'review'],
];

export const inferStudyType = (publicationTypes: string[]): StudyType | undefined =>
  DESIGN_BY_PUBTYPE.find(([type]) => publicationTypes.includes(type))?.[1];
