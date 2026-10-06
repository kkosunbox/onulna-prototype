import React from 'react';
import Svg, { Circle, Ellipse, G, Path } from 'react-native-svg';
import { colors } from '../theme/colors';

/** 브랜드 — 화면 문구와 공유 문구가 모두 여기서 가져간다 (docs/BRAND.md) */
export const BRAND = { name: '운Pick', ko: '운픽', slogan: '오늘의 운, 하나만 Pick!', store: '운Pick - 오늘의 운, 하나만 Pick' };

/**
 * 운Pick 로고는 글꼴이 아니라 직접 그린 단선 레터링이다(획 두께 11 · 둥근 끝 · scripts/render-icons.js 와 같은 패스).
 * 시그니처: '운'의 ㅜ 기둥 자리에 매달린 작은 노란 부적(웃는 얼굴 · 붉은 도장) — 오늘 뽑은(Pick) 행운.
 */
const STROKE = { fill: 'none', strokeWidth: 11, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;

function Un({ fg }: { fg: string }) {
  return (
    <>
      <Ellipse cx={50} cy={24.5} rx={20} ry={15} stroke={fg} {...STROKE} />
      <Path d="M26 74 V86.5 H83" stroke={fg} {...STROKE} />
      {/* ㅜ 기둥 자리의 부적 — 회전은 좌표로 미리 계산해 어디서나 같은 모양 */}
      <Path d="M 40.24 56.85 L 59.06 54.2 L 62.36 77.67 L 43.54 80.32 Z" fill="#EDC861" stroke="#D9AE3F" strokeWidth={1.4} strokeLinejoin="round" />
      <Circle cx={50.45} cy={61.17} r={2.7} fill={colors.seal} />
      <Circle cx={47.8} cy={68.21} r={1.55} fill="#22293F" />
      <Circle cx={54.93} cy={67.2} r={1.55} fill="#22293F" />
      <Path d="M 48.55 72.14 Q 52.39 75.03 55.29 71.19" fill="none" stroke="#22293F" strokeWidth={1.5} strokeLinecap="round" />
      <Circle cx={46.07} cy={71.68} r={1.7} fill={colors.seal} opacity={0.32} />
      <Circle cx={57.55} cy={70.07} r={1.7} fill={colors.seal} opacity={0.32} />
      <Path d="M14 52.5 H86" stroke={fg} {...STROKE} />
    </>
  );
}

/** 마크: '운' 레터링 (앱 아이콘과 같음). fg: 획 색 — 밝은 바탕엔 먹남색, 어두운 바탕엔 한지색 */
export function LogoMark({ size = 24, fg = colors.purple }: { size?: number; fg?: string }) {
  return (
    <Svg width={size} height={size} viewBox="2 2 96 96" accessibilityLabel={BRAND.name}>
      <Un fg={fg} />
    </Svg>
  );
}

/** 워드마크: 운Pick 레터링 하나 (첫 화면 · 헤더 · 공유 카드). size = 높이 */
export default function BrandMark({ light = false, size = 22 }: { light?: boolean; size?: number }) {
  const fg = light ? '#F4EDDF' : colors.purple;
  return (
    <Svg width={(size * 281) / 92} height={size} viewBox="-6 2 281 92" accessibilityLabel={BRAND.name}>
      <Un fg={fg} />
      <G x={110}>
        <Path d="M0 86.5 V13 H15 A18.5 18.5 0 0 1 15 50 H0" stroke={fg} {...STROKE} />
        <Path d="M55 44 V86.5" stroke={fg} {...STROKE} />
        <Circle cx={55} cy={22} r={7} fill={fg} />
        <Path d="M110 52 A18.5 18.5 0 1 0 110 80" stroke={fg} {...STROKE} />
        <Path d="M128 13 V86.5 M128 67 L151 44 M135 61 L153 86.5" stroke={fg} {...STROKE} />
      </G>
    </Svg>
  );
}
