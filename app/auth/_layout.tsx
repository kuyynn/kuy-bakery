import React from 'react';
import { SafeAreaView } from 'react-native';
import { Slot } from 'expo-router';

export default function AuthLayout() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Slot />
    </SafeAreaView>
  );
}
