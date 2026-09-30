import { router, useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import ClaimItem from '@/components/ClaimItem';
import AppBar from '@/components/ui/AppBar';
import Btn from '@/components/ui/Btn';
import Disclaimer, { DisclaimerBold } from '@/components/ui/Disclaimer';
import EvidenceBadge from '@/components/ui/EvidenceBadge';
import Tag from '@/components/ui/Tag';
import { Colors, FontFamily, Spacing } from '@/constants/tokens';
import { useAppContext } from '@/context/AppContext';
import {
  byIndication,
  claimsForGroup,
  compoundsForGroup,
  foodsInGroup,
  foodSubjectNames,
  getGroup,
  indicationsOf,
  levelOf,
  prepNotesForGroup,
  verifiedCount,
} from '@/db';

export default function GroupDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { toggleSaved, isSaved } = useAppContext();
  const group = getGroup(id);

  if (!group) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.notFoundText}>Food group not found.</Text>
      </View>
    );
  }

  const { palette } = group;
  const claims = claimsForGroup(group.id);
  const compounds = compoundsForGroup(group.id);
  const prepNotes = prepNotesForGroup(group.id);
  const saved = isSaved('group', group.id);
  const anyVerified = verifiedCount(claims) > 0 || prepNotes.some((p) => p.status === 'verified');

  return (
    <View style={styles.container}>
      <AppBar onBack={() => router.back()} title="" />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.hero, { backgroundColor: palette.bg, borderBottomColor: palette.border }]}>
          <Text style={styles.heroEmoji}>{group.emoji}</Text>
          <Text style={styles.heroTitle}>{group.name}</Text>
          <Text style={styles.heroItems}>{foodsInGroup(group.id).map((f) => f.name).join(', ')}</Text>
          <View style={styles.tagsRow}>
            {indicationsOf(claims).map((i) => (
              <Tag key={i.id} label={i.name} bg="#fff" color={palette.accent} />
            ))}
          </View>
        </View>

        {compounds.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.h2}>Key compounds</Text>
            <View style={styles.tagsRow}>
              {compounds.map((c) => (
                <Tag key={c.id} label={c.name} bg="#f0f4f0" color="#3d5a3e" />
              ))}
            </View>
          </View>
        ) : null}

        <View style={styles.section}>
          <Text style={styles.h2}>What the research says</Text>
          {claims.length === 0 ? (
            <Text style={styles.empty}>No claims recorded for this group yet.</Text>
          ) : (
            byIndication(claims).map(({ indication, claims: rows }) => (
              <View key={indication.id} style={styles.indication}>
                <Text style={[styles.indicationName, { color: palette.accent }]}>{indication.name}</Text>
                {rows.map((claim) => (
                  <View key={claim.id} style={styles.claim}>
                    <ClaimItem
                      claim={claim}
                      accent={palette.accent}
                      // Name the foods when the claim reaches beyond this group, e.g. olive oil beside berries.
                      showFoods={foodSubjectNames(claim).some((name) => name !== group.name)}
                    />
                  </View>
                ))}
              </View>
            ))
          )}
        </View>

        {prepNotes.map((note) => (
          <View key={note.id} style={styles.section}>
            <View style={[styles.prep, { backgroundColor: palette.bg, borderLeftColor: palette.accent }]}>
              <Text style={[styles.prepHead, { color: palette.accent }]}>👨‍🍳 Best preparation</Text>
              <Text style={styles.prepBody}>{note.text}</Text>
              <View style={styles.prepBadge}>
                <EvidenceBadge level={levelOf(note)} />
              </View>
            </View>
          </View>
        ))}

        <View style={styles.section}>
          <Disclaimer kind="corr">
            <DisclaimerBold>Note on evidence.</DisclaimerBold>{' '}
            {anyVerified
              ? 'Grades reflect the cited studies. Effect sizes vary with dose, preparation, and the person.'
              : 'Everything here was carried over from an early draft and hasn’t been checked against published sources yet. Treat it as a lead to follow up, not a finding.'}
          </Disclaimer>
        </View>

        <View style={[styles.section, styles.ctas]}>
          <Btn variant={saved ? 'secondary' : 'primary'} full onPress={() => toggleSaved('group', group.id)}>
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
  empty: {
    fontFamily: FontFamily.ui,
    fontSize: 13,
    color: Colors.fg4,
  },
  indication: {
    marginTop: Spacing.sp2,
    gap: Spacing.sp3,
  },
  indicationName: {
    fontSize: 10.5,
    fontFamily: FontFamily.uiBold,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: -4,
  },
  claim: {
    paddingBottom: Spacing.sp3,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border1,
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
  prepBadge: {
    marginTop: Spacing.sp2,
  },
  ctas: {
    paddingBottom: 24,
  },
});
