import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Btn from '@/components/ui/Btn';
import { useAppContext } from '@/context/AppContext';
import { Colors, FontFamily, Spacing } from '@/constants/tokens';

const FEATURES = [
  {
    em: '🔍',
    h: 'Look up any food or compound',
    s: 'Sulforaphane, EGCG, curcumin — what they actually do, by pathway.',
  },
  {
    em: '❤️',
    h: 'Search by organ & condition',
    s: 'Find what protects the heart, brain, gut and immune system.',
  },
  {
    em: '📊',
    h: 'Honest evidence labels',
    s: 'Well-established · Emerging · Correlational. Never overclaimed.',
  },
];

export default function OnboardingScreen() {
  const { setOnboarded } = useAppContext();
  const insets = useSafeAreaInsets();

  const handleStart = () => {
    setOnboarded();
    router.replace('/(tabs)');
  };

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + Spacing.sp8, paddingBottom: insets.bottom + Spacing.sp6 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      {/* Logomark */}
      <View style={styles.logomark}>
        <Text style={styles.logoEmoji}>🥦</Text>
      </View>

      <Text style={styles.headline}>Eat for the body{'\n'}you're building.</Text>
      <Text style={styles.body}>
        BettaEats turns peer-reviewed nutritional biochemistry into something you can look up in
        seconds — what a food contains, what it protects, and how to prepare it for maximum effect.
      </Text>

      <View style={styles.features}>
        {FEATURES.map((f) => (
          <View key={f.h} style={styles.feature}>
            <Text style={styles.featureEmoji}>{f.em}</Text>
            <View style={styles.featureText}>
              <Text style={styles.featureHead}>{f.h}</Text>
              <Text style={styles.featureSub}>{f.s}</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.spacer} />

      <Btn full onPress={handleStart}>
        Get started
      </Btn>

      <Text style={styles.disclaimer}>
        Educational reference only — not medical advice.
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
    flexGrow: 1,
  },
  logomark: {
    width: 56,
    height: 56,
    borderRadius: 14,
    backgroundColor: Colors.brand,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoEmoji: {
    fontSize: 28,
  },
  headline: {
    fontFamily: FontFamily.display,
    fontSize: 30,
    color: Colors.fg1,
    lineHeight: 36,
    marginTop: Spacing.sp5,
  },
  body: {
    fontFamily: FontFamily.ui,
    fontSize: 14,
    color: Colors.fg3,
    lineHeight: 22,
    marginTop: 10,
  },
  features: {
    gap: Spacing.sp3,
    marginTop: Spacing.sp6,
  },
  feature: {
    flexDirection: 'row',
    gap: Spacing.sp3,
    alignItems: 'flex-start',
  },
  featureEmoji: {
    fontSize: 26,
    lineHeight: 30,
  },
  featureText: {
    flex: 1,
  },
  featureHead: {
    fontFamily: FontFamily.display,
    fontWeight: '700',
    fontSize: 14,
    color: Colors.fg1,
  },
  featureSub: {
    fontFamily: FontFamily.ui,
    fontSize: 12,
    color: Colors.fg3,
    marginTop: 2,
    lineHeight: 18,
  },
  spacer: {
    flex: 1,
    minHeight: Spacing.sp8,
  },
  disclaimer: {
    fontFamily: FontFamily.ui,
    fontSize: 11,
    color: Colors.fg4,
    textAlign: 'center',
    marginTop: 10,
  },
});
