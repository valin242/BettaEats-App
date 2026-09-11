import { StyleSheet, Text, View } from 'react-native';

import { Colors, FontFamily, Radii, Spacing } from '@/constants/tokens';

type Kind = 'info' | 'corr' | 'danger';

interface Props {
  kind?: Kind;
  children: React.ReactNode;
}

const STYLES: Record<Kind, { bg: string; border: string; fg: string; icon: string }> = {
  info: { bg: Colors.warnBg, border: Colors.warnBorder, fg: Colors.warnFg, icon: 'ℹ️' },
  corr: { bg: Colors.corrBg, border: Colors.corrBorder, fg: Colors.corrFg, icon: '📊' },
  danger: { bg: Colors.dangerBg, border: Colors.dangerBorder, fg: Colors.dangerFg, icon: '⚠️' },
};

export default function Disclaimer({ kind = 'info', children }: Props) {
  const s = STYLES[kind];
  return (
    <View style={[styles.container, { backgroundColor: s.bg, borderColor: s.border }]}>
      <Text style={styles.icon}>{s.icon}</Text>
      <Text style={[styles.text, { color: s.fg }]}>{children}</Text>
    </View>
  );
}

export function DisclaimerBold({ children }: { children: React.ReactNode }) {
  return <Text style={styles.bold}>{children}</Text>;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: Spacing.sp2,
    alignItems: 'flex-start',
    borderWidth: 1,
    borderRadius: Radii.cardSm,
    padding: Spacing.sp3,
    marginVertical: Spacing.sp2,
  },
  icon: {
    fontSize: 14,
    lineHeight: 18,
  },
  text: {
    flex: 1,
    fontSize: 11.5,
    fontFamily: FontFamily.ui,
    lineHeight: 17,
  },
  bold: {
    fontFamily: FontFamily.uiBold,
  },
});
