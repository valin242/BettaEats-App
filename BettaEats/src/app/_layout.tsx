import {
  DMSans_300Light,
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_700Bold,
} from '@expo-google-fonts/dm-sans';
import {
  Lora_400Regular,
  Lora_400Regular_Italic,
  Lora_700Bold,
} from '@expo-google-fonts/lora';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AppContextProvider } from '@/context/AppContext';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Lora_400Regular,
    Lora_400Regular_Italic,
    Lora_700Bold,
    DMSans_300Light,
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <SafeAreaProvider>
      <AppContextProvider>
        {/* The palette is light-only, so pin dark glyphs rather than letting
            "automatic" hand us light text on a white app bar. */}
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="onboarding" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen
            name="group/[id]"
            options={{ presentation: 'card', animation: 'slide_from_right' }}
          />
        </Stack>
      </AppContextProvider>
    </SafeAreaProvider>
  );
}
