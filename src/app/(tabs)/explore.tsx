import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import OrganCard from '@/components/cards/OrganCard';
import FoodCard from '@/components/cards/FoodCard';
import AppBar from '@/components/ui/AppBar';
import Disclaimer, { DisclaimerBold } from '@/components/ui/Disclaimer';
import Tag from '@/components/ui/Tag';
import { FOODS, ORGANS } from '@/constants/data';
import { Colors, FontFamily, Spacing } from '@/constants/tokens';
import type { Food } from '@/types';

const TABS = [
  { id: 'foods', emoji: '🥦', label: 'Foods', count: FOODS.length },
  { id: 'organs', emoji: '❤️', label: 'Organs', count: ORGANS.length },
  { id: 'diseases', emoji: '🎗️', label: 'Diseases', count: 6 },
];

export default function ExploreScreen() {
  const [tab, setTab] = useState('foods');
  const [search, setSearch] = useState('');

  const filteredFoods = useMemo(
    () =>
      FOODS.filter(
        (f) =>
          !search ||
          f.group.toLowerCase().includes(search.toLowerCase()) ||
          f.compounds.some((c) => c.toLowerCase().includes(search.toLowerCase()))
      ),
    [search]
  );

  const openFood = (food: Food) => router.push(`/food/${food.id}`);

  return (
    <View style={styles.container}>
      <AppBar
        eyebrow="EVIDENCE-BASED DIETARY HEALTH REFERENCE"
        title="Food as Medicine"
        sub="How foods, compounds, and prep affect your health"
        search={search}
        onSearchChange={setSearch}
        tabs={TABS}
        activeTab={tab}
        onTab={setTab}
      />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ marginTop: 4 }}>
          <Disclaimer kind="info">
            <DisclaimerBold>Educational reference only.</DisclaimerBold>
            {' '}Consult a healthcare provider before significant dietary changes, especially if managing a condition or taking medications.
          </Disclaimer>
        </View>

        <View style={styles.section}>
          {tab === 'foods' && (
            <>
              <Text style={styles.meta}>{filteredFoods.length} food groups — tap to expand</Text>
              {filteredFoods.map((f) => (
                <FoodCard key={f.id} food={f} onPress={openFood} />
              ))}
            </>
          )}

          {tab === 'organs' && (
            <>
              <Text style={styles.meta}>{ORGANS.length} organs & systems</Text>
              {ORGANS.map((o) => (
                <OrganCard key={o.id} organ={o} />
              ))}
            </>
          )}

          {tab === 'diseases' && (
            <>
              <View style={styles.legendRow}>
                <Tag label="🛡️ Prevention" bg="#e8f5ec" color="#2d7a4f" />
                <Tag label="⚕️ Alleviation" bg="#fef0e0" color="#b06010" />
                <Tag label="💊 Treatment" bg="#fdecea" color="#b02020" />
              </View>
              <Disclaimer kind="corr">
                <DisclaimerBold>Correlational evidence noted where applicable.</DisclaimerBold>
                {' '}Many disease–diet relationships come from observational studies; causation requires RCTs.
              </Disclaimer>
              <View style={{ height: 8 }} />
              {ORGANS.map((o) => (
                <OrganCard key={o.id} organ={o} />
              ))}
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingBottom: 100,
  },
  section: {
    paddingHorizontal: Spacing.sp4,
    paddingTop: Spacing.sp3,
  },
  meta: {
    fontSize: 12,
    fontFamily: FontFamily.display,
    color: Colors.fg4,
    textAlign: 'center',
    marginBottom: 10,
  },
  legendRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 10,
  },
});
