import React, { forwardRef } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, Defs, LinearGradient as SvgLinear, Stop } from 'react-native-svg';
import Mascot from './Mascot';
import { fonts } from '../theme/typography';

/**
 * 부적 카드 — 굿즈처럼 소장하고 싶은 한 장.
 * 테마 색 그라데이션 위 칠보 문양 · 금박 도장 링 속 큰 한자 · 지켜 주는 운알이 · 이름(영문) · 주문 · To/From.
 * 내 부적과 선물 부적이 같은 카드를 쓴다.
 * 이미지 저장(html2canvas)용이라 View · Text · 선형 그라데이션 · SVG만, 회전 없이. 색은 모드와 무관하게 고정.
 */
export type CharmTheme = { from: string; to: string; deep: string };
export type CharmData = { hanja: string; name: string; en: string; mantra: string; theme: CharmTheme };

export const TALISMAN_W = 320;
const H = Math.round(TALISMAN_W * 1.5);
const KEEP = (Platform.OS === 'web' ? { wordBreak: 'keep-all' } : {}) as object;
const SEAL = 188;

/** 칠보 문양: 겹친 원을 격자로 — 아주 옅게 */
function Chilbo() {
  const r = 22, cols = Math.ceil(TALISMAN_W / r) + 1, rows = Math.ceil(H / r) + 1;
  const dots: React.ReactNode[] = [];
  for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) dots.push(<Circle key={`${x}-${y}`} cx={x * r} cy={y * r} r={r} stroke="#FFFFFF" strokeWidth={0.8} fill="none" />);
  return <Svg width={TALISMAN_W} height={H} style={StyleSheet.absoluteFill} opacity={0.09}>{dots}</Svg>;
}

/** 금박 도장 링: 금빛 그라데이션 테두리 + 촘촘한 눈금 */
function GoldRing() {
  const c = SEAL / 2, ticks: React.ReactNode[] = [];
  for (let i = 0; i < 48; i++) {
    const a = (i / 48) * Math.PI * 2, rr = c - 9;
    ticks.push(<Circle key={i} cx={c + Math.cos(a) * rr} cy={c + Math.sin(a) * rr} r={i % 4 === 0 ? 1.8 : 1} fill="#8A5A12" opacity={0.55} />);
  }
  return (
    <Svg width={SEAL} height={SEAL} style={StyleSheet.absoluteFill}>
      <Defs>
        <SvgLinear id="gold" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#FFF1C1" />
          <Stop offset="0.35" stopColor="#E9B75A" />
          <Stop offset="0.6" stopColor="#FFE7A6" />
          <Stop offset="1" stopColor="#C98E2E" />
        </SvgLinear>
      </Defs>
      <Circle cx={c} cy={c} r={c - 1} fill="url(#gold)" />
      {ticks}
      <Circle cx={c} cy={c} r={c - 16} fill="#FFF8EA" />
      <Circle cx={c} cy={c} r={c - 21} stroke="#E2B865" strokeWidth={1} fill="none" />
    </Svg>
  );
}

