import { StyleSheet, Text, View } from 'react-native';

import { EvidenceColors, FontFamily } from '@/constants/tokens';
import { EVIDENCE_LABELS, UNVERIFIED_LABEL, type EvidenceLevel } from '@/db/vocab';

interface Props {
  /** Omit for an unverified claim, which has no grade. */
  level?: EvidenceLevel;
  /** Replaces the label, e.g. "2 of 7 cited" on a summary. Colours still follow `level`. */
  label?: string;
}

export default function EvidenceBadge({ level, label }: Props) {
  const c = EvidenceColors[level ?? 'unverified'];
  const text = label ?? (level ? EVIDENCE_LABELS[level] : UNVERIFIED_LABEL);
  return (
    <View
      style={[styles.badge, { backgroundColor: c.bg, borderColor: c.border }, !level && styles.pending]}
      accessibilityLabel={`Evidence: ${text}`}
    >
      <Text style={[styles.text, { color: c.fg }]}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 1,
  },
  pending: {
    borderStyle: 'dashed',
  },
  text: {
    fontFamily: FontFamily.uiBold,
    fontSize: 10.5,
    lineHeight: 16,
  },
});
