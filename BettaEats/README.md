# BettaEats

A cited, offline reference for what foods do for health. Look up a food to see what it contains and what
the research says about it, or look up a condition to see which foods the evidence points to.

Expo SDK 56 · React Native 0.85 · TypeScript

```bash
npm install
npm run web        # run in the browser
npm run typecheck  # app and scripts
```

## The database

Everything the app shows comes from the JSON files in `data/`, one per collection. Edit those, never
`src/db/db.generated.json`.

| File | Holds |
| --- | --- |
| `food-groups.json` | The canonical food groups, with their colours |
| `foods.json` | Individual foods, each in at most one group |
| `compounds.json` | Compounds and compound classes, with aliases for search |
| `constituents.json` | Which foods or groups contain which compounds |
| `systems.json` | Body systems: heart, brain, colon |
| `indications.json` | Conditions and goals, optionally under a system or a broader parent |
| `claims.json` | **The core:** foods or compounds → an indication, with evidence |
| `prep-notes.json` | Preparation advice, cited the same way as claims |
| `citations.json` | Papers, each resolvable by PMID or DOI |

After editing:

```bash
npm run db:build   # validate data/, then regenerate src/db/db.generated.json
npm run db:check   # fail if the generated file is out of date (for CI)
```

### What the validator enforces

- **Verified claims are cited.** A claim is `verified` or `unverified`. A verified claim needs at least
  one citation, an `evidenceLevel`, and an `intent`. An unverified claim may *not* carry an evidence
  level: a grade is a judgment made against citations, and it has none yet.
- **Every citation resolves.** Each has a PMID or a DOI, and the same paper can't be entered twice.
- **Every reference exists.** A claim can't point at a food, compound, indication, or citation that
  isn't there.
- **Typos fail loudly.** Unknown fields are errors, so `citationId` instead of `citationIds` is caught
  rather than silently dropped.
- **Every record says where it came from.** `provenance` gives the source, where in it, the license, and
  the date.

### Verifying a claim

Add the paper to `citations.json`:

```json
{
  "id": "author-year-topic",
  "title": "<paper title>",
  "authors": "<Surname AB, Surname CD, …>",
  "journal": "<journal>",
  "year": 2013,
  "pmid": "<PubMed ID>",
  "studyType": "meta-analysis",
  "provenance": { "source": "curated", "sourceId": "pubmed", "license": "original", "retrievedAt": "2026-09-29" }
}
```

Then, on the claim, set `"status": "verified"` and add `evidenceLevel`, `intent`, and
`"citationIds": ["author-year-topic"]`. Run `npm run db:build`; it tells you if anything is missing.

A claim can also list candidate papers while still `unverified`. The app shows those as
*candidate sources — not yet graded*.

### Licensing profiles

```bash
npm run db:build              # research: ships every record
npm run db:build:commercial   # drops records under non-commercial licenses
```

FooDB, Phenol-Explorer, and CTD are free for non-commercial use only; USDA FoodData Central is public
domain. The commercial profile drops anything licensed `cc-by-nc` or `nc-permission`, and fails if a record
it keeps points at one it dropped — so a commercial build can never ship a dangling reference.

## Layout

```
data/            the database, as JSON — the source of truth
scripts/db/      validator and build CLI (run through tsx)
src/db/          schema (zod), vocabulary, runtime accessors, generated bundle
src/app/         screens (expo-router)
src/components/  UI
```

Educational reference only — not medical advice.
