import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import FoodCard from '@/components/cards/FoodCard';
import OrganCard from '@/components/cards/OrganCard';
import AppBar from '@/components/ui/AppBar';
import Disclaimer, { DisclaimerBold } from '@/components/ui/Disclaimer';
import { FOODS, ORGANS } from '@/constants/data';
import { Colors, FontFamily, Spacing } from '@/constants/tokens';
import type { Food } from '@/types';

/** Every string on a food that a reader might reasonably search for. */
function foodHaystack(f: Food) {
  return [f.group, f.items, ...f.compounds, ...f.tags, f.evidence].join(' ').toLowerCase();
}

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const q = query.trim().toLowerCase();

  const foods = useMemo(
    () => (q ? FOODS.filter((f) => foodHaystack(f).includes(q)) : FOODS),
    [q]
  );

  const organs = useMemo(
    () =>
      q
        ? ORGANS.filter((o) =>
            [o.name, ...o.topFoods, ...o.cards.map((c) => `${c.title} ${c.body} ${c.foods}`)]
              .join(' ')
              .toLowerCase()
              .includes(q)
          )
        : [],
    [q]
  );

  const total = foods.length + organs.length;
  const openFood = (food: Food) => router.push(`/food/${food.id}`);

  return (
    <View style={styles.container}>
      <AppBar
        eyebrow="Evidence-based dietary health reference"
        title="Food as Medicine"
        sub="Search foods, compounds, and body systems"
        search={query}
        onSearchChange={setQuery}
      />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardDismissMode="on-drag"
      >
        {q && total === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>No matches for “{query.trim()}”</Text>
            <Text style={styles.emptyBody}>
              The database currently covers {FOODS.length} food groups and {ORGANS.length} body
              systems. Try a compound name like “sulforaphane”, or a system like “brain”.
            </Text>
          </View>
        ) : (
          <>
            <Text style={styles.meta}>
              {q
                ? `${total} result${total === 1 ? '' : 's'} for “${query.trim()}”`
                : `Browse all ${FOODS.length} food groups`}
            </Text>

            {foods.length > 0 && (
              <>
                {q ? <Text style={styles.sectionLabel}>Foods</Text> : null}
                {foods.map((f) => (
                  <FoodCard key={f.id} food={f} onPress={openFood} />
                ))}
              </>
            )}

            {organs.length > 0 && (
              <>
                <Text style={[styles.sectionLabel, { marginTop: Spacing.sp4 }]}>Body systems</Text>
                {organs.map((o) => (
                  <OrganCard key={o.id} organ={o} />
                ))}
              </>
            )}
          </>
        )}

        <View style={{ marginTop: Spacing.sp4 }}>
          <Disclaimer kind="info">
            <DisclaimerBold>Educational reference only.</DisclaimerBold>
            {' '}Consult a healthcare provider before significant dietary changes, especially if
            managing a condition or taking medications.
          </Disclaimer>
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
    paddingHorizontal: Spacing.sp4,
    paddingTop: Spacing.sp3,
    paddingBottom: 100,
  },
  meta: {
    fontSize: 12,
    fontFamily: FontFamily.ui,
    color: Colors.fg4,
    marginBottom: 10,
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
    paddingVertical: Spacing.sp8,
    alignItems: 'center',
  },
  emptyTitle: {
    fontFamily: FontFamily.display,
    fontSize: 17,
    color: Colors.fg1,
    textAlign: 'center',
  },
  emptyBody: {
    fontFamily: FontFamily.ui,
    fontSize: 13,
    color: Colors.fg4,
    textAlign: 'center',
    lineHeight: 20,
    marginTop: 6,
    maxWidth: 300,
  },
});
