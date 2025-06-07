import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import App  from "./index";
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <App />
  );
}
