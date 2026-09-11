import { router, useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import AppBar from '@/components/ui/AppBar';
import Btn from '@/components/ui/Btn';
import Disclaimer, { DisclaimerBold } from '@/components/ui/Disclaimer';
import Tag from '@/components/ui/Tag';
import { FOODS } from '@/constants/data';
import { Colors, FontFamily, Spacing } from '@/constants/tokens';
import { useAppContext } from '@/context/AppContext';

export default function FoodDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { toggleSaved, isSaved } = useAppContext();

  const food = FOODS.find((f) => f.id === id);

  if (!food) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.notFoundText}>Food not found.</Text>
      </View>
    );
  }

  const saved = isSaved('food', food.id);

  return (
    <View style={styles.container}>
      <AppBar onBack={() => router.back()} title="" />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <View style={[styles.hero, { backgroundColor: food.hb, borderBottomColor: food.bd }]}>
          <Text style={styles.heroEmoji}>{food.emoji}</Text>
          <Text style={styles.heroTitle}>{food.group}</Text>
          <Text style={styles.heroItems}>{food.items}</Text>
          <View style={styles.tagsRow}>
            {food.tags.map((t) => (
              <Tag key={t} label={t} bg="#fff" color={food.ac} />
            ))}
          </View>
        </View>

        {/* Compounds */}
        <View style={styles.section}>
          <Text style={styles.h2}>Key compounds</Text>
          <View style={styles.tagsRow}>
            {food.compounds.map((c) => (
              <Tag key={c} label={c} bg="#f0f4f0" color="#3d5a3e" />
            ))}
          </View>
        </View>

        {/* Benefits */}
        <View style={styles.section}>
          <Text style={styles.h2}>Evidence-based benefits</Text>
          {food.benefits.map((b, i) => (
            <Text key={i} style={styles.benefit}>• {b}</Text>
          ))}
        </View>

        {/* Prep */}
        <View style={styles.section}>
          <View style={[styles.prep, { backgroundColor: food.hb, borderLeftColor: food.ac }]}>
            <Text style={[styles.prepHead, { color: food.ac }]}>👨‍🍳 Best preparation</Text>
            <Text style={styles.prepBody}>{food.prep}</Text>
          </View>
        </View>

        {/* Evidence note */}
        <View style={styles.section}>
          <Disclaimer kind="corr">
            <DisclaimerBold>Note on evidence.</DisclaimerBold>
            {' '}"{food.evidence}" — claims are mechanistic where based on lab studies, and population-level where based on epidemiology. Effect sizes vary.
          </Disclaimer>
        </View>

        {/* CTA */}
        <View style={[styles.section, styles.ctas]}>
          <Btn
            variant={saved ? 'secondary' : 'primary'}
            full
            onPress={() => toggleSaved('food', food.id)}
          >
            {saved ? '🔖 Saved — tap to remove' : 'Save for reference'}
          </Btn>
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
  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notFoundText: {
    fontFamily: FontFamily.ui,
    color: Colors.fg4,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingBottom: 120,
  },
  hero: {
    padding: Spacing.sp4,
    borderBottomWidth: 1,
  },
  heroEmoji: {
    fontSize: 40,
    lineHeight: 48,
  },
  heroTitle: {
    fontFamily: FontFamily.display,
    fontSize: 22,
    color: Colors.fg1,
    marginTop: 4,
  },
  heroItems: {
    fontSize: 12,
    fontFamily: FontFamily.ui,
    color: Colors.fg4,
    marginTop: 4,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: Spacing.sp2,
  },
  section: {
    paddingHorizontal: Spacing.sp4,
    paddingTop: Spacing.sp4,
  },
  h2: {
    fontFamily: FontFamily.display,
    fontSize: 18,
    color: Colors.fg1,
    marginBottom: Spacing.sp2,
  },
  benefit: {
    fontSize: 13.5,
    fontFamily: FontFamily.ui,
    color: '#2a3a2a',
    lineHeight: 21,
    marginBottom: 7,
  },
  prep: {
    borderRadius: 8,
    padding: Spacing.sp3,
    borderLeftWidth: 3,
  },
  prepHead: {
    fontSize: 11,
    fontFamily: FontFamily.uiBold,
    marginBottom: 3,
  },
  prepBody: {
    fontSize: 13,
    fontFamily: FontFamily.ui,
    color: '#3a4a3a',
    lineHeight: 20,
  },
  ctas: {
    paddingBottom: 24,
  },
});
