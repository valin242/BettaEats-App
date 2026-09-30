import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import GroupCard from '@/components/cards/GroupCard';
import SystemCard from '@/components/cards/SystemCard';
import AppBar from '@/components/ui/AppBar';
import Disclaimer, { DisclaimerBold } from '@/components/ui/Disclaimer';
import { Colors, FontFamily, Spacing } from '@/constants/tokens';
import { db, search } from '@/db';
import type { FoodGroup } from '@/db/schema';

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const trimmed = query.trim();
  const { groups, systems } = useMemo(() => search(query), [query]);
  const total = groups.length + systems.length;

  const openGroup = (group: FoodGroup) => router.push(`/group/${group.id}`);

  return (
    <View style={styles.container}>
      <AppBar
        eyebrow="Evidence-based dietary health reference"
        title="Food as Medicine"
        sub="Search foods, compounds, and conditions"
        search={query}
        onSearchChange={setQuery}
      />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardDismissMode="on-drag"
      >
        {trimmed && total === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>No matches for “{trimmed}”</Text>
            <Text style={styles.emptyBody}>
              The database covers {db.foodGroups.length} food groups, {db.compounds.length} compounds, and{' '}
              {db.indications.length} conditions so far. Try a compound like “sulforaphane” or a condition like
              “blood pressure”.
            </Text>
          </View>
        ) : (
          <>
            <Text style={styles.meta}>
              {trimmed
                ? `${total} result${total === 1 ? '' : 's'} for “${trimmed}”`
                : `Browse all ${db.foodGroups.length} food groups`}
            </Text>

            {groups.length > 0 && (
              <>
                {trimmed ? <Text style={styles.sectionLabel}>Foods</Text> : null}
                {groups.map((g) => (
                  <GroupCard key={g.id} group={g} onPress={openGroup} />
                ))}
              </>
            )}

            {systems.length > 0 && (
              <>
                <Text style={[styles.sectionLabel, groups.length > 0 && { marginTop: Spacing.sp4 }]}>Body systems</Text>
                {systems.map((s) => (
                  <SystemCard key={s.id} system={s} />
                ))}
              </>
            )}
          </>
        )}

        <View style={{ marginTop: Spacing.sp4 }}>
          <Disclaimer kind="info">
            <DisclaimerBold>Educational reference only.</DisclaimerBold> Consult a healthcare provider before
            significant dietary changes, especially if managing a condition or taking medications.
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
