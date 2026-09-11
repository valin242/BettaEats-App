import { router } from 'expo-router';
import { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import FoodCard from '@/components/cards/FoodCard';
import OrganCard from '@/components/cards/OrganCard';
import AppBar from '@/components/ui/AppBar';
import Btn from '@/components/ui/Btn';
import { FOODS, ORGANS } from '@/constants/data';
import { Colors, FontFamily, Spacing } from '@/constants/tokens';
import { useAppContext } from '@/context/AppContext';
import type { Food } from '@/types';

export default function SavedScreen() {
  const { state } = useAppContext();

  // Preserve save order (most recent first), which `state.saved` already carries.
  const savedFoods = useMemo(
    () =>
      state.saved
        .filter((s) => s.kind === 'food')
        .map((s) => FOODS.find((f) => f.id === s.id))
        .filter((f): f is Food => f !== undefined),
    [state.saved]
  );

  const savedOrgans = useMemo(
    () =>
      state.saved
        .filter((s) => s.kind === 'organ')
        .map((s) => ORGANS.find((o) => o.id === s.id))
        .filter((o): o is NonNullable<typeof o> => o !== undefined),
    [state.saved]
  );

  const total = savedFoods.length + savedOrgans.length;
  const openFood = (food: Food) => router.push(`/food/${food.id}`);

  return (
    <View style={styles.container}>
      <AppBar
        eyebrow="Saved"
        title="Your references"
        sub={total === 0 ? 'Nothing saved yet' : `${total} saved entr${total === 1 ? 'y' : 'ies'}`}
      />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {total === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>🔖</Text>
            <Text style={styles.emptyTitle}>Nothing saved yet</Text>
            <Text style={styles.emptyBody}>
              Tap “Save” on any food or system to keep it here for quick reference.
            </Text>
            <View style={styles.emptyCta}>
              <Btn onPress={() => router.push('/(tabs)/browse')}>Browse foods</Btn>
            </View>
          </View>
        ) : (
          <>
            {savedFoods.length > 0 && (
              <>
                <Text style={styles.sectionLabel}>Foods</Text>
                {savedFoods.map((f) => (
                  <FoodCard key={f.id} food={f} onPress={openFood} />
                ))}
              </>
            )}
            {savedOrgans.length > 0 && (
              <>
                <Text style={[styles.sectionLabel, savedFoods.length > 0 && { marginTop: Spacing.sp4 }]}>
                  Body systems
                </Text>
                {savedOrgans.map((o) => (
                  <OrganCard key={o.id} organ={o} />
                ))}
              </>
            )}
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
    paddingTop: Spacing.sp4,
    paddingBottom: 100,
  },
  sectionLabel: {
    fontSize: 10,
    fontFamily: FontFamily.uiBold,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: Colors.fg4,
    marginBottom: 6,
  },
  empty: {
    paddingVertical: Spacing.sp9,
    alignItems: 'center',
  },
  emptyEmoji: {
    fontSize: 34,
    lineHeight: 40,
  },
  emptyTitle: {
    fontFamily: FontFamily.display,
    fontSize: 18,
    color: Colors.fg1,
    marginTop: Spacing.sp2,
  },
  emptyBody: {
    fontFamily: FontFamily.ui,
    fontSize: 13,
    color: Colors.fg4,
    textAlign: 'center',
    lineHeight: 20,
    marginTop: 6,
    maxWidth: 280,
  },
  emptyCta: {
    marginTop: Spacing.sp5,
  },
});
