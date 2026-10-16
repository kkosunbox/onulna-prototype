/**
 * 파스텔 디자인 시스템 — 흰 바탕 위 살구·하늘·분홍 그라데이션 · 흰 카드(반경 22) · 옅은 선 ·
 * 파스텔 아이콘 칸 · 코랄 포인트 · 검정 알약 버튼 · 굵은 고딕.
 * 화면 모드는 마이 > 화면 모드(시스템·라이트·다크)를 따른다. 앱 시작 시 결정(index.ts가 먼저 읽음).
 * - purple: 글자·강조용 (다크에서 밝아짐)   - navy: 채움용 (버튼·선택 상태)
 * - seal: 코랄 포인트(눈썹 글자 · 강조 숫자 · 배지)
 */
import { Appearance } from 'react-native';
import { readThemePrefSync } from './themePref';

const pref = readThemePrefSync();
export const isDark = pref === 'dark' ? true : pref === 'light' ? false : Appearance.getColorScheme() === 'dark';

const light = {
  purple: '#1A1A1A',
  purpleDeep: '#000000',
  purpleSoft: '#6A5BA8',
  lavender: '#EEEAF7',
  lavenderSoft: '#F5F3F2',
  cream: '#FFFCFA', // 화면 바탕 (위에 그라데이션)
  card: '#FFFFFF',
  frame: '#F1ECEA', // 데스크톱 웹에서 앱 바깥
  ink: '#1A1A1A',
  inkSub: '#3E3839',
  inkMute: '#7B706F',
  line: '#EEEAE9',
  lineStrong: '#E3DEDC',
  love: '#D9606E', loveBg: '#FDEEF0',
  money: '#C27512', moneyBg: '#FFF3E2',
  work: '#2A70D2', workBg: '#EAF1FB',
  relation: '#1E8C92', relationBg: '#E7F5F6',
  saju: '#5B4B94', sajuBg: '#F1EEF9',
  thai: '#C27512', thaiBg: '#FFF3E2',
  mbti: '#1E8C92', mbtiBg: '#E7F5F6',
  blood: '#D9606E', bloodBg: '#FDEEF0',
  okBg: '#E7F5F6', careBg: '#FFF3E2',
  badge: '#B4690E', badgeBg: '#FFF3E2',
  danger: '#D9485A',
  success: '#1E8C92',
  accent: '#E5707D', accentBg: '#FDEEF0',
  glowA: '#FFF1D8', glowB: '#E8F1FF', glowC: '#FFE0E6',
};

const dark: typeof light = {
  ...light,
  purple: '#F3F0F0',
  purpleSoft: '#B4A8E6',
  lavender: '#2A2633',
  lavenderSoft: '#242126',
  cream: '#121013',
  card: '#1C1A1E',
  frame: '#09080A',
  ink: '#F3F0F0',
  inkSub: '#CDC6C6',
  inkMute: '#9D9393',
  line: '#2A272C',
  lineStrong: '#36323A',
  love: '#F08A96', loveBg: '#3A2328',
  money: '#F2B25C', moneyBg: '#3A2D1C',
  work: '#7EAAF0', workBg: '#1D2638',
  relation: '#6FCBD0', relationBg: '#183033',
  saju: '#B4A8E6', sajuBg: '#2A2538',
  thai: '#F2B25C', thaiBg: '#3A2D1C',
  mbti: '#6FCBD0', mbtiBg: '#183033',
  blood: '#F08A96', bloodBg: '#3A2328',
  okBg: '#183033', careBg: '#3A2D1C',
  badge: '#F2B25C', badgeBg: '#3A2D1C',
  danger: '#F07884',
  success: '#6FCBD0',
  accent: '#F08A96', accentBg: '#3A2328',
  glowA: '#2A2118', glowB: '#18202E', glowC: '#2C1A20',
};

export const colors = {
  ...(isDark ? dark : light),
  // 모드와 무관한 고정색
  navy: isDark ? '#E5707D' : '#1A1A1A', // 채움(버튼 · 선택) — 위 글자는 항상 흰색
  heroBg: isDark ? '#221E29' : '#F5F0FA', // 히어로 카드 바탕(옅은 라벤더) — 위 글자는 ink
  moon: '#FFC98A',
  seal: isDark ? '#F08A96' : '#E5707D',
  white: '#FFFFFF',
};

export type CategoryKey = 'love' | 'money' | 'work' | 'relationship';

/** emoji 자리는 한자 도장(낙관) */
export const categoryTheme: Record<CategoryKey, { label: string; short: string; emoji: string; color: string; bg: string }> = {
  love: { label: '연애운', short: '연애', emoji: '緣', color: colors.love, bg: colors.loveBg },
  money: { label: '재물운', short: '재물', emoji: '財', color: colors.money, bg: colors.moneyBg },
  work: { label: '직장·사업운', short: '직장', emoji: '業', color: colors.work, bg: colors.workBg },
  relationship: { label: '인간관계운', short: '관계', emoji: '人', color: colors.relation, bg: colors.relationBg },
};

/** 4가지 분석 관점별 고유 색 */
export type SourceKey = 'saju' | 'thai' | 'mbti' | 'blood';
export const analysisTheme: Record<SourceKey, { label: string; sub: string; emoji: string; color: string; bg: string }> = {
  saju: { label: '사주', sub: '타고난 기운', emoji: '命', color: colors.saju, bg: colors.sajuBg },
  thai: { label: '태국 점성술', sub: '요일의 행성', emoji: '星', color: colors.thai, bg: colors.thaiBg },
  mbti: { label: 'MBTI', sub: '지금의 성향', emoji: '性', color: colors.mbti, bg: colors.mbtiBg },
  blood: { label: '혈액형', sub: '기질 한마디', emoji: '血', color: colors.blood, bg: colors.bloodBg },
};

/** 화면 바탕 그라데이션(살구 → 하늘 → 분홍)과 카드용 파스텔 */
export const gradients = {
  hero: isDark ? (['#2A2333', '#1F2533', '#2C1F27'] as const) : (['#FFE9EC', '#F1ECFB', '#E6F0FD'] as const),
  night: ['#1F1B24', '#141216'] as const,
  soft: [colors.lavenderSoft, colors.lavenderSoft] as const,
  peach: isDark ? (['#2E2419', '#1C1A1E'] as const) : (['#FFF1D8', '#FFFFFF'] as const),
};
