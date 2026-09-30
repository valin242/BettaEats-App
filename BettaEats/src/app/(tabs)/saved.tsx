import { router } from 'expo-router';
import { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import GroupCard from '@/components/cards/GroupCard';
import SystemCard from '@/components/cards/SystemCard';
import AppBar from '@/components/ui/AppBar';
import Btn from '@/components/ui/Btn';
import { Colors, FontFamily, Spacing } from '@/constants/tokens';
import { useAppContext } from '@/context/AppContext';
import { getGroup, getSystem } from '@/db';
import type { BodySystem, FoodGroup } from '@/db/schema';

export default function SavedScreen() {
  const { state } = useAppContext();

  // Most recent first, which `state.saved` already carries. Entries whose record no longer
  // exists (renamed or removed from the data) are skipped rather than shown broken.
  const savedGroups = useMemo(
    () =>
      state.saved
        .filter((s) => s.kind === 'group')
        .map((s) => getGroup(s.id))
        .filter((g): g is FoodGroup => g !== undefined),
    [state.saved]
  );

  const savedSystems = useMemo(
    () =>
      state.saved
        .filter((s) => s.kind === 'system')
        .map((s) => getSystem(s.id))
        .filter((o): o is BodySystem => o !== undefined),
    [state.saved]
  );

  const total = savedGroups.length + savedSystems.length;
  const openGroup = (group: FoodGroup) => router.push(`/group/${group.id}`);

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
              Tap “Save” on any food group or body system to keep it here for quick reference.
            </Text>
            <View style={styles.emptyCta}>
              <Btn onPress={() => router.push('/(tabs)/browse')}>Browse foods</Btn>
            </View>
          </View>
        ) : (
          <>
            {savedGroups.length > 0 && (
              <>
                <Text style={styles.sectionLabel}>Foods</Text>
                {savedGroups.map((g) => (
                  <GroupCard key={g.id} group={g} onPress={openGroup} />
                ))}
              </>
            )}
            {savedSystems.length > 0 && (
              <>
                <Text style={[styles.sectionLabel, savedGroups.length > 0 && { marginTop: Spacing.sp4 }]}>
                  Body systems
                </Text>
                {savedSystems.map((o) => (
                  <SystemCard key={o.id} system={o} />
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
