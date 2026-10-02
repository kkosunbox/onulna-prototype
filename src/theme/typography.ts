import { Platform, TextStyle, ViewStyle } from 'react-native';
import { colors, isDark } from './colors';

/**
 * 책력 타입: 제목·숫자는 명조(Hahmlet), 본문은 IBM Plex Sans KR.
 * 웹은 Google Fonts(굵기별), 네이티브는 expo-font로 Hahmlet을 불러온다(App.tsx).
 */
export const fonts = {
  serif: Platform.select({ web: "Hahmlet, 'Nanum Myeongjo', AppleMyungjo, serif", default: 'Hahmlet' })!,
  sans: Platform.select({ web: "'IBM Plex Sans KR', -apple-system, 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif", default: undefined }),
};

/** 숫자·제목에 덧붙이는 명조체 */
export const serif: TextStyle = { fontFamily: fonts.serif };

export const txt = {
  title: { fontFamily: fonts.serif, fontSize: 25, lineHeight: 34, fontWeight: '600', letterSpacing: -0.6, color: colors.ink },
  h2: { fontFamily: fonts.serif, fontSize: 19, lineHeight: 27, fontWeight: '600', letterSpacing: -0.4, color: colors.ink },
  h3: { fontSize: 16, lineHeight: 22, fontWeight: '700', letterSpacing: -0.3, color: colors.ink },
  body: { fontSize: 15, lineHeight: 22, fontWeight: '400', letterSpacing: -0.15, color: colors.inkSub },
  bodyStrong: { fontSize: 15, lineHeight: 22, fontWeight: '600', letterSpacing: -0.15, color: colors.ink },
  small: { fontSize: 13, lineHeight: 18, fontWeight: '500', color: colors.inkMute },
  caption: { fontSize: 12, lineHeight: 16, fontWeight: '500', color: colors.inkMute },
} satisfies Record<string, TextStyle>;

/** 반경: 히어로 18 · 카드 14 · 입력/버튼 10~12 · 칩 6 */
export const radius = { xs: 6, sm: 10, md: 12, lg: 14, xl: 18, pill: 999 };
export const space = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 28, section: 32 };
export const SCREEN_PX = 20;

/** 그림자는 거의 평평하게, 히어로만 은은하게 */
export const shadow = {
  card: { shadowColor: '#281E0A', shadowOpacity: isDark ? 0.4 : 0.06, shadowRadius: 2, shadowOffset: { width: 0, height: 1 }, elevation: 1 },
  hero: { shadowColor: '#141623', shadowOpacity: 0.16, shadowRadius: 13, shadowOffset: { width: 0, height: 10 }, elevation: 6 },
  float: { shadowColor: '#281E0A', shadowOpacity: 0.1, shadowRadius: 20, shadowOffset: { width: 0, height: -2 }, elevation: 12 },
} satisfies Record<string, ViewStyle>;
