import { Tabs } from 'expo-router';

import TabBar from '@/components/nav/TabBar';

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="browse" />
      <Tabs.Screen name="saved" />
      <Tabs.Screen name="about" />
    </Tabs>
  );
}
