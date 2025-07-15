import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, Image } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            //position: 'absolute',
          },
          default: {},
        }),
      }}>

      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ focused }) => (
            <Image
              source={
                focused
                  ? require("@/assets/icons/home-active.png")
                  : require("@/assets/icons/home-inactive.png")
              }
              style={{ width: 30, height: 30 }}
              resizeMode="contain"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Browse",
          tabBarIcon: ({ focused }) => (
            <Image
              source={
                focused
                  ? require("@/assets/icons/search-active.png")
                  : require("@/assets/icons/search-inactive.png")
              }
              style={{ width: 30, height: 30 }}
              resizeMode="contain"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Setting",
          tabBarIcon: ({ focused }) => (
            <Image
              source={
                focused
                  ? require("@/assets/icons/setting-active.png")
                  : require("@/assets/icons/setting-inactive.png")
              }
              style={{ width: 30, height: 30 }}
              resizeMode="contain"
            />
          ),
        }}
      />
    </Tabs>
  );
}
