import { ScrollView, StyleSheet, Text, View } from 'react-native';

import CoverageRow from '@/components/insights/CoverageRow';
import WeekBars from '@/components/insights/WeekBars';
import AppBar from '@/components/ui/AppBar';
import Btn from '@/components/ui/Btn';
import Disclaimer, { DisclaimerBold } from '@/components/ui/Disclaimer';
import Tag from '@/components/ui/Tag';
import { INSIGHTS } from '@/constants/data';
import { Colors, FontFamily, Radii, Shadows, Spacing } from '@/constants/tokens';

export default function InsightsScreen() {
  return (
    <View style={styles.container}>
      <AppBar
        eyebrow="This week"
        title="Insights"
        sub="Coverage, diversity, and where to focus next"
      />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          {/* Food groups per day */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Food groups per day</Text>
            <Text style={styles.cardSub}>Goal: 6+ of 12 groups daily</Text>
            <WeekBars week={INSIGHTS.week} max={INSIGHTS.maxGroups} />
          </View>

          {/* Organ protection */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Organ protection coverage</Text>
            <Text style={styles.cardSub}>Share of each system's top foods you ate this week</Text>
            {INSIGHTS.coverage.map((c) => (
              <CoverageRow key={c.nm} c={c} />
            ))}
          </View>

          {/* Top compounds */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Top compounds this week</Text>
            <Text style={styles.cardSub}>From your logged meals</Text>
            <View style={styles.tagsRow}>
              {INSIGHTS.topCompounds.map((c) => (
                <Tag key={c} label={c} bg="#f0f4f0" color="#3d5a3e" />
              ))}
            </View>
          </View>

          {/* Gap card */}
          <View style={[styles.card, styles.gapCard]}>
            <Text style={styles.cardTitle}>
              Biggest gap: {INSIGHTS.gap.nm} {INSIGHTS.gap.em}
            </Text>
            <Text style={styles.gapWhy}>{INSIGHTS.gap.why}</Text>
            <View style={{ marginTop: 10 }}>
              <Btn size="sm">See legume recipes</Btn>
            </View>
          </View>

          <Disclaimer kind="corr">
            <DisclaimerBold>Coverage is a heuristic.</DisclaimerBold>
            {' '}Scores reflect how often you logged each system's protective foods — they are not a clinical measure of organ health.
          </Disclaimer>

          <View style={{ height: 16 }} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingBottom: 100,
  },
  section: {
    paddingHorizontal: Spacing.sp4,
    paddingTop: Spacing.sp4,
  },
  card: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border1,
    borderRadius: Radii.card,
    padding: Spacing.sp4,
    marginBottom: Spacing.sp3,
    ...Shadows.shadow1,
  },
  gapCard: {
    borderColor: Colors.brandSoftBorder,
    backgroundColor: Colors.brandSoft,
  },
  cardTitle: {
    fontFamily: FontFamily.display,
    fontSize: 15,
    color: Colors.fg1,
    marginBottom: 2,
  },
  cardSub: {
    fontSize: 11.5,
    fontFamily: FontFamily.ui,
    color: Colors.fg4,
    marginBottom: 12,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  gapWhy: {
    fontSize: 13,
    fontFamily: FontFamily.ui,
    color: Colors.fg2,
    lineHeight: 20,
    marginTop: 4,
  },
});
