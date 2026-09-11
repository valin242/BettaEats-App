import { StyleSheet, Text, View } from 'react-native';

import { Colors, FontFamily, Radii, Spacing } from '@/constants/tokens';
import type { ProtectionRingData } from '@/types';

export default function ProtectionRing({ r }: { r: ProtectionRingData }) {
  return (
    <View style={[styles.ring, { borderColor: Colors.border1 }]}>
      <Text style={styles.emoji}>{r.em}</Text>
      <Text style={styles.name}>{r.nm}</Text>
      <Text style={[styles.pct, { color: r.ac }]}>{r.pct}%</Text>
      <View style={[styles.track, { backgroundColor: r.hb }]}>
        <View style={[styles.fill, { width: `${r.pct}%`, backgroundColor: r.ac }]} />
      </View>
      <Text style={styles.lbl}>{r.lbl}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  ring: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.card,
    borderWidth: 1,
    padding: Spacing.sp3,
    minWidth: 132,
    marginRight: Spacing.sp3,
  },
  emoji: {
    fontSize: 22,
    lineHeight: 26,
  },
  name: {
    fontFamily: FontFamily.display,
    fontSize: 13,
    fontWeight: '700',
    color: Colors.fg1,
    marginTop: 2,
  },
  pct: {
    fontSize: 22,
    fontFamily: FontFamily.display,
    fontWeight: '700',
    lineHeight: 26,
    marginTop: 2,
  },
  track: {
    height: 4,
    borderRadius: 2,
    marginTop: 6,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 2,
  },
  lbl: {
    fontSize: 10,
    fontFamily: FontFamily.ui,
    color: Colors.fg4,
    marginTop: 4,
  },
});
