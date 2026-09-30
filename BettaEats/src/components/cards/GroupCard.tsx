import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import EvidenceBadge from '@/components/ui/EvidenceBadge';
import Tag from '@/components/ui/Tag';
import { Colors, FontFamily, Radii, Shadows, Spacing } from '@/constants/tokens';
import { claimsForGroup, foodsInGroup, indicationsOf, verifiedCount } from '@/db';
import type { FoodGroup } from '@/db/schema';

interface Props {
  group: FoodGroup;
  onPress: (group: FoodGroup) => void;
}

/** A food group in a list. Its chips are the indications its claims address, so every one is backed by a claim. */
export default function GroupCard({ group, onPress }: Props) {
  const { palette } = group;
  const foods = foodsInGroup(group.id).map((f) => f.name).join(', ');
  const claims = claimsForGroup(group.id);
  const indications = indicationsOf(claims).slice(0, 3);
  const verified = verifiedCount(claims);

  return (
    <TouchableOpacity
      style={[styles.card, Shadows.shadow1, { borderColor: palette.border }]}
      onPress={() => onPress(group)}
      activeOpacity={0.9}
      accessibilityRole="button"
      accessibilityLabel={`${group.name}. ${foods}`}
      accessibilityHint="Opens the full entry"
    >
      <View style={[styles.head, { backgroundColor: palette.bg }]}>
        <View style={styles.headTop}>
          <View style={styles.titleRow}>
            <Text style={styles.emoji}>{group.emoji}</Text>
            <View style={styles.titleText}>
              <Text style={styles.name}>{group.name}</Text>
              <Text style={styles.items} numberOfLines={1}>
                {foods}
              </Text>
            </View>
          </View>
          <Text style={styles.chev}>›</Text>
        </View>
        <View style={styles.tagsRow}>
          {indications.map((i) => (
            <Tag key={i.id} label={i.name} bg={palette.bg} color={palette.accent} />
          ))}
        </View>
        <View style={styles.footer}>
          <Text style={styles.count}>
            {claims.length} claim{claims.length === 1 ? '' : 's'}
          </Text>
          <EvidenceBadge label={verified === 0 ? undefined : `${verified} of ${claims.length} cited`} />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.card,
    borderWidth: 1.5,
    overflow: 'hidden',
    marginBottom: 10,
  },
  head: {
    padding: Spacing.sp4,
  },
  headTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  emoji: {
    fontSize: 24,
    lineHeight: 28,
  },
  titleText: {
    flex: 1,
  },
  name: {
    fontFamily: FontFamily.display,
    fontSize: 15,
    color: Colors.fg1,
    lineHeight: 20,
  },
  items: {
    fontSize: 11,
    fontFamily: FontFamily.ui,
    color: Colors.fg4,
    marginTop: 2,
  },
  chev: {
    color: '#aaa',
    fontSize: 14,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sp2,
    marginTop: 4,
  },
  count: {
    fontSize: 11,
    fontFamily: FontFamily.ui,
    color: Colors.fg4,
  },
});
