import React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';
import { colors } from '../theme/colors';
import B from './brandPaths.json';

/** 브랜드 — 화면 문구와 공유 문구가 모두 여기서 가져간다 (docs/BRAND.md) */
export const BRAND = { name: '운Pick', ko: '운픽', slogan: '오늘의 운, 하나만 Pick!', store: '운Pick - 오늘의 운, 하나만 Pick' };

/**
 * 운Pick 로고 — 패스는 brandPaths.json(아이콘 생성 스크립트와 공유).
 * '운'은 직접 그린 명조 레터링, ㅜ 기둥 자리에 매듭 끈에 매달린 부적(웃는 눈 · 붉은 도장 · 위아래 붉은 두 줄).
 * 회전·변형 속성 없이 좌표로만 그려 웹·앱·공유 이미지에서 같은 모양이다.
 */
const NAVY = '#22293F', RED = colors.seal, T = B.talisman;

function Un({ fg }: { fg: string }) {
  return (
    <>
      <Path d={B.un.o} fill={fg} fillRule="evenodd" />
      <Path d={B.un.nieun} fill={fg} />
      <Path d="M50 53 V60.4" stroke={RED} strokeWidth={1.1} strokeLinecap="round" />
      <Circle cx={50} cy={57.2} r={1.5} fill={RED} />
      <Path d={T.shadow} fill={NAVY} opacity={0.16} />
      <Path d={T.paper} fill="#EFCB63" />
      <Path d={T.rules} fill={RED} opacity={0.85} />
      <Circle cx={T.seal[0]} cy={T.seal[1]} r={3.1} fill={RED} />
      <Path d={T.eyes} fill="none" stroke={NAVY} strokeWidth={1.25} strokeLinecap="round" />
      <Path d={T.smile} fill="none" stroke={NAVY} strokeWidth={1.2} strokeLinecap="round" />
      <Circle cx={T.chL[0]} cy={T.chL[1]} r={1.7} fill="#E07C6A" opacity={0.45} />
      <Circle cx={T.chR[0]} cy={T.chR[1]} r={1.7} fill="#E07C6A" opacity={0.45} />
      <Path d={B.un.bar} fill={fg} />
    </>
  );
}

/** 마크: '운' 레터링 + 부적 (앱 아이콘과 같음). fg: 글자 색 — 밝은 바탕엔 먹남색, 어두운 바탕엔 한지색 */
export function LogoMark({ size = 24, fg = colors.purple }: { size?: number; fg?: string }) {
  return (
    <Svg width={size} height={size} viewBox="5 5 90 90" accessibilityLabel={BRAND.name}>
      <Un fg={fg} />
    </Svg>
  );
}

/** 워드마크: 운Pick 하나 (첫 화면 · 헤더 · 공유 카드). size = 높이 */
export default function BrandMark({ light = false, size = 22 }: { light?: boolean; size?: number }) {
  const fg = light ? '#F4EDDF' : colors.purple;
  return (
    <Svg width={(size * 292) / 88} height={size} viewBox="6 5 292 88" accessibilityLabel={BRAND.name}>
      <Un fg={fg} />
      <Path d={B.pick} fill={fg} />
    </Svg>
  );
}
