import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import Tag from '@/components/ui/Tag';
import { Colors, FontFamily, Radii, Shadows, Spacing } from '@/constants/tokens';
import type { Organ } from '@/types';

interface Props {
  organ: Organ;
}

export default function OrganCard({ organ }: Props) {
  const [openRow, setOpenRow] = useState<number>(-1);

  return (
    <View style={[styles.card, Shadows.shadow1, { borderColor: organ.bd }]}>
      <View style={[styles.head, { backgroundColor: organ.hb, borderBottomColor: organ.bd }]}>
        <View style={styles.headTop}>
          <Text style={styles.emoji}>{organ.emoji}</Text>
          <View>
            <Text style={styles.name}>{organ.name}</Text>
            <Text style={styles.subLabel}>Top protective foods</Text>
          </View>
        </View>
        <View style={styles.tagsRow}>
          {organ.topFoods.map((f) => (
            <Tag key={f} label={f} bg={organ.hb} color={organ.ac} />
          ))}
        </View>
      </View>

      <View style={styles.rows}>
        {organ.cards.map((card, i) => (
          <View key={i} style={styles.rowWrap}>
            <TouchableOpacity
              style={[
                styles.rowHeader,
                openRow === i && { backgroundColor: organ.hb, borderColor: organ.bd },
              ]}
              onPress={() => setOpenRow(openRow === i ? -1 : i)}
              activeOpacity={0.7}
            >
              <Text style={styles.rowTitle}>{card.title}</Text>
              <Text style={{ fontSize: 13, color: '#aaa', transform: [{ rotate: openRow === i ? '180deg' : '0deg' }] }}>▾</Text>
            </TouchableOpacity>
            {openRow === i && (
              <View style={[styles.panel, { borderColor: organ.bd }]}>
                <Text style={styles.panelBody}>{card.body}</Text>
                <Text style={[styles.panelKey, { color: organ.ac }]}>
                  🥗 Key foods: <Text style={styles.panelKeyDetail}>{card.foods}</Text>
                </Text>
              </View>
            )}
          </View>
        ))}
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
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: Spacing.sp2,
  },
  rows: {
    padding: 10,
    gap: 2,
  },
  rowWrap: {
    marginBottom: 2,
  },
  rowHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  panel: {
    padding: Spacing.sp3,
    backgroundColor: '#fafcfa',
    borderWidth: 1,
    borderTopWidth: 0,
    borderRadius: 0,
    borderBottomLeftRadius: Radii.cardSm,
    borderBottomRightRadius: Radii.cardSm,
  },
  panelBody: {
    fontSize: 12.5,
    fontFamily: FontFamily.ui,
    color: '#2a3a2a',
    lineHeight: 19,
    marginBottom: 6,
  },
  panelKey: {
    fontSize: 11,
    fontFamily: FontFamily.uiBold,
  },
  panelKeyDetail: {
    fontFamily: FontFamily.ui,
    color: Colors.fg3,
  },
});
