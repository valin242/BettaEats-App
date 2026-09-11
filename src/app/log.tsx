import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Btn from '@/components/ui/Btn';
import { FOODS } from '@/constants/data';
import { Colors, FontFamily, Radii, Spacing } from '@/constants/tokens';
import { useAppContext } from '@/context/AppContext';

const MEAL_TYPES = ['Breakfast', 'Lunch', 'Dinner', 'Snack'] as const;

export default function LogMealScreen() {
  const insets = useSafeAreaInsets();
  const { addMeal } = useAppContext();
  const [mealType, setMealType] = useState<(typeof MEAL_TYPES)[number]>('Lunch');
  const [picked, setPicked] = useState<Set<string>>(new Set(['cruciferous', 'leafy']));

  const toggle = (id: string) => {
    setPicked((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleSave = () => {
    const time = new Date().toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
    const selectedFoods = FOODS.filter((f) => picked.has(f.id));
    const groups = selectedFoods.map((f) => f.group).join(', ');
    addMeal({
      em: selectedFoods[0]?.emoji ?? '🍽️',
      h: `${mealType}: ${groups || 'no groups'}`,
      s: `${picked.size} food group${picked.size !== 1 ? 's' : ''}`,
      time,
    });
    router.back();
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
          <Text style={styles.cancelText}>← Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.headerLabel}>Log a meal</Text>
        <View style={{ width: 60 }} />
      </View>

      <Text style={styles.title}>What did you eat?</Text>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Meal type */}
        <Text style={styles.h2}>Meal</Text>
        <View style={styles.mealTypes}>
          {MEAL_TYPES.map((m) => (
            <TouchableOpacity
              key={m}
              style={[styles.mealBtn, mealType === m && styles.mealBtnActive]}
              onPress={() => setMealType(m)}
              activeOpacity={0.7}
            >
              <Text style={[styles.mealBtnText, mealType === m && styles.mealBtnTextActive]}>
                {m}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Food group grid */}
        <Text style={[styles.h2, { marginTop: Spacing.sp4 }]}>Tap food groups</Text>
        <Text style={styles.meta}>Don't worry about portions — we estimate from group + meal type.</Text>

        <View style={styles.grid}>
          {FOODS.map((f) => {
            const active = picked.has(f.id);
            return (
              <TouchableOpacity
                key={f.id}
                style={[
                  styles.tile,
                  { backgroundColor: active ? f.hb : Colors.surface, borderColor: active ? f.bd : Colors.border2 },
                ]}
                onPress={() => toggle(f.id)}
                activeOpacity={0.8}
              >
                <Text style={styles.tileEmoji}>{f.emoji}</Text>
                <View style={styles.tileText}>
                  <Text style={styles.tileName}>{f.group}</Text>
                  <Text style={styles.tileSub} numberOfLines={1}>
                    {f.items.split(',')[0]}, …
                  </Text>
                </View>
                {active && <Text style={[styles.check, { color: f.ac }]}>✓</Text>}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Save */}
        <View style={{ marginTop: Spacing.sp4 }}>
          <Btn full onPress={handleSave}>
            Save meal · {picked.size} group{picked.size !== 1 ? 's' : ''}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.sp4,
    paddingVertical: Spacing.sp3,
  },
  cancelText: {
    fontFamily: FontFamily.uiBold,
    fontSize: 14,
    color: Colors.brand,
  },
  headerLabel: {
    fontFamily: FontFamily.uiBold,
    fontSize: 11,
    color: Colors.brand,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  title: {
    fontFamily: FontFamily.display,
    fontSize: 22,
    color: Colors.fg1,
    textAlign: 'center',
    marginBottom: Spacing.sp4,
    paddingHorizontal: Spacing.sp4,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.sp4,
  },
  h2: {
    fontFamily: FontFamily.display,
    fontSize: 18,
    color: Colors.fg1,
    marginBottom: Spacing.sp2,
  },
  meta: {
    fontSize: 12,
    fontFamily: FontFamily.ui,
    color: Colors.fg4,
    marginBottom: 10,
  },
  mealTypes: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
  },
  mealBtn: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: Radii.btn,
    borderWidth: 1.5,
    borderColor: Colors.border2,
    backgroundColor: Colors.surface,
  },
  mealBtnActive: {
    backgroundColor: Colors.brand,
    borderColor: Colors.brand,
  },
  mealBtnText: {
    fontFamily: FontFamily.uiMedium,
    fontSize: 13,
    color: Colors.fg2,
  },
  mealBtnTextActive: {
    color: '#fff',
    fontFamily: FontFamily.uiBold,
  },
  grid: {
    gap: 8,
  },
  tile: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Radii.card - 2,
    borderWidth: 1.5,
    padding: Spacing.sp3,
    gap: Spacing.sp2,
  },
  tileEmoji: {
    fontSize: 22,
    lineHeight: 26,
  },
  tileText: {
    flex: 1,
  },
  tileName: {
    fontFamily: FontFamily.display,
    fontSize: 12.5,
    fontWeight: '700',
    color: Colors.fg1,
  },
  tileSub: {
    fontSize: 10.5,
    fontFamily: FontFamily.ui,
    color: Colors.fg4,
    marginTop: 1,
  },
  check: {
    fontFamily: FontFamily.uiBold,
    fontSize: 16,
  },
});
