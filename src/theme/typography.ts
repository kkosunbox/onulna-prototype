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

/** 숫자·제목에 덧붙이는 굵은 글꼴(예전 이름 유지) */
export const serif: TextStyle = { fontFamily: fonts.serif };

/**
 * 글자 크기는 여섯 단계만 쓴다. 화면을 새로 만들 때도 이 값 밖의 크기는 쓰지 않는다.
 *  큰 숫자 40 · 제목 24 · 소제목 18 · 본문 15 · 보조 13 · 작은 글 11
 */
export const type = {
  display: { size: 40, line: 46, weight: '800', track: -1.2 },
  title: { size: 24, line: 32, weight: '800', track: -0.6 },
  heading: { size: 18, line: 26, weight: '700', track: -0.4 },
  body: { size: 15, line: 23, weight: '400', track: -0.2 },
  label: { size: 13, line: 19, weight: '500', track: -0.1 },
  micro: { size: 11, line: 15, weight: '600', track: 0 },
} as const;

export const txt = {
  display: { fontFamily: fonts.display, fontSize: 40, lineHeight: 46, fontWeight: '800', letterSpacing: -1.2, color: colors.ink },
  title: { fontFamily: fonts.display, fontSize: 24, lineHeight: 32, fontWeight: '800', letterSpacing: -0.6, color: colors.ink },
  h2: { ...sansW('700'), fontSize: 18, lineHeight: 26, letterSpacing: -0.4, color: colors.ink },
  h3: { ...sansW('700'), fontSize: 18, lineHeight: 26, letterSpacing: -0.4, color: colors.ink },
  body: { ...sansW('400'), fontSize: 15, lineHeight: 23, letterSpacing: -0.2, color: colors.inkSub },
  bodyStrong: { ...sansW('600'), fontSize: 15, lineHeight: 23, letterSpacing: -0.2, color: colors.ink },
  small: { ...sansW('500'), fontSize: 13, lineHeight: 19, color: colors.inkMute },
  caption: { ...sansW('500'), fontSize: 13, lineHeight: 19, color: colors.inkMute },
  micro: { ...sansW('600'), fontSize: 11, lineHeight: 15, color: colors.inkMute },
  eyebrow: { ...sansW('700'), fontSize: 11, lineHeight: 15, letterSpacing: 1.8, color: colors.seal },
} satisfies Record<string, TextStyle>;

/** 반경: 히어로 24 · 카드 18 · 버튼·입력 12 · 칩은 알약 */
export const radius = { xs: 8, sm: 12, md: 12, lg: 18, xl: 24, pill: 999 };
export const space = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 28, section: 32 };
export const SCREEN_PX = 20;

/** 그림자: 카드는 거의 없이 선으로, 히어로만 은은한 분홍빛 */
export const shadow = {
  card: { shadowColor: '#1E2A3A', shadowOpacity: isDark ? 0.35 : 0.05, shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, elevation: 1 },
  hero: { shadowColor: isDark ? '#000000' : '#2F6FB0', shadowOpacity: isDark ? 0.4 : 0.12, shadowRadius: 20, shadowOffset: { width: 0, height: 8 }, elevation: 6 },
  float: { shadowColor: '#1E2A3A', shadowOpacity: 0.08, shadowRadius: 20, shadowOffset: { width: 0, height: -2 }, elevation: 12 },
} satisfies Record<string, ViewStyle>;
