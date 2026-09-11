import { StyleSheet, Text, View } from 'react-native';

import { Colors, FontFamily, Spacing } from '@/constants/tokens';

export default function StreakChip({ days }: { days: number }) {
  return (
    <View style={styles.chip}>
      <Text style={styles.label}>● {days}-day streak</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.brandSoft,
    borderRadius: 9999,
    paddingHorizontal: Spacing.sp3,
    paddingVertical: 4,
  },
  label: {
    fontFamily: FontFamily.uiBold,
    fontSize: 12,
    color: Colors.brand,
  },
});
