import { StyleSheet, Text } from 'react-native';

import { FontFamily } from '@/constants/tokens';

interface Props {
  label: string;
  bg?: string;
  color?: string;
}

export default function Tag({ label, bg = '#e8f0e8', color = '#2d5a2d' }: Props) {
  return (
    <Text style={[styles.tag, { backgroundColor: bg, color }]}>
      {label}
    </Text>
  );
}

const styles = StyleSheet.create({
  tag: {
    paddingHorizontal: 9,
    paddingVertical: 2,
    borderRadius: 20,
    fontSize: 11,
    fontFamily: FontFamily.uiMedium,
    overflow: 'hidden',
    marginRight: 4,
    marginBottom: 4,
    lineHeight: 18,
  },
});
