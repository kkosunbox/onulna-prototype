import React, { useId } from 'react';
import Svg, { G, Rect } from 'react-native-svg';
import Mascot, { MascotArt } from './Mascot';
import { colors } from '../theme/colors';

/** 브랜드 — 화면 문구와 공유 문구가 모두 여기서 가져간다 (docs/BRAND.md) */
export const BRAND = { name: '운픽', ko: '운픽', slogan: '오늘, 나에게 딱 맞는 운', store: '운픽 - 오늘, 나에게 딱 맞는 운' };

/**
 * 운픽 로고 — '운'의 ㅇ 자리에 운알이가 앉고, 나머지 획은 모서리가 둥근 굵은 막대(두께 19 · 모서리 8).
 * 글꼴이 아니라 직접 그린 모양이라 앱·웹·아이콘에서 똑같다. scripts/render-icons.js 와 같은 좌표.
 */
/** [x, y, 너비, 높이, 모서리] — 이어 붙는 기둥은 모서리 0 */
export const LOGO_BARS: [number, number, number, number, number][] = [
  // 운: ㅡ · ㅜ(짧은 기둥) · ㄴ
  [25, 83, 102, 19, 8], [66, 92, 19, 18, 5], [25, 83, 20, 45, 8], [25, 110, 102, 18, 8],
  // 픽: ㅍ(위 · 두 기둥 · 아래) · ㅣ · ㄱ
  [138, 28, 74, 19, 8], [150, 40, 18, 30, 0], [182, 40, 18, 30, 0], [138, 64, 74, 19, 8],
  [222, 22, 21, 61, 8], [138, 89, 105, 19, 8], [222, 89, 21, 44, 8],
];
/** 운알이(100×100)를 ㅇ 자리로 옮기는 변환 */
const MASCOT_AT = { x: 30, y: -2, s: 0.92 };

export function Bars({ fg }: { fg: string }) {
  return <>{LOGO_BARS.map(([x, y, w, h, r], i) => <Rect key={i} x={x} y={y} width={w} height={h} rx={r} fill={fg} />)}</>;
}

/** 마크: 운알이 얼굴 (작은 자리 · 로딩) */
export function LogoMark({ size = 24 }: { size?: number; fg?: string }) {
  return <Mascot size={size} shadow={false} />;
}

/** 워드마크: 운알이 + 운픽. size = 높이 */
export default function BrandMark({ light = false, size = 22, fg: fgIn }: { light?: boolean; size?: number; fg?: string }) {
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const fg = fgIn ?? (light ? '#FFFFFF' : colors.ink);
  return (
    <Svg width={(size * 232) / 136} height={size} viewBox="18 -4 232 136" accessibilityLabel={BRAND.name}>
      <Bars fg={fg} />
      <G x={MASCOT_AT.x} y={MASCOT_AT.y} scale={MASCOT_AT.s}>
        <MascotArt id={`l${id}`} />
      </G>
    </Svg>
  );
}
