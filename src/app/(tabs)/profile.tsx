import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors, FontFamily, Spacing } from '@/constants/tokens';
import { useAppContext } from '@/context/AppContext';

export default function ProfileScreen() {
  const { state } = useAppContext();
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + Spacing.sp6 }]}
    >
      <View style={styles.logomark}>
        <Text style={styles.logoEmoji}>🥦</Text>
      </View>
      <Text style={styles.title}>BettaEats</Text>
      <Text style={styles.sub}>Evidence-based dietary health reference</Text>

      <View style={styles.statRow}>
        <View style={styles.stat}>
          <Text style={styles.statNum}>{state.streak}</Text>
          <Text style={styles.statLabel}>day streak</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statNum}>{state.meals.length}</Text>
          <Text style={styles.statLabel}>meals logged</Text>
        </View>
      </View>

      <Text style={styles.footer}>
        Based on peer-reviewed research in nutritional biochemistry, epidemiology, and clinical
        dietetics. Educational reference only — not medical advice.
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
    alignItems: 'center',
    paddingBottom: 100,
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
    gap: Spacing.sp7,
    marginTop: Spacing.sp6,
  },
  stat: {
    alignItems: 'center',
  },
  statNum: {
    fontFamily: FontFamily.display,
    fontSize: 32,
    color: Colors.brand,
  },
  statLabel: {
    fontFamily: FontFamily.ui,
    fontSize: 12,
    color: Colors.fg4,
    marginTop: 2,
  },
  footer: {
    fontFamily: FontFamily.ui,
    fontSize: 11,
    color: Colors.fg5,
    textAlign: 'center',
    lineHeight: 17,
    marginTop: Spacing.sp8,
  },
});
