import React, { useEffect, useState } from 'react';
import { Appearance, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { registerRootComponent } from 'expo';
import { THEME_KEY, ThemePref } from './src/theme/themePref';

/**
 * 저장된 화면 모드(시스템·라이트·다크)를 먼저 읽고 앱을 불러온다.
 * 색 팔레트(colors.ts)가 앱을 불러올 때 정해지기 때문.
 */
function Boot() {
  const [App, setApp] = useState<React.ComponentType | null>(null);
  useEffect(() => {
    (async () => {
      let pref: ThemePref = 'system';
      try { pref = ((await AsyncStorage.getItem(THEME_KEY)) as ThemePref) || 'system'; } catch {}
      (globalThis as any).__themePref = pref;
      if (Platform.OS !== 'web' && pref !== 'system') Appearance.setColorScheme?.(pref);
      setApp(() => require('./App').default);
    })();
  }, []);
  return App ? React.createElement(App) : null;
}

registerRootComponent(Boot);
