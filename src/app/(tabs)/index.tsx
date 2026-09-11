import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import FoodCard from '@/components/cards/FoodCard';
import DiversityCard from '@/components/today/DiversityCard';
import MealRow from '@/components/today/MealRow';
import ProtectionRing from '@/components/today/ProtectionRing';
import StreakChip from '@/components/today/StreakChip';
import TipCard from '@/components/today/TipCard';
import AppBar from '@/components/ui/AppBar';
import Btn from '@/components/ui/Btn';
import Disclaimer, { DisclaimerBold } from '@/components/ui/Disclaimer';
import { FOODS, TODAY } from '@/constants/data';
import { Colors, FontFamily, Spacing } from '@/constants/tokens';
import { useAppContext } from '@/context/AppContext';
import type { Food } from '@/types';

export default function TodayScreen() {
  const { state } = useAppContext();
  const streak = state.streak || TODAY.streak;
  const allMeals = [...state.meals, ...TODAY.meals].slice(0, 6);

  const openFood = (food: Food) => router.push(`/food/${food.id}`);

  const leafy = FOODS.find((f) => f.id === 'leafy')!;

  return (
    <View style={styles.container}>
      <AppBar
        eyebrow="Tuesday · June 17"
        title="Today's protection"
        sub={`${TODAY.pct}% of daily groups covered`}
      />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Streak + date */}
        <View style={[styles.row, styles.section]}>
          <StreakChip days={streak} />
          <Text style={styles.dateHint}>Logged every day since April 16</Text>
        </View>

        {/* Plant diversity */}
        <View style={styles.section}>
          <DiversityCard d={TODAY.diversity} />
        </View>

        {/* Food group rings */}
        <View style={styles.section}>
          <Text style={styles.h2}>Food group rings</Text>
          <Text style={styles.meta}>Hit each group at least once daily for full protection coverage.</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.ringsScroll}>
            {TODAY.rings.map((r) => (
              <ProtectionRing key={r.id} r={r} />
            ))}
          </ScrollView>
        </View>

        {/* Daily tip */}
        <View style={styles.section}>
          <TipCard tip={TODAY.tip} />
        </View>

        {/* Logged meals */}
        <View style={styles.section}>
          <Text style={styles.h2}>Logged meals</Text>
          <Text style={styles.meta}>{allMeals.length} meals · 14 distinct compounds</Text>
          {allMeals.map((m) => (
            <MealRow key={m.id} m={m} />
          ))}
          <Btn variant="secondary" full onPress={() => router.push('/log')}>
            + Log another meal
          </Btn>
        </View>

        {/* Suggested next */}
        <View style={styles.section}>
          <Text style={styles.h2}>Suggested next</Text>
          <Text style={styles.meta}>
            You're missing{' '}
            <Text style={{ color: Colors.brand, fontFamily: FontFamily.uiBold }}>legumes</Text>
            {' '}today — high-fiber, butyrate-feeding.
          </Text>
          <FoodCard food={leafy} onPress={openFood} />
        </View>

        {/* Disclaimer */}
        <View style={[styles.section, { paddingBottom: Spacing.sp4 }]}>
          <Disclaimer kind="info">
            <DisclaimerBold>Educational reference only.</DisclaimerBold>
            {' '}Information is based on peer-reviewed research but should not replace medical advice.
          </Disclaimer>
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
    paddingTop: Spacing.sp4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateHint: {
    fontSize: 11,
    fontFamily: FontFamily.ui,
    color: Colors.fg4,
  },
  h2: {
    fontFamily: FontFamily.display,
    fontSize: 18,
    color: Colors.fg1,
    marginBottom: Spacing.sp2,
  },
  meta: {
    fontSize: 12,
    fontFamily: FontFamily.ui,
    color: Colors.fg4,
    marginBottom: 10,
  },
  ringsScroll: {
    marginTop: 4,
  },
});
