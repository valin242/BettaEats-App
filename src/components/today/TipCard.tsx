import { StyleSheet, Text, View } from 'react-native';

import { Colors, FontFamily, Radii, Spacing } from '@/constants/tokens';
import type { TipData } from '@/types';

export default function TipCard({ tip }: { tip: TipData }) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.badge}>{tip.badge}</Text>
      </View>
      <Text style={styles.body}>{tip.text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.bgElev,
    borderRadius: Radii.card,
    borderWidth: 1,
    borderColor: Colors.border2,
    padding: Spacing.sp4,
  },
  header: {
    marginBottom: 6,
  },
  badge: {
    fontSize: 10,
    fontFamily: FontFamily.uiBold,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: Colors.brand,
  },
  body: {
    fontSize: 13,
    fontFamily: FontFamily.ui,
    color: Colors.fg2,
    lineHeight: 20,
  },
});
