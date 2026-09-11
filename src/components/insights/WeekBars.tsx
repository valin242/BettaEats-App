import { StyleSheet, Text, View } from 'react-native';

import { Colors, FontFamily, Radii } from '@/constants/tokens';
import type { WeekDay } from '@/types';

interface Props {
  week: WeekDay[];
  max: number;
}

export default function WeekBars({ week, max }: Props) {
  return (
    <View style={styles.container}>
      {week.map((d, i) => (
        <View key={i} style={styles.col}>
          <View style={styles.barWrap}>
            <View style={[styles.barFill, { height: `${Math.round((d.groups / max) * 100)}%` }]} />
          </View>
          <Text style={[styles.dayLabel, d.today && styles.dayLabelToday]}>{d.d}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'flex-end',
    height: 84,
  },
  col: {
    flex: 1,
    alignItems: 'center',
    gap: 5,
    height: '100%',
    justifyContent: 'flex-end',
  },
  barWrap: {
    width: '100%',
    maxWidth: 26,
    flex: 1,
    backgroundColor: Colors.brandSoft,
    borderRadius: Radii.cardSm,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  barFill: {
    width: '100%',
    backgroundColor: Colors.brand,
    borderRadius: Radii.cardSm,
  },
  dayLabel: {
    fontSize: 10,
    fontFamily: FontFamily.uiMedium,
    color: Colors.fg4,
  },
  dayLabelToday: {
    color: Colors.brand,
    fontFamily: FontFamily.uiBold,
  },
});
