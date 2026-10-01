import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProvider } from './src/context/AppContext';
import RootNavigator from './src/navigation/RootNavigator';
import { colors } from './src/theme/colors';

export default function App() {
  const app = (
    <SafeAreaProvider>
      <AppProvider>
        <StatusBar style="dark" />
        <RootNavigator />
      </AppProvider>
    </SafeAreaProvider>
  );
  if (Platform.OS !== 'web') return app;
  // 웹: 데스크톱 브라우저에서도 폰 화면 폭으로 가운데 정렬
  return (
    <View style={s.webBg}>
      <View style={s.webFrame}>{app}</View>
    </View>
  );
}

const s = StyleSheet.create({
  webBg: { flex: 1, alignItems: 'center', backgroundColor: '#ECE8F3' },
  webFrame: { flex: 1, width: '100%', maxWidth: 430, overflow: 'hidden', backgroundColor: colors.cream },
});
