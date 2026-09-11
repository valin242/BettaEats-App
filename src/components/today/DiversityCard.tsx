import { StyleSheet, Text, View } from 'react-native';

import { Colors, FontFamily, Radii, Spacing } from '@/constants/tokens';
import type { DiversityData } from '@/types';

export default function DiversityCard({ d }: { d: DiversityData }) {
  const pct = Math.round((d.count / d.goal) * 100);

  return (
    <View style={styles.card}>
      <View style={styles.top}>
        <View>
          <Text style={styles.count}>
            {d.count}<Text style={styles.goal}> / {d.goal} plants</Text>
          </Text>
        </View>
        <Text style={styles.weekLabel}>this week</Text>
      </View>

      <View style={styles.track}>
        <View style={[styles.fill, { width: `${pct}%` }]} />
      </View>

      <Text style={styles.caption}>
        People eating{' '}
        <Text style={styles.captionBold}>30+ different plants weekly</Text>
        {' '}have dramatically more diverse microbiomes (American Gut Project). New this week:{' '}
        <Text style={styles.captionBold}>{d.newThisWeek.join(', ')}</Text>.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.brandDark,
    borderRadius: 16,
    padding: Spacing.sp4,
  },
  top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  count: {
    fontFamily: FontFamily.display,
    fontSize: 32,
    fontWeight: '700',
    color: '#fff',
    lineHeight: 36,
  },
  goal: {
    fontSize: 15,
    color: Colors.fgOnDarkMuted,
    fontFamily: FontFamily.displayRegular,
    fontWeight: '400',
  },
  weekLabel: {
    fontSize: 11,
    fontFamily: FontFamily.ui,
    color: Colors.fgOnDarkMuted,
  },
  track: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: Radii.pill,
    marginTop: Spacing.sp3,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: '#90c9a4',
    borderRadius: Radii.pill,
  },
  caption: {
    fontSize: 11.5,
    fontFamily: FontFamily.ui,
    color: Colors.fgOnDarkMuted,
    marginTop: 10,
    lineHeight: 17,
  },
  captionBold: {
    color: '#fff',
    fontFamily: FontFamily.uiBold,
  },
});
