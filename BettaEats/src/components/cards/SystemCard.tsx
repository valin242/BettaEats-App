import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import ClaimItem from '@/components/ClaimItem';
import Tag from '@/components/ui/Tag';
import { Colors, FontFamily, Radii, Shadows, Spacing } from '@/constants/tokens';
import { useAppContext } from '@/context/AppContext';
import { claimsForSystem, topFoodsForSystem } from '@/db';
import type { BodySystem } from '@/db/schema';

/** A body system, with one expandable row per condition it covers — the "what should I eat for X" view. */
export default function SystemCard({ system }: { system: BodySystem }) {
  const { isSaved, toggleSaved } = useAppContext();
  const [openRow, setOpenRow] = useState<string | null>(null);
  const { palette } = system;
  const rows = claimsForSystem(system.id);
  const saved = isSaved('system', system.id);

  return (
    <View style={[styles.card, Shadows.shadow1, { borderColor: palette.border }]}>
      <View style={[styles.head, { backgroundColor: palette.bg, borderBottomColor: palette.border }]}>
        <View style={styles.headTop}>
          <Text style={styles.emoji}>{system.emoji}</Text>
          <View style={styles.titleText}>
            <Text style={styles.name}>{system.name}</Text>
            <Text style={styles.subLabel}>Most-cited foods</Text>
          </View>
          <TouchableOpacity
            onPress={() => toggleSaved('system', system.id)}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel={saved ? `Remove ${system.name} from saved` : `Save ${system.name}`}
            accessibilityState={{ selected: saved }}
          >
            <Text style={[styles.save, { color: palette.accent }, !saved && styles.saveIdle]}>
              {saved ? '🔖 Saved' : 'Save'}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.tagsRow}>
          {topFoodsForSystem(system.id).map((name) => (
            <Tag key={name} label={name} bg={palette.bg} color={palette.accent} />
          ))}
        </View>
      </View>

      <View style={styles.rows}>
        {rows.map(({ indication, claims }) => {
          const open = openRow === indication.id;
          return (
            <View key={indication.id}>
              <TouchableOpacity
                style={[styles.rowHeader, open && { backgroundColor: palette.bg, borderColor: palette.border }]}
                onPress={() => setOpenRow(open ? null : indication.id)}
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityState={{ expanded: open }}
              >
                <Text style={styles.rowTitle}>{indication.name}</Text>
                <Text style={styles.rowCount}>{claims.length}</Text>
                <Text style={[styles.chev, open && styles.chevOpen]}>▾</Text>
              </TouchableOpacity>
              {open ? (
                <View style={[styles.panel, { borderColor: palette.border }]}>
                  {claims.map((claim, i) => (
                    <View key={claim.id} style={i > 0 && styles.divided}>
                      <ClaimItem claim={claim} accent={palette.accent} showFoods />
                    </View>
                  ))}
                </View>
              ) : null}
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.card,
    borderWidth: 1.5,
    overflow: 'hidden',
    marginBottom: 12,
  },
  head: {
    padding: Spacing.sp4,
    borderBottomWidth: 1,
  },
  headTop: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  emoji: {
    fontSize: 26,
    lineHeight: 32,
  },
  titleText: {
    flex: 1,
  },
  name: {
    fontFamily: FontFamily.display,
    fontSize: 16,
    color: Colors.fg1,
  },
  subLabel: {
    fontSize: 11,
    fontFamily: FontFamily.ui,
    color: Colors.fg4,
    marginTop: 3,
  },
  save: {
    fontFamily: FontFamily.uiBold,
    fontSize: 12,
  },
  saveIdle: {
    opacity: 0.75,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: Spacing.sp2,
  },
  rows: {
    padding: 10,
    gap: 4,
  },
  rowHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sp2,
    padding: Spacing.sp3,
    borderRadius: Radii.cardSm,
    backgroundColor: '#f8f8f6',
    borderWidth: 1,
    borderColor: Colors.border2,
  },
  rowTitle: {
    fontFamily: FontFamily.uiMedium,
    fontSize: 13,
    color: Colors.fg1,
    flex: 1,
  },
  rowCount: {
    fontFamily: FontFamily.uiBold,
    fontSize: 11,
    color: Colors.fg4,
  },
  chev: {
    fontSize: 13,
    color: '#aaa',
  },
  chevOpen: {
    transform: [{ rotate: '180deg' }],
  },
  panel: {
    padding: Spacing.sp3,
    backgroundColor: '#fafcfa',
    borderWidth: 1,
    borderTopWidth: 0,
    borderBottomLeftRadius: Radii.cardSm,
    borderBottomRightRadius: Radii.cardSm,
    gap: Spacing.sp3,
  },
  divided: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.border1,
    paddingTop: Spacing.sp3,
  },
});
