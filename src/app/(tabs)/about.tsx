import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Disclaimer, { DisclaimerBold } from '@/components/ui/Disclaimer';
import { FOODS, ORGANS } from '@/constants/data';
import { Colors, FontFamily, Spacing } from '@/constants/tokens';
import { useAppContext } from '@/context/AppContext';

const EVIDENCE_LEVELS = [
  {
    label: 'Well-established',
    bg: '#e8f5ec',
    fg: '#2d7a4f',
    body: 'Consistent human evidence — meta-analyses or multiple RCTs pointing the same way.',
  },
  {
    label: 'Emerging',
    bg: '#fef0e0',
    fg: '#b06010',
    body: 'Promising human data, but limited trials or unsettled effect sizes.',
  },
  {
    label: 'Correlational',
    bg: '#f3eaf8',
    fg: '#7b3fa0',
    body: 'Observational only. Association is real; causation has not been shown.',
  },
  {
    label: 'Preclinical',
    bg: '#f0f4f0',
    fg: '#5a6a5a',
    body: 'Cell or animal work. Mechanistically interesting, not yet shown in people.',
  },
];

export default function AboutScreen() {
  const { state } = useAppContext();
  const insets = useSafeAreaInsets();

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
        <View style={styles.stat}>
          <Text style={styles.statNum}>{FOODS.length}</Text>
          <Text style={styles.statLabel}>food groups</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statNum}>{ORGANS.length}</Text>
          <Text style={styles.statLabel}>body systems</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statNum}>{state.saved.length}</Text>
          <Text style={styles.statLabel}>saved</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.h2}>How evidence is labelled</Text>
        <Text style={styles.sectionSub}>
          Every claim carries one of these. Nothing is overclaimed to make a better headline.
        </Text>
        {EVIDENCE_LEVELS.map((e) => (
          <View key={e.label} style={styles.evRow}>
            <View style={[styles.evBadge, { backgroundColor: e.bg }]}>
              <Text style={[styles.evBadgeText, { color: e.fg }]}>{e.label}</Text>
            </View>
            <Text style={styles.evBody}>{e.body}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Disclaimer kind="danger">
          <DisclaimerBold>Not medical advice.</DisclaimerBold>
          {' '}BettaEats summarises published research for education. It cannot account for your
          medications, conditions, or individual risk. Talk to a clinician before making significant
          dietary changes.
        </Disclaimer>
      </View>

      <Text style={styles.footer}>
        Based on peer-reviewed research in nutritional biochemistry, epidemiology, and clinical
        dietetics.
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
  },
  evBadge: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  evBadgeText: {
    fontFamily: FontFamily.uiBold,
    fontSize: 11,
  },
  evBody: {
    fontFamily: FontFamily.ui,
    fontSize: 12.5,
    color: Colors.fg3,
    lineHeight: 19,
    marginTop: 4,
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
