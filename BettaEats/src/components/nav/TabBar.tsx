import { GlassView } from 'expo-glass-effect';
import * as Haptics from 'expo-haptics';
import type { BottomTabBarProps } from 'expo-router/build/react-navigation/bottom-tabs';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors, FontFamily, Spacing } from '@/constants/tokens';

const TABS = [
  { name: 'index', label: 'Search', emoji: '🔍' },
  { name: 'browse', label: 'Browse', emoji: '🥦' },
  { name: 'saved', label: 'Saved', emoji: '🔖' },
  { name: 'about', label: 'About', emoji: 'ℹ️' },
] as const;

export default function TabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const bottomPad = Math.max(insets.bottom, 16);

  const currentRoute = state.routes[state.index]?.name;

  const goTo = (name: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const event = navigation.emit({ type: 'tabPress', target: name, canPreventDefault: true });
    if (!event.defaultPrevented) {
      navigation.navigate({ name, merge: true } as never);
    }
  };

  return (
    <GlassView style={[styles.container, { paddingBottom: bottomPad }]}>
      {TABS.map((tab) => {
        const active = currentRoute === tab.name;
        return (
          <TouchableOpacity
            key={tab.name}
            style={styles.item}
            onPress={() => goTo(tab.name)}
            activeOpacity={0.7}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            accessibilityLabel={tab.label}
          >
            <Text style={[styles.emoji, !active && styles.emojiInactive]}>{tab.emoji}</Text>
            <Text style={[styles.label, active && styles.labelActive]}>{tab.label}</Text>
            <View style={[styles.dot, active && styles.dotActive]} />
          </TouchableOpacity>
        );
      })}
    </GlassView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Spacing.sp2,
    paddingHorizontal: Spacing.sp2,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.border2,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    gap: 2,
  },
  emoji: {
    fontSize: 17,
    lineHeight: 21,
  },
  emojiInactive: {
    opacity: 0.55,
  },
  label: {
    fontFamily: FontFamily.ui,
    fontSize: 11,
    color: Colors.fg4,
  },
  labelActive: {
    fontFamily: FontFamily.uiBold,
    color: Colors.brand,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'transparent',
  },
  dotActive: {
    backgroundColor: Colors.brand,
  },
});
