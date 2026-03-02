import { useAppStore } from '@/store/useAppStore';
import { Tabs } from 'expo-router';
import React from 'react';

import { Feather } from '@expo/vector-icons';

export default function TabLayout() {
  const isDarkMode = useAppStore(state => state.isDarkMode);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: isDarkMode ? '#FFFFFF' : '#AD6D71',
        tabBarInactiveTintColor: isDarkMode ? '#A0A0A0' : '#AA949C',
        headerShown: false,
        tabBarStyle: {
          backgroundColor: isDarkMode ? '#121212' : '#FFFFFF',
          borderTopColor: isDarkMode ? '#2A2A2A' : '#FCF3F5',
          height: 80,
          paddingTop: 10,
        },
        tabBarShowLabel: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Feather size={24} name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: 'Favorites',
          tabBarIcon: ({ color }) => <Feather size={24} name="heart" color={color} />,
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Cart',
          tabBarIcon: ({ color }) => <Feather size={24} name="shopping-bag" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <Feather size={24} name="user" color={color} />,
        }}
      />
    </Tabs>
  );
}
