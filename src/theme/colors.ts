/**
 * 운알이 디자인 시스템 — 흰 바탕 · 하늘색 그라데이션 머리 · 연회색 카드 · 검정 강조 카드(연두 포인트) ·
 * 파란 포인트 · 몽글한 파스텔 캐릭터(운알이, components/Mascot).
 * 화면 모드는 마이 > 화면 모드(시스템·라이트·다크)를 따른다. 앱 시작 시 결정(index.ts가 먼저 읽음).
 * - purple: 글자·강조용 (다크에서 밝아짐)   - navy: 채움(검정 버튼 · 선택) — 위 글자는 흰색
 * - seal: 파란 포인트(링크 · 배지 · 강조 숫자)   - heroBg: 검정 강조 카드 — 위 글자는 흰색, 포인트는 lime
 */
import { Appearance } from 'react-native';
import { readThemePrefSync } from './themePref';

const pref = readThemePrefSync();
export const isDark = pref === 'dark' ? true : pref === 'light' ? false : Appearance.getColorScheme() === 'dark';

const light = {
  purple: '#191C22',
  purpleDeep: '#000000',
  purpleSoft: '#2F6FD6',
  lavender: '#E6ECF5',
  lavenderSoft: '#F3F5F8', // 연회색 카드
  cream: '#FFFFFF', // 화면 바탕
  card: '#FFFFFF',
  frame: '#EEF2F7', // 데스크톱 웹에서 앱 바깥
  ink: '#191C22',
  inkSub: '#4A505B',
  inkMute: '#7D8490',
  line: '#E8ECF2',
  lineStrong: '#DCE2EA',
  love: '#EF5A6F', loveBg: '#FFECEF',
  money: '#E7A916', moneyBg: '#FFF6DA',
  work: '#2F8CF0', workBg: '#E7F2FF',
  relation: '#2DB57A', relationBg: '#E3F7EC',
  saju: '#F08A4B', sajuBg: '#FFF1E4', // 복숭아
  thai: '#D9A514', thaiBg: '#FFF8D9', // 노랑
  mbti: '#3D9BEF', mbtiBg: '#E6F3FF', // 하늘
  blood: '#EC6A8C', bloodBg: '#FFEAF0', // 분홍
  okBg: '#E3F7EC', careBg: '#FFF1E4',
  badge: '#2F8CF0', badgeBg: '#E7F2FF',
  danger: '#E5484D',
  success: '#22A06B',
  accent: '#2F8CF0', accentBg: '#E7F2FF',
  glowA: '#9FD6FF', glowB: '#CFEBFF', glowC: '#FFFFFF',
  lime: '#D6F07A',
};

const dark: typeof light = {
  ...light,
  purple: '#F2F4F7',
  purpleSoft: '#7DB5FF',
  lavender: '#2A303A',
  lavenderSoft: '#1E232B',
  cream: '#111418',
  card: '#171B21',
  frame: '#07090B',
  ink: '#F2F4F7',
  inkSub: '#C4CAD3',
  inkMute: '#8E96A3',
  line: '#262C35',
  lineStrong: '#323A45',
  love: '#FF7F92', loveBg: '#3A2228',
  money: '#F5C04A', moneyBg: '#3A3018',
  work: '#6FB2FF', workBg: '#1B2A3D',
  relation: '#5BD49B', relationBg: '#163126',
  saju: '#FFA36E', sajuBg: '#3A2A1E',
  thai: '#F2C94C', thaiBg: '#3A3318',
  mbti: '#6FB8FF', mbtiBg: '#1B2B3D',
  blood: '#FF8DAA', bloodBg: '#3A2230',
  okBg: '#163126', careBg: '#3A2A1E',
  badge: '#6FB2FF', badgeBg: '#1B2A3D',
  danger: '#FF6B70',
  success: '#5BD49B',
  accent: '#6FB2FF', accentBg: '#1B2A3D',
  glowA: '#1B3550', glowB: '#152536', glowC: '#111418',
  lime: '#D6F07A',
};

export const colors = {
  ...(isDark ? dark : light),
  // 모드와 무관한 고정색
  navy: isDark ? '#2F8CF0' : '#1E2128', // 채움(버튼 · 선택) — 위 글자는 항상 흰색
  heroBg: '#1E2128', // 검정 강조 카드 — 위 글자는 흰색, 포인트는 lime
  moon: '#FFD15C', // 코인 · 별
  seal: isDark ? '#6FB2FF' : '#2F8CF0', // 파란 포인트
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
  thai: { label: '점성술', sub: '서양·인도·태국', emoji: '星', color: colors.thai, bg: colors.thaiBg },
  mbti: { label: 'MBTI', sub: '지금의 성향', emoji: '性', color: colors.mbti, bg: colors.mbtiBg },
  blood: { label: '혈액형', sub: '기질 한마디', emoji: '血', color: colors.blood, bg: colors.bloodBg },
};

/** 화면 머리의 하늘색 그라데이션과 카드용 파스텔 */
export const gradients = {
  hero: isDark ? (['#1B2A3D', '#171B21'] as const) : (['#BFE3FF', '#E3F2FF', '#F7FBFF'] as const),
  sky: isDark ? (['#1B3550', '#111418'] as const) : (['#8CCBFF', '#D7EEFF', '#FFFFFF'] as const),
  night: ['#1E2128', '#15171C'] as const,
  soft: [colors.lavenderSoft, colors.lavenderSoft] as const,
  peach: isDark ? (['#3A2A1E', '#171B21'] as const) : (['#FFF1E4', '#FFFFFF'] as const),
};
