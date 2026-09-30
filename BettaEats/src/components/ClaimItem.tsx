import { openBrowserAsync } from 'expo-web-browser';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import EvidenceBadge from '@/components/ui/EvidenceBadge';
import { Colors, FontFamily, Spacing } from '@/constants/tokens';
import { citationsFor, foodSubjectNames, levelOf } from '@/db';
import type { Citation, Claim } from '@/db/schema';
import { STUDY_TYPE_LABELS } from '@/db/vocab';

interface Props {
  claim: Claim;
  accent: string;
  /** List the foods the claim names, for context outside a single food's own page. */
  showFoods?: boolean;
}

export default function ClaimItem({ claim, accent, showFoods = false }: Props) {
  const citations = citationsFor(claim);
  const foods = showFoods ? foodSubjectNames(claim) : [];

  return (
    <View style={styles.item}>
      {claim.headline ? <Text style={[styles.headline, { color: accent }]}>{claim.headline}</Text> : null}
      <Text style={styles.statement}>{claim.statement}</Text>
      {claim.status === 'verified' && claim.effectSize ? (
        <Text style={styles.effect}>Effect size: {claim.effectSize}</Text>
      ) : null}
      {foods.length > 0 ? (
        <Text style={[styles.foods, { color: accent }]}>
          🥗 Key foods: <Text style={styles.foodsDetail}>{foods.join(', ')}</Text>
        </Text>
      ) : null}
      <View style={styles.badgeRow}>
        <EvidenceBadge level={levelOf(claim)} />
      </View>
      {citations.length > 0 ? (
        <View style={styles.sources}>
          <Text style={styles.sourcesLabel}>
            {claim.status === 'verified' ? 'Sources' : 'Candidate sources — not yet graded'}
          </Text>
          {citations.map((c) => (
            <CitationRow key={c.id} citation={c} />
          ))}
        </View>
      ) : null}
    </View>
  );
}

const citationUrl = (c: Citation) =>
  c.pmid ? `https://pubmed.ncbi.nlm.nih.gov/${c.pmid}/` : `https://doi.org/${c.doi}`;

const firstAuthor = (authors: string) => {
  const names = authors.split(',').map((s) => s.trim());
  return names.length > 1 ? `${names[0]} et al.` : names[0];
};

function CitationRow({ citation: c }: { citation: Citation }) {
  return (
    <TouchableOpacity
      style={styles.citation}
      // Called straight from the press handler: mobile browsers block pop-ups opened after an await.
      onPress={() => openBrowserAsync(citationUrl(c))}
      activeOpacity={0.7}
      accessibilityRole="link"
      accessibilityLabel={`${c.title}, ${c.journal} ${c.year}. Opens the paper.`}
    >
      <Text style={styles.citationTitle} numberOfLines={2}>
        {c.title}
      </Text>
      <Text style={styles.citationMeta}>
        {firstAuthor(c.authors)} · {c.journal} · {c.year} · {STUDY_TYPE_LABELS[c.studyType]}
        {c.pmid ? ` · PMID ${c.pmid}` : ''}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  item: {
    gap: 6,
  },
  headline: {
    fontFamily: FontFamily.uiBold,
    fontSize: 12.5,
  },
  statement: {
    fontSize: 13.5,
    fontFamily: FontFamily.ui,
    color: '#2a3a2a',
    lineHeight: 21,
  },
  effect: {
    fontSize: 12,
    fontFamily: FontFamily.uiMedium,
    color: Colors.fg2,
  },
  foods: {
    fontSize: 11.5,
    fontFamily: FontFamily.uiBold,
  },
  foodsDetail: {
    fontFamily: FontFamily.ui,
    color: Colors.fg3,
  },
  badgeRow: {
    flexDirection: 'row',
  },
  sources: {
    marginTop: Spacing.sp1,
    gap: 6,
  },
  sourcesLabel: {
    fontSize: 10,
    fontFamily: FontFamily.uiBold,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: Colors.fg4,
  },
  citation: {
    borderLeftWidth: 2,
    borderLeftColor: Colors.border1,
    paddingLeft: Spacing.sp2,
    paddingVertical: 2,
  },
  citationTitle: {
    fontSize: 12,
    fontFamily: FontFamily.uiMedium,
    color: Colors.brand,
    lineHeight: 17,
  },
  citationMeta: {
    fontSize: 11,
    fontFamily: FontFamily.ui,
    color: Colors.fg4,
    marginTop: 1,
  },
});
