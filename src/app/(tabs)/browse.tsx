import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import FoodCard from '@/components/cards/FoodCard';
import OrganCard from '@/components/cards/OrganCard';
import AppBar from '@/components/ui/AppBar';
import { FOODS, ORGANS } from '@/constants/data';
import { Colors, FontFamily, Spacing } from '@/constants/tokens';
import type { Food } from '@/types';

// Indications join these as a third axis once the phase-1 schema lands.
const TABS = [
  { id: 'foods', emoji: '🥦', label: 'Foods', count: FOODS.length },
  { id: 'organs', emoji: '❤️', label: 'Systems', count: ORGANS.length },
];

export default function BrowseScreen() {
  const [tab, setTab] = useState('foods');

  const openFood = (food: Food) => router.push(`/food/${food.id}`);

  return (
    <View style={styles.container}>
      <AppBar
        eyebrow="Browse"
        title="By food, by system"
        sub="Every entry links to its compounds and evidence"
        tabs={TABS}
        activeTab={tab}
        onTab={setTab}
      />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {tab === 'foods' && (
          <>
            <Text style={styles.meta}>{FOODS.length} food groups</Text>
            {FOODS.map((f) => (
              <FoodCard key={f.id} food={f} onPress={openFood} />
            ))}
          </>
        )}

        {tab === 'organs' && (
          <>
            <Text style={styles.meta}>{ORGANS.length} organs &amp; systems — tap a row to expand</Text>
            {ORGANS.map((o) => (
              <OrganCard key={o.id} organ={o} />
            ))}
          </>
        )}
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
    paddingHorizontal: Spacing.sp4,
    paddingTop: Spacing.sp3,
    paddingBottom: 100,
  },
  meta: {
    fontSize: 12,
    fontFamily: FontFamily.ui,
    color: Colors.fg4,
    textAlign: 'center',
    marginBottom: 10,
  },
});
