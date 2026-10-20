import React from 'react';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import Mascot from './Mascot';
import { colors } from '../theme/colors';

/** 브랜드 — 화면 문구와 공유 문구가 모두 여기서 가져간다 (docs/BRAND.md) */
export const BRAND = { name: '운Pick', ko: '운픽', slogan: '오늘, 나에게 딱 맞는 운', store: '운Pick - 오늘, 나에게 딱 맞는 운' };

/**
 * 운Pick 로고 — 글꼴이 아니라 직접 그린 굵은 레터링(획 18 · 글자 간격 12).
 * '운'은 동그란 ㅇ · 각진 ㅡ · 짧은 ㅜ · 물결처럼 흘러내리는 ㄴ(오늘의 흐름),
 * 'Pick'은 둥근 기하 글자에 k의 위쪽 팔만 파란 사선 — 오늘 하나를 '콕' 고르는 손짓.
 * scripts/render-icons.js 와 같은 패스.
 */
export const LOGO_BLUE = '#5B9BF5';
const W = 18;
const st = (c: string, cap: 'round' | 'butt' = 'round') => ({ fill: 'none', stroke: c, strokeWidth: W, strokeLinecap: cap, strokeLinejoin: 'round' } as const);

/** 글자 사이 간격은 모두 12, 획은 18 — 'Pick' 높이(21~113)에 맞춘 비율 */
function Wordmark({ fg }: { fg: string }) {
  return (
    <>
      {/* 운 */}
      <Circle cx={48} cy={24} r={18} {...st(fg)} />
      <Rect x={0} y={54} width={96} height={18} fill={fg} />
      <Rect x={39} y={64} width={18} height={30} fill={fg} />
      <Path d="M13 64 V88 C13 102 30 104 46 97 C60 91 72 90 80 98 C85 103 86 112 86 124" {...st(fg, 'butt')} />
      {/* Pick */}
      <Path d="M117 104 V38 H138 A19 19 0 0 1 138 76 H126" {...st(fg)} />
      <Path d="M187 60 V104" {...st(fg)} />
      <Circle cx={187} cy={32} r={11} fill={fg} />
      <Path d="M254 62 A22 22 0 1 0 254 98" {...st(fg)} />
      <Path d="M284 30 V104 M291 78 L314 104" {...st(fg)} />
      <Path d="M292 72 L318 46" {...st(LOGO_BLUE)} />
    </>
  );
}

/** 마크: 운알이 얼굴 (작은 자리 · 로딩) */
export function LogoMark({ size = 24 }: { size?: number; fg?: string }) {
  return <Mascot size={size} shadow={false} />;
}

/** 워드마크: 운Pick. size = 높이 */
export default function BrandMark({ light = false, size = 22, fg: fgIn }: { light?: boolean; size?: number; fg?: string }) {
  const fg = fgIn ?? (light ? '#FFFFFF' : colors.ink);
  return (
    <Svg width={(size * 344) / 138} height={size} viewBox="-8 -10 344 138" accessibilityLabel={BRAND.name}>
      <Wordmark fg={fg} />
    </Svg>
  );
}