const TalismanCard = forwardRef<View, { c: CharmData; to: string; from: string; dateLabel: string; no: string }>(({ c, to, from, dateLabel, no }, ref) => {
  // 주문은 가운데 띄어쓰기에서 나눠 두 줄로 균형 있게
  const w = c.mantra.split(' ');
  let cut = 1, best = Infinity;
  for (let i = 1; i < w.length; i++) { const diff = Math.abs(w.slice(0, i).join(' ').length - w.slice(i).join(' ').length); if (diff < best) { best = diff; cut = i; } }
  const mantra = c.mantra.length > 14 ? `${w.slice(0, cut).join(' ')}\n${w.slice(cut).join(' ')}` : c.mantra;

  return (
    <View ref={ref} collapsable={false} style={s.card}>
      <LinearGradient colors={[c.theme.from, c.theme.to]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
      <Chilbo />
      {/* 위쪽 빛 */}
      <LinearGradient colors={['#FFFFFF38', '#FFFFFF00']} start={{ x: 0.5, y: 0 }} end={{ x: 0.5, y: 0.55 }} style={StyleSheet.absoluteFill} />
      <View style={s.border} />

      <View style={s.top}>
        <Text style={s.topText}>運PICK · TALISMAN</Text>
        <Text style={s.topText}>No.{no}</Text>
      </View>
      <Text style={s.date}>{dateLabel}</Text>

      {/* 금박 도장 속 한자 + 지켜 주는 운알이 */}
      <View style={s.sealWrap}>
        <View style={s.sealGlow} />
        <View style={s.seal}>
          <GoldRing />
          <Text style={[s.hanja, { color: c.theme.deep }]}>{c.hanja}</Text>
        </View>
        <View style={s.guard}><Mascot size={66} face="happy" prop="sparkle" shadow={false} /></View>
      </View>

      <Text style={s.en}>{c.en}</Text>
      <Text style={s.name}>{c.name}</Text>
      <Text style={[s.mantra, KEEP]}>{mantra}</Text>

      <View style={s.foot}>
        <View style={s.dash} />
        <View style={s.toFrom}>
          <Text style={s.tf} numberOfLines={1}><Text style={s.tfK}>To. </Text>{to}</Text>
          <Text style={[s.tf, { textAlign: 'right' }]} numberOfLines={1}><Text style={s.tfK}>From. </Text>{from}</Text>
        </View>
      </View>
    </View>
  );
});

export default TalismanCard;

const s = StyleSheet.create({
  card: { width: TALISMAN_W, height: H, borderRadius: 24, overflow: 'hidden', alignItems: 'center', paddingTop: 22, paddingHorizontal: 24 },
  border: { position: 'absolute', top: 9, left: 9, right: 9, bottom: 9, borderRadius: 17, borderWidth: 1, borderColor: '#FFFFFF59' },

  top: { alignSelf: 'stretch', flexDirection: 'row', justifyContent: 'space-between' },
  topText: { fontSize: 11, fontWeight: '800', color: '#FFFFFFB3', letterSpacing: 1.2 },
  date: { fontSize: 13, fontWeight: '700', color: '#FFFFFFE6', marginTop: 10 },

  sealWrap: { width: SEAL + 20, height: SEAL + 8, alignItems: 'center', justifyContent: 'center', marginTop: 10 },
  sealGlow: { position: 'absolute', width: SEAL + 20, height: SEAL + 20, borderRadius: (SEAL + 20) / 2, backgroundColor: '#FFFFFF26' },
  seal: { width: SEAL, height: SEAL, alignItems: 'center', justifyContent: 'center' },
  hanja: { fontFamily: fonts.serif, fontSize: 92, lineHeight: 108, fontWeight: '800', letterSpacing: -2 },
  guard: { position: 'absolute', right: -8, bottom: -10 },

  en: { fontSize: 11, fontWeight: '800', color: '#FFFFFFB3', letterSpacing: 3, marginTop: 18 },
  name: { fontFamily: fonts.display, fontSize: 24, lineHeight: 32, fontWeight: '800', color: '#FFFFFF', letterSpacing: -0.6, marginTop: 2 },
  mantra: { fontSize: 15, lineHeight: 23, fontWeight: '600', color: '#FFFFFFE6', textAlign: 'center', marginTop: 8 },

  foot: { alignSelf: 'stretch', marginTop: 'auto', paddingBottom: 24 },
  dash: { borderTopWidth: 1, borderStyle: 'dashed', borderColor: '#FFFFFF73', marginBottom: 12 },
  toFrom: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  tf: { flex: 1, fontFamily: fonts.display, fontSize: 15, fontWeight: '800', color: '#FFFFFF' },
  tfK: { fontSize: 13, fontWeight: '600', color: '#FFFFFFB3' },
});
