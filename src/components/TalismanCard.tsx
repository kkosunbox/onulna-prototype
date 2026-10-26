import React, { forwardRef } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, Defs, Ellipse, G, Path, RadialGradient, Rect, Stop, Text as SvgText } from 'react-native-svg';
import Mascot from './Mascot';
import { fonts } from '../theme/typography';

/**
 * 오늘의 부적 카드 — 운알이가 건네는 귀여운 부적.
 * 크림 종이 · 해와 구름 · 금빛 격자 문양 액자 속 큰 한자 · 주문 · 이름 배지 · 복주머니 · 빼꼼 운알이.
 * 이미지 저장(html2canvas)용이라 View · Text · 선형 그라데이션 · SVG만, 회전 없이. 색은 모드와 무관하게 고정.
 */
const C = { red: '#C9402B', brown: '#6B2A17', ink: '#2B1D14', gold: '#EBC27A', goldSoft: '#F6DDA8', cream: '#FFF9EA' };
const KEEP = (Platform.OS === 'web' ? { wordBreak: 'keep-all' } : {}) as object;
export const TALISMAN_W = 320;

/** 뭉게구름 한 덩이 */
function Cloud({ x, y, s = 1, fill = '#FFFFFF', op = 0.9 }: { x: number; y: number; s?: number; fill?: string; op?: number }) {
  return (
    <G opacity={op}>
      <Ellipse cx={x} cy={y} rx={34 * s} ry={14 * s} fill={fill} />
      <Circle cx={x - 12 * s} cy={y - 8 * s} r={14 * s} fill={fill} />
      <Circle cx={x + 8 * s} cy={y - 13 * s} r={18 * s} fill={fill} />
      <Circle cx={x + 24 * s} cy={y - 4 * s} r={11 * s} fill={fill} />
    </G>
  );
}

/** 액자 귀퉁이의 격자(회문) 문양 — 귀퉁이마다 좌표를 뒤집어 그린다 */
function Fret({ fx, fy }: { fx: boolean; fy: boolean }) {
  const X = (v: number) => (fx ? 30 - v : v), Y = (v: number) => (fy ? 30 - v : v);
  const d = `M${X(3)} ${Y(28)} L${X(3)} ${Y(3)} L${X(28)} ${Y(3)} M${X(8)} ${Y(22)} L${X(8)} ${Y(8)} L${X(22)} ${Y(8)} M${X(13)} ${Y(13)} L${X(18)} ${Y(13)} L${X(18)} ${Y(18)} L${X(13)} ${Y(18)} Z`;
  const pos = { position: 'absolute' as const, [fy ? 'bottom' : 'top']: 6, [fx ? 'right' : 'left']: 6 };
  return <Svg width={30} height={30} style={pos}><Path d={d} stroke={C.gold} strokeWidth={1.6} fill="none" strokeLinejoin="round" /></Svg>;
}

/** 복주머니 */
function Pouch({ size = 64 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64">
      <Defs>
        <RadialGradient id="pouch" cx="40%" cy="40%" r="70%">
          <Stop offset="0" stopColor="#FFB067" />
          <Stop offset="1" stopColor="#E8642F" />
        </RadialGradient>
      </Defs>
      {/* 몸통 */}
      <Path d="M18 22 C8 30 6 48 16 56 C24 62 40 62 48 56 C58 48 56 30 46 22 Z" fill="url(#pouch)" />
      <Path d="M20 22 L44 22 L41 17 L23 17 Z" fill="#D9542A" />
      {/* 리본 */}
      <Path d="M32 18 C24 8 14 10 18 17 C21 21 28 19 32 18 Z" fill="#E43D3D" />
      <Path d="M32 18 C40 8 50 10 46 17 C43 21 36 19 32 18 Z" fill="#E43D3D" />
      <Path d="M30 19 L24 30 L28 30 Z M34 19 L40 30 L36 30 Z" fill="#C82E2E" />
      <Circle cx={32} cy={18} r={3.5} fill="#F25A4A" />
      {/* 福 */}
      <Circle cx={32} cy={41} r={11} fill="#FFE08A" />
      <Circle cx={32} cy={41} r={11} fill="none" stroke="#E9A93C" strokeWidth={1.2} />
      <SvgText x={32} y={45.5} fontSize={13} fontWeight="800" fill={C.red} textAnchor="middle">福</SvgText>
      <Ellipse cx={22} cy={34} rx={3} ry={5} fill="#FFFFFF" opacity={0.35} />
    </Svg>
  );
}

export type TalismanData = { hanja: string; keyword: string; mantra: string; score: number };

