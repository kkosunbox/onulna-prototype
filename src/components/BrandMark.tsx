import React from 'react';
import Svg, { Circle, G, Path, Rect } from 'react-native-svg';
import Mascot from './Mascot';
import { colors } from '../theme/colors';

/** 브랜드 — 화면 문구와 공유 문구가 모두 여기서 가져간다 (docs/BRAND.md) */
export const BRAND = { name: '운Pick', ko: '운픽', slogan: '오늘, 나에게 딱 맞는 운', store: '운Pick - 오늘, 나에게 딱 맞는 운' };

/**
 * 운Pick 로고 — 글꼴이 아니라 직접 그린 굵은 레터링(획 15).
 * '운'은 동그란 ㅇ · 각진 ㅡ · 짧은 ㅜ · 물결처럼 흘러내리는 ㄴ(오늘의 흐름),
 * 'Pick'은 둥근 기하 글자에 k의 위쪽 팔만 파란 사선 — 오늘 하나를 '콕' 고르는 손짓.
 * scripts/render-icons.js 와 같은 패스.
 */
export const LOGO_BLUE = '#5B9BF5';
const st = (c: string, cap: 'round' | 'butt' = 'round') => ({ fill: 'none', stroke: c, strokeWidth: 15, strokeLinecap: cap, strokeLinejoin: 'round' } as const);

function Wordmark({ fg }: { fg: string }) {
  return (
    <>
      {/* 운 */}
      <Circle cx={50} cy={26} r={15} {...st(fg)} />
      <Rect x={6} y={50} width={88} height={15} fill={fg} />
      <Rect x={42.5} y={58} width={15} height={20} fill={fg} />
      <Path d="M18 58 V84 C18 98 34 100 48 94 C62 88 74 86 80 94 C84 100 84 108 84 114" {...st(fg, 'butt')} />
      {/* Pick */}
      <G x={116}>
        <Path d="M8 100 V40 H34 A19 19 0 0 1 34 78 H22" {...st(fg)} />
        <Path d="M70 58 V100" {...st(fg)} />
        <Circle cx={70} cy={30} r={10} fill={fg} />
        <Path d="M134 60 A21 21 0 1 0 134 96" {...st(fg)} />
        <Path d="M160 30 V100 M166 76 L190 100" {...st(fg)} />
        <Path d="M168 70 L194 44" {...st(LOGO_BLUE)} />
      </G>
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
    <Svg width={(size * 324) / 124} height={size} viewBox="-4 0 324 124" accessibilityLabel={BRAND.name}>
      <Wordmark fg={fg} />
    </Svg>
  );
}
