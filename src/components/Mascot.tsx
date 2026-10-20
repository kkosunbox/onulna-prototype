import React, { useId } from 'react';
import Svg, { Circle, ClipPath, Defs, Ellipse, G, Path, RadialGradient, Rect, Stop, Text as SvgText } from 'react-native-svg';

/**
 * 운알이 — 하루에 좋은 운을 골라 주는 작은 운의 씨앗.
 * 몽글한 몸(파스텔 메시 그라데이션) + 동그란 눈. 표정 · 색 · 소품만 바꿔 화면마다 등장한다.
 * 모두 SVG라 크기를 바꿔도 깨지지 않고, 공유 카드 캡처에도 그대로 나온다.
 */
export type MascotPalette = 'classic' | 'pink' | 'peach' | 'mint' | 'lavender';
export type MascotFace = 'open' | 'wink' | 'happy' | 'sleepy' | 'look' | 'curious';
export type MascotProp = 'none' | 'sparkle' | 'heart' | 'clover' | 'question' | 'music' | 'headphones';

const PAL: Record<MascotPalette, { base: string; spots: [string, string, string, string] }> = {
  classic: { base: '#E4F2FF', spots: ['#FFF0A3', '#B9DDFF', '#D3F3C2', '#FFFFFF'] },
  pink: { base: '#F7E1F6', spots: ['#FFBFE0', '#D8CCFF', '#FFF1C2', '#FFFFFF'] },
  peach: { base: '#FFE7DA', spots: ['#FFB9B4', '#FFE6A1', '#FFD0E6', '#FFFFFF'] },
  mint: { base: '#DDF6E8', spots: ['#A9E8C4', '#FFF2AE', '#CDE8FF', '#FFFFFF'] },
  lavender: { base: '#E6E2FF', spots: ['#C9C0FF', '#B8DAFF', '#F2D6FF', '#FFFFFF'] },
};

/** 몸 모양 — 살짝 기운 강낭콩 */
const BODY = 'M47 12 C66 9 82 20 86 38 C90 52 92 66 84 78 C75 90 57 93 41 90 C24 87 12 76 11 59 C10 43 15 27 27 18 C33 14 40 12 47 12 Z';

export default function Mascot({ size = 96, palette = 'classic', face = 'open', prop = 'none', shadow = true }: {
  size?: number; palette?: MascotPalette; face?: MascotFace; prop?: MascotProp; shadow?: boolean;
}) {
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const P = PAL[palette];
  const spots = [
    { cx: 30, cy: 70, r: 34, c: P.spots[1] },
    { cx: 64, cy: 58, r: 30, c: P.spots[0] },
    { cx: 74, cy: 34, r: 26, c: P.spots[2] },
    { cx: 36, cy: 28, r: 22, c: P.spots[3] },
  ];
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Defs>
        <ClipPath id={`b${id}`}><Path d={BODY} /></ClipPath>
        {spots.map((s, i) => (
          <RadialGradient key={i} id={`g${id}${i}`} cx={s.cx} cy={s.cy} r={s.r} gradientUnits="userSpaceOnUse">
            <Stop offset="0" stopColor={s.c} stopOpacity={0.95} />
            <Stop offset="1" stopColor={s.c} stopOpacity={0} />
          </RadialGradient>
        ))}
        <RadialGradient id={`s${id}`} cx="50" cy="95" r="34" gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor="#7C93B8" stopOpacity={0.22} />
          <Stop offset="1" stopColor="#7C93B8" stopOpacity={0} />
        </RadialGradient>
      </Defs>

      {shadow ? <Ellipse cx={50} cy={95} rx={34} ry={4} fill={`url(#s${id})`} /> : null}
      <G clipPath={`url(#b${id})`}>
        <Rect x={0} y={0} width={100} height={100} fill={P.base} />
        {spots.map((s, i) => <Circle key={i} cx={s.cx} cy={s.cy} r={s.r} fill={`url(#g${id}${i})`} />)}
      </G>

      <Face face={face} />
      <Accessory prop={prop} />
    </Svg>
  );
}

/** 눈 — 흰자 + 까만 눈동자(살짝 위를 보는 반짝이 점) */
function Eye({ x, y, r = 9, dx = 1.5, dy = -1 }: { x: number; y: number; r?: number; dx?: number; dy?: number }) {
  return (
    <G>
      <Circle cx={x} cy={y} r={r} fill="#FFFFFF" stroke="#E3E8F0" strokeWidth={0.8} />
      <Circle cx={x + dx} cy={y + dy} r={r * 0.55} fill="#111318" />
      <Circle cx={x + dx + r * 0.2} cy={y + dy - r * 0.22} r={r * 0.14} fill="#FFFFFF" />
    </G>
  );
}
const ARC = { fill: 'none', stroke: '#111318', strokeWidth: 2.6, strokeLinecap: 'round' } as const;

function Face({ face }: { face: MascotFace }) {
  if (face === 'happy' || face === 'sleepy') {
    const d = face === 'happy' ? 'M30 47 Q36 41 42 47 M52 45 Q58 39 64 45' : 'M30 45 Q36 51 42 45 M52 43 Q58 49 64 43';
    return <Path d={d} {...ARC} />;
  }
  if (face === 'wink') return (<G><Path d="M29 46 Q35 41 41 46" {...ARC} /><Eye x={58} y={45} r={8.5} /></G>);
  if (face === 'look') return (<G><Eye x={36} y={44} r={9} dx={2.5} dy={-2.5} /><Eye x={58} y={40} r={9.5} dx={2.5} dy={-2.5} /></G>);
  if (face === 'curious') return (<G><Eye x={38} y={48} r={8.5} dx={2} dy={-1} /><Eye x={60} y={42} r={9.5} dx={1} dy={-2} /></G>);
  return (<G><Eye x={36} y={46} r={9} /><Eye x={58} y={42} r={9.5} /></G>);
}

function Accessory({ prop }: { prop: MascotProp }) {
  switch (prop) {
    case 'sparkle':
      return <Path d="M80 8 L76 18 M92 16 L84 22" stroke="#F9DE6B" strokeWidth={4} strokeLinecap="round" />;
    case 'heart':
      return <Path d="M84 6 C88 2 95 5 94 11 C93 16 86 20 84 22 C82 20 75 16 74 11 C73 5 80 2 84 6 Z" fill="#8CC8FF" />;
    case 'question':
      return <SvgText x={86} y={22} fontSize={22} fontWeight="800" fill="#6FB6FF" textAnchor="middle">?</SvgText>;
    case 'music':
      return <Path d="M82 8 V20 M82 8 L90 6 V16" stroke="#6FB6FF" strokeWidth={2.4} strokeLinecap="round" fill="none" />;
    case 'clover':
      return (
        <G>
          {[[44, 72], [56, 72], [44, 84], [56, 84]].map(([x, y], i) => <Circle key={i} cx={x} cy={y} r={7.5} fill="#7BCB6B" />)}
          <Circle cx={50} cy={78} r={3} fill="#5DB24E" />
          <Path d="M53 84 Q58 92 56 97" stroke="#5DB24E" strokeWidth={2.4} fill="none" strokeLinecap="round" />
        </G>
      );
    case 'headphones':
      return (
        <G>
          <Path d="M18 46 C18 22 76 14 84 40" stroke="#E7ECF5" strokeWidth={5} fill="none" strokeLinecap="round" />
          <Rect x={10} y={42} width={12} height={20} rx={6} fill="#DDE5F2" />
          <Rect x={80} y={36} width={12} height={20} rx={6} fill="#DDE5F2" />
        </G>
      );
    default:
      return null;
  }
}
