import { StyleSheet, Text, View } from 'react-native';

import { Colors, FontFamily, Radii, Spacing } from '@/constants/tokens';
import type { Meal } from '@/types';

export default function MealRow({ m }: { m: Meal }) {
  return (
    <View style={styles.row}>
      <Text style={styles.emoji}>{m.em}</Text>
      <View style={styles.content}>
        <Text style={styles.heading}>{m.h}</Text>
        <Text style={styles.sub}>{m.s}</Text>
      </View>
      <Text style={styles.time}>{m.time}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    backgroundColor: Colors.bgElev,
    borderRadius: Radii.card - 2,
    borderWidth: 1,
    borderColor: Colors.border2,
    padding: Spacing.sp3,
    marginBottom: Spacing.sp2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  emoji: {
    fontSize: 22,
    lineHeight: 26,
  },
  content: {
    flex: 1,
  },
  heading: {
    fontFamily: FontFamily.display,
    fontWeight: '700',
    fontSize: 13,
    color: Colors.fg1,
  },
  sub: {
    fontSize: 11,
    fontFamily: FontFamily.ui,
    color: Colors.fg4,
    marginTop: 2,
  },
  time: {
    fontSize: 10,
    fontFamily: FontFamily.mono,
    color: Colors.fg4,
  },
});
