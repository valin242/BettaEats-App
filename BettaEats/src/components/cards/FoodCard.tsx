import { useRef, useState } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import Tag from '@/components/ui/Tag';
import { Colors, FontFamily, Radii, Shadows, Spacing } from '@/constants/tokens';
import type { Food } from '@/types';

interface Props {
  food: Food;
  defaultOpen?: boolean;
  onPress?: (food: Food) => void;
}

export default function FoodCard({ food, defaultOpen = false, onPress }: Props) {
  // A card either navigates to the detail screen or expands in place — never both.
  const navigates = onPress !== undefined;
  const [open, setOpen] = useState(defaultOpen);
  const chevronAnim = useRef(new Animated.Value(defaultOpen ? 1 : 0)).current;

  const handlePress = () => {
    if (navigates) {
      onPress(food);
      return;
    }
    const next = !open;
    setOpen(next);
    Animated.timing(chevronAnim, {
      toValue: next ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const chevronRotate = chevronAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  return (
    <TouchableOpacity
      style={[styles.card, open ? Shadows.shadow3 : Shadows.shadow1, { borderColor: food.bd }]}
      onPress={handlePress}
      activeOpacity={0.9}
      accessibilityRole="button"
      accessibilityLabel={`${food.group}. ${food.items}`}
      accessibilityHint={navigates ? 'Opens the full entry' : undefined}
      accessibilityState={navigates ? undefined : { expanded: open }}
    >
      {/* Card head */}
      <View style={[styles.head, { backgroundColor: food.hb }]}>
        <View style={styles.headTop}>
          <View style={styles.titleRow}>
            <Text style={styles.emoji}>{food.emoji}</Text>
            <View style={styles.titleText}>
              <Text style={styles.name}>{food.group}</Text>
              <Text style={styles.items} numberOfLines={1}>{food.items}</Text>
            </View>
          </View>
          {navigates ? (
            <Text style={styles.chev}>›</Text>
          ) : (
            <Animated.Text style={[styles.chev, { transform: [{ rotate: chevronRotate }] }]}>
              ▾
            </Animated.Text>
          )}
        </View>
        <View style={styles.tagsRow}>
          {food.tags.map((t) => (
            <Tag key={t} label={t} bg={food.hb} color={food.ac} />
          ))}
          <Tag label={food.evidence.split('–')[0]} bg="#e8f5ec" color="#2d7a4f" />
        </View>
      </View>

      {/* Expanded body */}
      {open && (
        <View style={styles.body}>
          <Text style={styles.sectionLabel}>Key compounds</Text>
          <View style={styles.tagsRow}>
            {food.compounds.map((c) => (
              <Tag key={c} label={c} bg="#f0f4f0" color="#3d5a3e" />
            ))}
          </View>
          <Text style={[styles.sectionLabel, { marginTop: Spacing.sp3 }]}>Evidence-based benefits</Text>
          {food.benefits.map((b, i) => (
            <Text key={i} style={styles.benefit}>• {b}</Text>
          ))}
          <View style={[styles.prep, { backgroundColor: food.hb, borderLeftColor: food.ac }]}>
            <Text style={[styles.prepHead, { color: food.ac }]}>👨‍🍳 Best preparation</Text>
            <Text style={styles.prepBody}>{food.prep}</Text>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.card,
    borderWidth: 1.5,
    overflow: 'hidden',
    marginBottom: 10,
  },
  head: {
    padding: Spacing.sp4,
  },
  headTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  emoji: {
    fontSize: 24,
    lineHeight: 28,
  },
  titleText: {
    flex: 1,
  },
  name: {
    fontFamily: FontFamily.display,
    fontSize: 15,
    color: Colors.fg1,
    lineHeight: 20,
  },
  items: {
    fontSize: 11,
    fontFamily: FontFamily.ui,
    color: Colors.fg4,
    marginTop: 2,
  },
  chev: {
    color: '#aaa',
    fontSize: 14,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  body: {
    padding: Spacing.sp4,
  },
  sectionLabel: {
    fontSize: 10,
    fontFamily: FontFamily.uiBold,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: Colors.fg4,
    marginBottom: 6,
  },
  benefit: {
    fontSize: 12.5,
    fontFamily: FontFamily.ui,
    color: '#2a3a2a',
    lineHeight: 19,
    marginBottom: 4,
  },
  prep: {
    borderRadius: Radii.cardSm,
    padding: Spacing.sp3,
    borderLeftWidth: 3,
    marginTop: 10,
  },
  prepHead: {
    fontSize: 10,
    fontFamily: FontFamily.uiBold,
    marginBottom: 3,
  },
  prepBody: {
    fontSize: 12,
    fontFamily: FontFamily.ui,
    color: '#3a4a3a',
    lineHeight: 18,
  },
});
