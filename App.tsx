import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts, Hahmlet_600SemiBold } from '@expo-google-fonts/hahmlet';
import { AppProvider } from './src/context/AppContext';
import { PremiumProvider } from './src/context/PremiumContext';
import RootNavigator from './src/navigation/RootNavigator';
import { colors, isDark } from './src/theme/colors';
import { fonts } from './src/theme/typography';

// 웹: 굵기별 웹폰트를 불러오고, 글꼴을 따로 지정하지 않은 글자는 IBM Plex Sans KR로
if (Platform.OS === 'web' && typeof document !== 'undefined' && !document.getElementById('onulna-fonts')) {
  const link = document.createElement('link');
  link.id = 'onulna-fonts';
  link.rel = 'stylesheet';
  link.href = 'https://fonts.googleapis.com/css2?family=Hahmlet:wght@400;500;600;700&family=IBM+Plex+Sans+KR:wght@400;500;600;700&display=swap';
  document.head.appendChild(link);
  const style = document.createElement('style');
  // react-native-web 기본 글꼴 클래스보다 우선하되, 글꼴을 지정한 요소(r-fontFamily)와 중첩 텍스트는 건드리지 않는다
  style.textContent = `[class*="css-text-"]:not([class*="r-fontFamily"]):not([class*="textHasAncestor"]),[class*="css-textinput-"]:not([class*="r-fontFamily"]){font-family:${fonts.sans};letter-spacing:-.15px}`;
  document.head.appendChild(style);
}

export default function App() {
  // 네이티브: 명조(제목·숫자) 폰트. 로드 전에는 시스템 글꼴로 먼저 보여준다
  useFonts(Platform.OS === 'web' ? {} : { Hahmlet: Hahmlet_600SemiBold });
  const app = (
    <SafeAreaProvider>
      <AppProvider>
        <PremiumProvider>
          <StatusBar style={isDark ? 'light' : 'dark'} />
          <RootNavigator />
        </PremiumProvider>
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
  webBg: { flex: 1, alignItems: 'center', backgroundColor: colors.frame },
  webFrame: { flex: 1, width: '100%', maxWidth: 430, overflow: 'hidden', backgroundColor: colors.cream },
});
