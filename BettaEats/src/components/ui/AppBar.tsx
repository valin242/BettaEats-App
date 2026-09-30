import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors, FontFamily, Shadows, Spacing } from '@/constants/tokens';

interface Tab {
  id: string;
  emoji: string;
  label: string;
  count: number;
}

interface Props {
  eyebrow?: string;
  title: string;
  sub?: string;
  search?: string;
  onSearchChange?: (v: string) => void;
  tabs?: Tab[];
  activeTab?: string;
  onTab?: (id: string) => void;
  backLabel?: string;
  onBack?: () => void;
}

export default function AppBar({
  eyebrow,
  title,
  sub,
  search,
  onSearchChange,
  tabs,
  activeTab,
  onTab,
  backLabel,
  onBack,
}: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + Spacing.sp3 }, Shadows.shadowHeader]}>
      {onBack && (
        <TouchableOpacity onPress={onBack} activeOpacity={0.7} style={styles.backBtn}>
          <Text style={styles.backText}>← {backLabel ?? 'Back'}</Text>
        </TouchableOpacity>
      )}
      {!onBack && (
        <View style={styles.titleBlock}>
          {eyebrow ? (
            <Text style={styles.eyebrow}>{eyebrow}</Text>
          ) : null}
          <Text style={styles.title}>{title}</Text>
          {sub ? <Text style={styles.sub}>{sub}</Text> : null}
        </View>
      )}
      {onSearchChange !== undefined && (
        <View style={styles.searchWrap}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            value={search}
            onChangeText={onSearchChange}
            placeholder="Search foods, compounds, systems…"
            placeholderTextColor={Colors.fg4}
          />
        </View>
      )}
      {tabs && onTab && (
        <View style={styles.tabsRow}>
          {tabs.map((t) => (
            <TouchableOpacity
              key={t.id}
              style={[styles.tab, activeTab === t.id && styles.tabActive]}
              onPress={() => onTab(t.id)}
              activeOpacity={0.7}
            >
              <Text style={styles.tabEmoji}>{t.emoji}</Text>
              <Text style={[styles.tabLabel, activeTab === t.id && styles.tabLabelActive]}>
                {t.label}
              </Text>
              <View style={[styles.tabCount, activeTab === t.id && styles.tabCountActive]}>
                <Text style={[styles.tabCountText, activeTab === t.id && styles.tabCountTextActive]}>
                  {t.count}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}
      <View style={styles.bottomBorder} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.bg,
    paddingHorizontal: Spacing.sp4,
    paddingBottom: 0,
    zIndex: 10,
  },
  bottomBorder: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.border2,
    marginTop: Spacing.sp3,
  },
  titleBlock: {
    alignItems: 'center',
    paddingBottom: Spacing.sp2,
  },
  eyebrow: {
    fontFamily: FontFamily.uiBold,
    fontSize: 10,
    letterSpacing: 2.5,
    textTransform: 'uppercase',
    color: Colors.brand,
    marginBottom: 4,
  },
  title: {
    fontFamily: FontFamily.display,
    fontSize: 22,
    color: Colors.fg1,
    lineHeight: 28,
  },
  sub: {
    fontFamily: FontFamily.ui,
    fontSize: 12,
    color: Colors.fg4,
    marginTop: 2,
    textAlign: 'center',
  },
  backBtn: {
    paddingVertical: Spacing.sp1,
    paddingBottom: Spacing.sp2,
  },
  backText: {
    fontFamily: FontFamily.uiBold,
    fontSize: 14,
    color: Colors.brand,
  },
  searchWrap: {
    position: 'relative',
    marginTop: Spacing.sp3,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchIcon: {
    position: 'absolute',
    left: 12,
    fontSize: 14,
    zIndex: 1,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    paddingLeft: 34,
    paddingRight: 14,
    borderRadius: 30,
    backgroundColor: Colors.bgElev,
    borderWidth: 1.5,
    borderColor: Colors.border1,
    color: Colors.fg1,
    fontSize: 13,
    fontFamily: FontFamily.ui,
  },
  tabsRow: {
    flexDirection: 'row',
    gap: 2,
    marginTop: Spacing.sp3,
    backgroundColor: Colors.bgElev,
    borderRadius: 9999,
    padding: 3,
    borderWidth: 1,
    borderColor: Colors.border2,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 9999,
  },
  tabActive: {
    backgroundColor: Colors.bg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tabEmoji: {
    fontSize: 12,
  },
  tabLabel: {
    fontFamily: FontFamily.ui,
    fontSize: 12,
    color: Colors.fg3,
  },
  tabLabelActive: {
    fontFamily: FontFamily.uiBold,
    color: Colors.brand,
  },
  tabCount: {
    backgroundColor: 'rgba(45,122,79,0.08)',
    borderRadius: 10,
    paddingHorizontal: 7,
    paddingVertical: 1,
  },
  tabCountActive: {
    backgroundColor: Colors.brand,
  },
  tabCountText: {
    fontSize: 10,
    fontFamily: FontFamily.uiBold,
    color: Colors.fg4,
  },
  tabCountTextActive: {
    color: '#fff',
  },
});
