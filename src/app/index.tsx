import { Redirect } from 'expo-router';
import { View } from 'react-native';

import { useAppContext } from '@/context/AppContext';

export default function IndexRedirect() {
  const { state } = useAppContext();

  // Wait for AsyncStorage hydration before redirecting
  if (!state.hydrated) {
    return <View style={{ flex: 1, backgroundColor: '#ffffff' }} />;
  }

  if (!state.hasOnboarded) {
    return <Redirect href="/onboarding" />;
  }

  return <Redirect href="/(tabs)" />;
}
