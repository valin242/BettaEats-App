import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Disclaimer, { DisclaimerBold } from '@/components/ui/Disclaimer';
import EvidenceBadge from '@/components/ui/EvidenceBadge';
import { Colors, FontFamily, Spacing } from '@/constants/tokens';
import { db, verifiedCount } from '@/db';
import { EVIDENCE_DESCRIPTIONS, EVIDENCE_LEVELS, UNVERIFIED_DESCRIPTION } from '@/db/vocab';

const STATS = [
  { value: db.foodGroups.length, label: 'food groups' },
  { value: db.compounds.length, label: 'compounds' },
  { value: db.claims.length, label: 'claims' },
];

export default function AboutScreen() {
  const insets = useSafeAreaInsets();
  const cited = verifiedCount(db.claims);

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + Spacing.sp6 }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <View style={styles.logomark}>
          <Text style={styles.logoEmoji}>🥦</Text>
        </View>
        <Text style={styles.title}>BettaEats</Text>
        <Text style={styles.sub}>Evidence-based dietary health reference</Text>
      </View>

      <View style={styles.statRow}>
        {STATS.map((s) => (
          <View key={s.label} style={styles.stat}>
            <Text style={styles.statNum}>{s.value}</Text>
            <Text style={styles.statLabel}>{s.label}</Text>
          </View>
        ))}
      </View>
      <Text style={styles.cited}>
        {cited} of {db.claims.length} claims checked against a published source
      </Text>

      <View style={styles.section}>
        <Text style={styles.h2}>How evidence is labelled</Text>
        <Text style={styles.sectionSub}>
          Every claim carries one of these. A grade is only given once a claim has been checked against its
          sources — nothing is overclaimed to make a better headline.
        </Text>
        {EVIDENCE_LEVELS.map((level) => (
          <View key={level} style={styles.evRow}>
            <EvidenceBadge level={level} />
            <Text style={styles.evBody}>{EVIDENCE_DESCRIPTIONS[level]}</Text>
          </View>
        ))}
        <View style={styles.evRow}>
          <EvidenceBadge />
          <Text style={styles.evBody}>{UNVERIFIED_DESCRIPTION}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Disclaimer kind="danger">
          <DisclaimerBold>Not medical advice.</DisclaimerBold> BettaEats summarises published research for
          education. It cannot account for your medications, conditions, or individual risk. Talk to a clinician
          before making significant dietary changes.
        </Disclaimer>
      </View>

      <Text style={styles.footer}>
        Based on peer-reviewed research in nutritional biochemistry, epidemiology, and clinical dietetics.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  content: {
    paddingHorizontal: Spacing.sp5,
    paddingBottom: 100,
  },
  header: {
    alignItems: 'center',
  },
  logomark: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: Colors.brand,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoEmoji: {
    fontSize: 32,
  },
  title: {
    fontFamily: FontFamily.display,
    fontSize: 26,
    color: Colors.fg1,
    marginTop: Spacing.sp4,
  },
  sub: {
    fontFamily: FontFamily.ui,
    fontSize: 13,
    color: Colors.fg4,
    marginTop: 4,
    textAlign: 'center',
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.sp7,
    marginTop: Spacing.sp6,
  },
  stat: {
    alignItems: 'center',
  },
  statNum: {
    fontFamily: FontFamily.display,
    fontSize: 30,
    color: Colors.brand,
  },
  statLabel: {
    fontFamily: FontFamily.ui,
    fontSize: 12,
    color: Colors.fg4,
    marginTop: 2,
  },
  cited: {
    fontFamily: FontFamily.uiMedium,
    fontSize: 12,
    color: Colors.fg3,
    textAlign: 'center',
    marginTop: Spacing.sp3,
  },
  section: {
    marginTop: Spacing.sp8,
  },
  h2: {
    fontFamily: FontFamily.display,
    fontSize: 18,
    color: Colors.fg1,
    marginBottom: 2,
  },
  sectionSub: {
    fontFamily: FontFamily.ui,
    fontSize: 12,
    color: Colors.fg4,
    lineHeight: 18,
    marginBottom: Spacing.sp3,
  },
  evRow: {
    marginBottom: Spacing.sp3,
    gap: 4,
  },
  evBody: {
    fontFamily: FontFamily.ui,
    fontSize: 12.5,
    color: Colors.fg3,
    lineHeight: 19,
  },
  footer: {
    fontFamily: FontFamily.ui,
    fontSize: 11,
    color: Colors.fg5,
    textAlign: 'center',
    lineHeight: 17,
    marginTop: Spacing.sp7,
  },
});
