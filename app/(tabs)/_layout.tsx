import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
      }}>
        
      <Tabs.Screen
        name="add_plants"
        options={{
          title: 'Add Plants',
          tabBarIcon: ({ color }) => (
            <IconSymbol name="leaf" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="list_plantsPage"
        options={{
          title: 'My Plants',
          tabBarIcon: ({ color }) => (
            <IconSymbol name="leaf" size={24} color={color} />
          ),
        }}
      />
    </Tabs>  
  );
}