const TalismanCard = forwardRef<View, { t: TalismanData; name: string; dateLabel: string }>(({ t, name, dateLabel }, ref) => {
  // 주문은 가운데 띄어쓰기에서 나눠 두 줄로 균형 있게(한 줄에 다 들어가면 한 줄)
  const w = t.mantra.split(' ');
  let cut = 1, best = Infinity;
  for (let i = 1; i < w.length; i++) { const diff = Math.abs(w.slice(0, i).join(' ').length - w.slice(i).join(' ').length); if (diff < best) { best = diff; cut = i; } }
  const mantra = t.mantra.length > 15 ? `${w.slice(0, cut).join(' ')}\n${w.slice(cut).join(' ')}` : t.mantra;

  return (
    <View ref={ref} collapsable={false} style={s.card}>
      <LinearGradient colors={['#FFF8E2', '#FFF0C9', '#FDE7B4']} locations={[0, 0.55, 1]} start={{ x: 0.5, y: 0 }} end={{ x: 0.5, y: 1 }} style={StyleSheet.absoluteFill} />

      {/* 배경: 해 · 구름 · 반짝이 */}
      <Svg width={TALISMAN_W} height={TALISMAN_W * 1.36} style={StyleSheet.absoluteFill} viewBox={`0 0 ${TALISMAN_W} ${TALISMAN_W * 1.36}`}>
        <Defs>
          <RadialGradient id="sun" cx="50%" cy="50%" r="50%">
            <Stop offset="0" stopColor="#FFE3A1" />
            <Stop offset="1" stopColor="#F9D27E" />
          </RadialGradient>
        </Defs>
        <Circle cx={292} cy={76} r={34} fill="url(#sun)" opacity={0.85} />
        <Cloud x={268} y={118} s={0.9} />
        <Cloud x={24} y={226} s={0.8} fill="#FFF6DD" />
        <Cloud x={306} y={262} s={0.7} fill="#FFF6DD" />
        <Path d="M10 120 Q30 112 54 120" stroke="#F3D79C" strokeWidth={2} fill="none" strokeLinecap="round" />
        <Path d="M268 300 Q288 292 312 300" stroke="#F3D79C" strokeWidth={2} fill="none" strokeLinecap="round" />
        <Path d="M40 60 l2 5 5 2 -5 2 -2 5 -2 -5 -5 -2 5 -2 Z" fill="#F7C96A" />
        <Path d="M282 168 l1.5 4 4 1.5 -4 1.5 -1.5 4 -1.5 -4 -4 -1.5 4 -1.5 Z" fill="#F7C96A" />
        <Circle cx={60} cy={300} r={2} fill="#F7C96A" />
        {/* 바닥 구름 */}
        <Cloud x={70} y={424} s={1.5} />
        <Cloud x={190} y={432} s={1.3} />
        <Cloud x={300} y={420} s={1.2} />
        <Rect x={0} y={426} width={TALISMAN_W} height={30} fill="#FFFFFF" opacity={0.9} />
      </Svg>

      <Text style={s.date}>{dateLabel}</Text>

      {/* 금빛 액자 속 한자 */}
      <View style={s.glow}>
        <View style={s.frame}>
          <View style={s.frameIn}>
            <LinearGradient colors={['#FFFDF6', '#FFF6E2']} style={[StyleSheet.absoluteFill, { borderRadius: 14 }]} />
            <Fret fx={false} fy={false} /><Fret fx fy={false} /><Fret fx={false} fy /><Fret fx fy />
            <Text style={s.hanja}>{t.hanja}</Text>
          </View>
        </View>
      </View>

      <Text style={[s.mantra, KEEP]}>{mantra}</Text>
      <View style={s.pill}><Text style={s.pillText}>{name} · 오늘의 {t.keyword}</Text></View>

      {/* 복주머니 · 빼꼼 운알이 */}
      <View style={s.pouch}><Pouch size={86} /></View>
      <View style={s.peek}><Mascot size={136} face="look" shadow={false} /></View>
      <Text style={s.brand}>운픽</Text>
    </View>
  );
});

export default TalismanCard;

const s = StyleSheet.create({
  card: { width: TALISMAN_W, height: TALISMAN_W * 1.36, borderRadius: 24, overflow: 'hidden', alignItems: 'center', paddingTop: 26, backgroundColor: '#FFF3D2' },
  date: { fontFamily: fonts.display, fontSize: 15, fontWeight: '700', color: C.brown, letterSpacing: -0.2 },

  glow: { marginTop: 18, padding: 6, borderRadius: 26, backgroundColor: '#FFE9B866' },
  frame: { padding: 3, borderRadius: 21, borderWidth: 2, borderColor: C.goldSoft, backgroundColor: '#FFF6DF' },
  frameIn: { width: 168, height: 196, borderRadius: 16, borderWidth: 1.5, borderColor: C.gold, alignItems: 'center', justifyContent: 'center' },
  hanja: { fontFamily: fonts.serif, fontSize: 112, lineHeight: 130, fontWeight: '800', color: C.red, letterSpacing: -2 },

  mantra: { fontFamily: fonts.display, fontSize: 17, lineHeight: 25, fontWeight: '800', color: C.ink, textAlign: 'center', marginTop: 18, paddingHorizontal: 28, letterSpacing: -0.4 },
  pill: { marginTop: 10, paddingHorizontal: 14, paddingVertical: 5, borderRadius: 999, borderWidth: 1.2, borderColor: C.red, backgroundColor: '#FFFFFF99' },
  pillText: { fontSize: 13, fontWeight: '700', color: C.red },

  pouch: { position: 'absolute', left: 4, bottom: 8 },
  peek: { position: 'absolute', right: -30, bottom: -40 },
  brand: { position: 'absolute', bottom: 12, alignSelf: 'center', fontSize: 11, fontWeight: '800', color: '#C9A15E', letterSpacing: 1 },
});
