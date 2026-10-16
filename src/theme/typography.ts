import { Platform, TextStyle, ViewStyle } from 'react-native';
import { colors, isDark } from './colors';

/**
 * 타입 시스템 — Pretendard 한 서체로 통일(굵은 800 제목 · 400 본문).
 * fonts.serif 는 예전 '강조' 자리(큰 숫자 · 한자 아이콘)로, 지금은 굵은 Pretendard 를 가리킨다.
 * 웹은 웹폰트(Pretendard CDN)를 굵기별로, 네이티브는 굵기별 파일을 따로 불러온다(App.tsx).
 * SIL Open Font License (assets/fonts/LICENSE-*.txt).
 */
const SANS_WEB = "Pretendard, -apple-system, 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif";
export const fonts = {
  serif: Platform.select({ web: SANS_WEB, default: 'Pretendard-Bold' })!,
  display: Platform.select({ web: SANS_WEB, default: 'Pretendard-Bold' })!,
  sans: Platform.select({ web: SANS_WEB, default: 'Pretendard-Regular' }),
};

/** Pretendard 굵기 → 글꼴 이름 (웹은 굵기로, 네이티브는 굵기별 파일 이름으로) */
const PRE: Record<string, string> = { '400': 'Pretendard-Regular', '500': 'Pretendard-Medium', '600': 'Pretendard-SemiBold', '700': 'Pretendard-Bold', '800': 'Pretendard-Bold' };
export const sansW = (w: '400' | '500' | '600' | '700' | '800'): TextStyle =>
  Platform.OS === 'web' ? { fontFamily: fonts.sans, fontWeight: w } : { fontFamily: PRE[w] };

/** 숫자·제목에 덧붙이는 명조체 */
export const serif: TextStyle = { fontFamily: fonts.serif };

export const txt = {
  title: { fontFamily: fonts.display, fontSize: 26, lineHeight: 34, fontWeight: '800', letterSpacing: -0.8, color: colors.ink },
  h2: { fontFamily: fonts.display, fontSize: 20, lineHeight: 28, fontWeight: '800', letterSpacing: -0.6, color: colors.ink },
  h3: { ...sansW('700'), fontSize: 17, lineHeight: 24, letterSpacing: -0.4, color: colors.ink },
  body: { ...sansW('400'), fontSize: 15, lineHeight: 23, letterSpacing: -0.2, color: colors.inkSub },
  bodyStrong: { ...sansW('600'), fontSize: 15, lineHeight: 22, letterSpacing: -0.2, color: colors.ink },
  small: { ...sansW('500'), fontSize: 13, lineHeight: 19, color: colors.inkMute },
  caption: { ...sansW('500'), fontSize: 12, lineHeight: 17, color: colors.inkMute },
} satisfies Record<string, TextStyle>;

/** 반경: 히어로 26 · 카드 22 · 입력 14 · 아이콘 칸 13 · 칩은 알약 */
export const radius = { xs: 8, sm: 13, md: 14, lg: 22, xl: 26, pill: 999 };
export const space = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 28, section: 32 };
export const SCREEN_PX = 20;

/** 그림자: 카드는 거의 없이 선으로, 히어로만 은은한 분홍빛 */
export const shadow = {
  card: { shadowColor: '#3E2A2C', shadowOpacity: isDark ? 0.35 : 0.04, shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, elevation: 1 },
  hero: { shadowColor: isDark ? '#000000' : '#E5707D', shadowOpacity: isDark ? 0.4 : 0.14, shadowRadius: 24, shadowOffset: { width: 0, height: 12 }, elevation: 6 },
  float: { shadowColor: '#3E2A2C', shadowOpacity: 0.08, shadowRadius: 20, shadowOffset: { width: 0, height: -2 }, elevation: 12 },
} satisfies Record<string, ViewStyle>;
