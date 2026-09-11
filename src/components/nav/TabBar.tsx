import type { BottomTabBarProps } from 'expo-router/build/react-navigation/bottom-tabs';
import { GlassView } from 'expo-glass-effect';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors, FontFamily, Spacing } from '@/constants/tokens';

const TABS = [
  { name: 'index', label: 'Today' },
  { name: 'explore', label: 'Foods' },
  { name: 'insights', label: 'Insights' },
  { name: 'profile', label: 'Profile' },
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
      {/* Left two tabs */}
      {TABS.slice(0, 2).map((tab) => {
        const active = currentRoute === tab.name;
        return (
          <TouchableOpacity
            key={tab.name}
            style={styles.item}
            onPress={() => goTo(tab.name)}
            activeOpacity={0.7}
          >
            <Text style={[styles.label, active && styles.labelActive]}>{tab.label}</Text>
            <View style={[styles.dot, active && styles.dotActive]} />
          </TouchableOpacity>
        );
      })}

      {/* Center Log pill */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          router.push('/log');
        }}
        activeOpacity={0.8}
      >
        <Text style={styles.fabLabel}>+ Log</Text>
      </TouchableOpacity>

      {/* Right two tabs */}
      {TABS.slice(2).map((tab) => {
        const active = currentRoute === tab.name;
        return (
          <TouchableOpacity
            key={tab.name}
            style={styles.item}
            onPress={() => goTo(tab.name)}
            activeOpacity={0.7}
          >
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
    height: 44,
    gap: 4,
  },
  label: {
    fontFamily: FontFamily.ui,
    fontSize: 12,
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
  fab: {
    height: 44,
    paddingHorizontal: 18,
    borderRadius: 9999,
    backgroundColor: Colors.brand,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 6,
  },
  fabLabel: {
    fontFamily: FontFamily.uiBold,
    fontSize: 13,
    color: '#fff',
  },
});
