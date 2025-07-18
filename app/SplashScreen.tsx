import React, { useEffect } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

const CustomSplashScreen = () => {
  const router = useRouter();
  const [loaded, error] = useFonts({
    SpaceMono_18pt: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    console.log('SplashScreen: Fonts loaded:', loaded, 'Error:', error);
    if (loaded) {
      setTimeout(() => {
        SplashScreen.hideAsync();
        router.replace('/(root)/(tabs)'); 
      }, 2000); // 
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <View style={[styles.container, { backgroundColor: '#ffffff' }]} className="flex-1 justify-center items-center bg-white">
      <Image
        source={require('../assets/images/food-app-icon.png')}
        style={{ width: 200, height: 200, resizeMode: 'contain' }}
        onError={(e) => console.log('Image Error:', e.nativeEvent.error)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CustomSplashScreen;