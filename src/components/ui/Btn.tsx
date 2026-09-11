import { StyleSheet, Text, TouchableOpacity, type ViewStyle } from 'react-native';

import { Colors, FontFamily, Radii, Spacing } from '@/constants/tokens';

interface Props {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md';
  full?: boolean;
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
}

export default function Btn({
  variant = 'primary',
  size = 'md',
  full,
  children,
  onPress,
  style,
}: Props) {
  return (
    <TouchableOpacity
      style={[
        styles.base,
        size === 'sm' && styles.sm,
        variant === 'primary' && styles.primary,
        variant === 'secondary' && styles.secondary,
        variant === 'ghost' && styles.ghost,
        full && styles.full,
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.label, size === 'sm' && styles.labelSm, variant !== 'primary' && styles.labelAlt]}>
        {children}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 44,
    paddingHorizontal: Spacing.sp5,
    borderRadius: Radii.btn,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: Spacing.sp2,
  },
  sm: {
    height: 32,
    paddingHorizontal: Spacing.sp3,
    borderRadius: 9,
  },
  primary: {
    backgroundColor: Colors.brand,
  },
  secondary: {
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: Colors.brandSoftBorder,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  full: {
    width: '100%',
  },
  label: {
    fontFamily: FontFamily.uiBold,
    fontSize: 14,
    color: '#fff',
  },
  labelSm: {
    fontSize: 12,
  },
  labelAlt: {
    color: Colors.brand,
  },
});
