import React, { useId } from 'react';
import Svg, { Defs, Ellipse, G, LinearGradient, Path, Stop } from 'react-native-svg';
import Mascot from './Mascot';
import { colors } from '../theme/colors';

/** 브랜드 — 화면 문구와 공유 문구가 모두 여기서 가져간다 (docs/BRAND.md) */
export const BRAND = { name: '운픽', ko: '운픽', slogan: '오늘, 나에게 딱 맞는 운', store: '운픽 - 오늘, 나에게 딱 맞는 운' };

/**
 * 운픽 로고는 글꼴이 아니라 직접 그린 굵은 둥근 레터링(획 14 · 둥근 끝)이다.
 * 시그니처: '픽' 오른쪽 위에 맺힌 운알이 물방울(하늘 → 라벤더) — 오늘 골라 담은 작은 운.
 */
const STROKE = { fill: 'none', strokeWidth: 14, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;

function Letters({ fg }: { fg: string }) {
  return (
    <>
      {/* 운 */}
      <Ellipse cx={48} cy={25} rx={20} ry={14.5} stroke={fg} {...STROKE} />
      <Path d="M12 54 H84 M48 54 V67 M22 76 V88 H80" stroke={fg} {...STROKE} />
      {/* 픽: ㅍ · ㅣ · ㄱ */}
      <G x={104}>
        <Path d="M6 13 H58 M21 13 V43 M43 13 V43 M4 43 H60 M80 6 V58 M10 72 H64 V94" stroke={fg} {...STROKE} />
      </G>
    </>
  );
}

/** 마크: 운알이 얼굴 (작은 자리) */
export function LogoMark({ size = 24 }: { size?: number; fg?: string }) {
  return <Mascot size={size} shadow={false} />;
}

/** 워드마크: 운픽 레터링 + 운알이 물방울. size = 높이 */
export default function BrandMark({ light = false, size = 22, fg: fgIn }: { light?: boolean; size?: number; fg?: string }) {
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const fg = fgIn ?? (light ? '#FFFFFF' : colors.ink);
  return (
    <Svg width={(size * 224) / 112} height={size} viewBox="-6 -12 224 112" accessibilityLabel={BRAND.name}>
      <Defs>
        <LinearGradient id={`d${id}`} x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#B9E0FF" />
          <Stop offset="0.6" stopColor="#8FB8FF" />
          <Stop offset="1" stopColor="#C9B8FF" />
        </LinearGradient>
      </Defs>
      <Letters fg={fg} />
      {/* 운알이 물방울 */}
      <Path d="M199 -11 C209 -11 215 -3 215 7 C215 16 207 21 198 20 C189 19 185 11 186 3 C187 -5 192 -11 199 -11 Z" fill={`url(#d${id})`} />
    </Svg>
  );
}
