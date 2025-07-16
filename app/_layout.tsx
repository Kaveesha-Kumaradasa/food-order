import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect } from 'react';
import { StatusBar } from 'react-native'; // Use react-native StatusBar
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import '../global.css';
import { Provider } from 'react-redux';
import { useColorScheme } from '@/hooks/useColorScheme';
import store from '@/redux/store';
import { AuthProvider } from '@/providers/AuthProvider';
import { MenuProvider } from '@/providers/menuProvider';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono_18pt: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <Provider store={store}>
      <AuthProvider>
        <MenuProvider>
          <SafeAreaProvider>
            <GestureHandlerRootView style={{ flex: 1 }}>
              <SafeAreaView style={{ flex: 1 }}>
                <StatusBar
                  barStyle={colorScheme === 'dark' ? 'dark-content' : 'light-content'}
                  backgroundColor="#FFFFFF" // Match white tab bar
                  translucent={false} // Opaque status bar
                />
                <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
                  <Stack
                    screenOptions={{
                      headerShown: false,
                      gestureEnabled: false,
                    }}
                  />
                </ThemeProvider>
              </SafeAreaView>
            </GestureHandlerRootView>
          </SafeAreaProvider>
        </MenuProvider>
      </AuthProvider>
    </Provider>
  );
}