/**
 * 화면 모드 설정(시스템 · 라이트 · 다크).
 * 색은 앱 시작 때 한 번 정해지므로(colors.ts), 진입점(index.ts)이 저장값을 먼저 읽고 앱을 불러온다.
 * 웹은 localStorage를 바로 읽고, 바꾸면 새로고침해 즉시 적용한다.
 */
import { Platform } from 'react-native';

export type ThemePref = 'system' | 'light' | 'dark';
export const THEME_KEY = 'onulna:theme';

export function readThemePrefSync(): ThemePref {
  if (Platform.OS === 'web' && typeof localStorage !== 'undefined') {
    try { return (localStorage.getItem(THEME_KEY) as ThemePref) || 'system'; } catch { return 'system'; }
  }
  return ((globalThis as any).__themePref as ThemePref) || 'system';
}
