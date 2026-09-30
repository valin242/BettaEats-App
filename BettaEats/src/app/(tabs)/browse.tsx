import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import GroupCard from '@/components/cards/GroupCard';
import SystemCard from '@/components/cards/SystemCard';
import AppBar from '@/components/ui/AppBar';
import { Colors, FontFamily, Spacing } from '@/constants/tokens';
import { db } from '@/db';
import type { FoodGroup } from '@/db/schema';

// Conditions join these as a third axis with the phase-3 indication pages.
const TABS = [
  { id: 'foods', emoji: '🥦', label: 'Foods', count: db.foodGroups.length },
  { id: 'organs', emoji: '❤️', label: 'Systems', count: db.systems.length },
];

export default function BrowseScreen() {
  const [tab, setTab] = useState('foods');

  const openGroup = (group: FoodGroup) => router.push(`/group/${group.id}`);

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
            <Text style={styles.meta}>{db.foodGroups.length} food groups</Text>
            {db.foodGroups.map((g) => (
              <GroupCard key={g.id} group={g} onPress={openGroup} />
            ))}
          </>
        )}

        {tab === 'organs' && (
          <>
            <Text style={styles.meta}>{db.systems.length} body systems — tap a condition to see the evidence</Text>
            {db.systems.map((s) => (
              <SystemCard key={s.id} system={s} />
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
