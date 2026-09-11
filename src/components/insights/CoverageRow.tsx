import { StyleSheet, Text, View } from 'react-native';

import { Colors, FontFamily, Radii } from '@/constants/tokens';
import type { CoverageData } from '@/types';

export default function CoverageRow({ c }: { c: CoverageData }) {
  return (
    <View style={styles.row}>
      <Text style={styles.name}>{c.nm}</Text>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${c.pct}%` }]} />
      </View>
      <Text style={styles.value}>{c.pct}%</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 7,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border2,
  },
  name: {
    fontFamily: FontFamily.uiMedium,
    fontSize: 13,
    color: Colors.fg1,
    width: 110,
  },
  track: {
    flex: 1,
    height: 6,
    backgroundColor: Colors.bgElev,
    borderRadius: Radii.pill,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: Colors.brand,
    borderRadius: Radii.pill,
  },
  value: {
    fontSize: 11,
    fontFamily: FontFamily.mono,
    color: Colors.fg4,
    width: 34,
    textAlign: 'right',
  },
});
