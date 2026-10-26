import React, { useRef } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, Path } from 'react-native-svg';
import Screen from '../../components/Screen';
import ShareActions from '../../components/ShareActions';
import Mascot from '../../components/Mascot';
import { Clouds, Floating } from '../../components/Stage';
import { SubHead } from '../../components/premium/Kit';
import { useApp } from '../../context/AppContext';
import { todayTalisman } from '../../services/content/freeContent';
import { parseISO } from '../../utils/date';
import { colors, isDark } from '../../theme/colors';
import { fonts, radius, sansW, shadow, txt } from '../../theme/typography';
import { talismanSpec } from '../../services/share/shareSpecs';
import FriendCompare from '../../components/FriendCompare';

const PAPER = ['#FBEFC8', '#F1DBA2'] as const;
const INK = '#B2341F';
const BROWN = '#3A2410';
const KEEP = (Platform.OS === 'web' ? { wordBreak: 'keep-all' } : {}) as object;
const DOW = ['日', '月', '火', '水', '木', '金', '土'];

/** 부적 네 귀퉁이의 구름 문양 (회전 없이 귀퉁이마다 경로를 따로 그린다) */
function Corner({ at }: { at: 'tl' | 'tr' | 'bl' | 'br' }) {
  const fx = at === 'tr' || at === 'br', fy = at === 'bl' || at === 'br';
  const X = (v: number) => (fx ? 26 - v : v), Y = (v: number) => (fy ? 26 - v : v);
  const pos = { position: 'absolute' as const, [fy ? 'bottom' : 'top']: 6, [fx ? 'right' : 'left']: 6 };
  return (
    <Svg width={26} height={26} style={pos}>
      <Path d={`M${X(2)} ${Y(24)} L${X(2)} ${Y(2)} L${X(24)} ${Y(2)}`} stroke={INK} strokeWidth={1.6} fill="none" />
      <Path d={`M${X(7)} ${Y(18)} Q${X(7)} ${Y(7)} ${X(18)} ${Y(7)}`} stroke={INK} strokeWidth={1.2} fill="none" />
      <Circle cx={X(7)} cy={Y(7)} r={1.8} fill={INK} />
    </Svg>
  );
}

/** 무료: 매일 바뀌는 오늘의 부적 — 운알이가 그려서 건네주는 한 장 */
export default function TalismanScreen() {
  const { user: u, today } = useApp();
  const card = useRef<View>(null);
  if (!u) return null;
  const t = todayTalisman(u, today);
  const { y, m, d } = parseISO(today);
  const dow = DOW[new Date(y, m - 1, d).getDay()];
  const power = t.score >= 85 ? 5 : t.score >= 75 ? 4 : t.score >= 65 ? 3 : 2;
  // 주문은 가운데 띄어쓰기에서 두 줄로 나눠 부적처럼 균형 있게
  const w = t.mantra.split(' ');
  let cut = 1, best = Infinity;
  for (let i = 1; i < w.length; i++) { const diff = Math.abs(w.slice(0, i).join(' ').length - w.slice(i).join(' ').length); if (diff < best) { best = diff; cut = i; } }
  const mantra = `${w.slice(0, cut).join(' ')}\n${w.slice(cut).join(' ')}`;
  const now = new Date();
  const left = Math.max(1, 24 - now.getHours());

  return (
    <Screen title="오늘의 부적" back>
      <FriendCompare route="Talisman" spec={talismanSpec(u, today)} />

      {/* 무대: 운알이가 부적을 건넨다 */}
      <View style={s.stage}>
        <LinearGradient colors={isDark ? ['#1B3550', '#171B21'] : ['#BFE3FF', '#E4F3FF', '#F6FBFF']} start={{ x: 0.5, y: 0 }} end={{ x: 0.5, y: 1 }} style={StyleSheet.absoluteFill} />
        <Clouds />

        <View style={s.greet}>
          <View style={s.mascot}><Floating shadowWidth={56}><Mascot size={84} face="happy" prop="sparkle" shadow={false} /></Floating></View>
          <View style={{ flex: 1 }}>
            <View style={[s.bubble, shadow.card]}>
              <Text style={s.bubbleEyebrow}>운알이가 그려 왔어요</Text>
              <Text style={[s.bubbleText, KEEP]}>{u.nickname}님, 오늘은 <Text style={{ color: INK }}>{t.hanja}({t.keyword})</Text> 부적이 딱이에요!</Text>
            </View>
            <View style={s.tail} />
          </View>
        </View>

        {/* 부적 한 장 */}
        <View style={s.cardWrap}>
          <View style={s.knot}><View style={s.knotDot} /></View>
          <View ref={card} collapsable={false} style={[s.paper, shadow.hero]}>
            <LinearGradient colors={PAPER} start={{ x: 0.5, y: 0 }} end={{ x: 0.5, y: 1 }} style={StyleSheet.absoluteFill} />
            <View style={s.frameOuter}>
              <View style={s.frameInner}>
                <Corner at="tl" /><Corner at="tr" /><Corner at="bl" /><Corner at="br" />

                <Text style={s.top}>{m}月 {d}日 {dow} · 오늘의 부적</Text>

                <View style={s.hanjaWrap}>
                  <View style={s.sun} />
                  <Text style={s.hanja}>{t.hanja}</Text>
                </View>
                <Text style={s.keyword}>{t.keyword}</Text>

                <View style={s.orn}>
                  <View style={s.ornLine} /><View style={s.ornDia} /><View style={s.ornLine} />
                </View>
                <Text style={[s.mantra, KEEP]}>{mantra}</Text>

                <View style={s.foot}>
                  <View>
                    <Text style={s.for}>{u.nickname}님께</Text>
                    <Text style={s.power}>효력 {'★'.repeat(power)}<Text style={{ opacity: 0.3 }}>{'★'.repeat(5 - power)}</Text></Text>
                  </View>
                  {/* 운알이 도장 */}
                  <View style={s.seal}>
                    <View style={s.sealFace}><Mascot size={34} face="happy" shadow={false} /></View>
                    <Text style={s.sealText}>운알이 印</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>

        <View style={s.valid}>
          <Text style={s.validText}>⏳ 효력 · 오늘 자정까지 약 {left}시간</Text>
        </View>
      </View>

      <ShareActions spec={talismanSpec(u, today)} />

      <SubHead title="부적과 함께하는 행운" caption="매일 자정에 새 부적으로 바뀌어요" />
      <View style={s.lucky}>
        <View style={s.tile}>
          <View style={[s.swatch, { backgroundColor: t.colorHex }]} />
          <Text style={s.tileV} numberOfLines={1}>{t.color}</Text>
          <Text style={s.tileK}>행운의 색</Text>
        </View>
        <View style={s.tile}>
          <Text style={s.clock}>數</Text>
          <Text style={s.tileV}>{t.number}번</Text>
          <Text style={s.tileK}>행운의 숫자</Text>
        </View>
        <View style={s.tile}>
          <Text style={s.clock}>時</Text>
          <Text style={s.tileV} numberOfLines={1}>{t.time.split('~')[0]}</Text>
          <Text style={s.tileK}>~{t.time.split('~')[1] ?? ''} 까지</Text>
        </View>
      </View>
      <Text style={[txt.caption, { textAlign: 'center', marginTop: 16 }]}>휴대폰 배경화면으로 저장해 두고 하루를 시작해 보세요.</Text>
    </Screen>
  );
}

const s = StyleSheet.create({
  stage: { borderRadius: radius.xl, overflow: 'hidden', padding: 16, paddingBottom: 18 },
  greet: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  mascot: { width: 92, alignItems: 'center' },
  bubble: { paddingVertical: 12, paddingHorizontal: 14, borderRadius: 18, backgroundColor: colors.card },
  bubbleEyebrow: { ...sansW('700'), fontSize: 11, color: colors.seal },
  bubbleText: { ...txt.bodyStrong, marginTop: 2 },
  tail: { position: 'absolute', left: -8, top: 26, width: 0, height: 0, borderTopWidth: 8, borderBottomWidth: 8, borderRightWidth: 10, borderTopColor: 'transparent', borderBottomColor: 'transparent', borderRightColor: colors.card },

  cardWrap: { alignItems: 'center', marginTop: 10 },
  knot: { width: 2, height: 16, backgroundColor: INK, alignItems: 'center' },
  knotDot: { position: 'absolute', top: -5, width: 10, height: 10, borderRadius: 5, backgroundColor: INK },
  paper: { width: 264, aspectRatio: 0.64, borderRadius: 18, overflow: 'hidden', padding: 10 },
  frameOuter: { flex: 1, borderWidth: 2, borderColor: INK, borderRadius: 12, padding: 3 },
  frameInner: { flex: 1, borderWidth: 1, borderColor: INK, borderRadius: 9, alignItems: 'center', paddingHorizontal: 18, paddingTop: 20, paddingBottom: 14 },
  top: { ...sansW('700'), fontSize: 11, color: INK, letterSpacing: 0.6 },

  hanjaWrap: { alignItems: 'center', justifyContent: 'center', marginTop: 10, height: 140 },
  sun: { position: 'absolute', width: 132, height: 132, borderRadius: 66, backgroundColor: INK, opacity: 0.08 },
  hanja: { fontFamily: fonts.serif, fontSize: 104, lineHeight: 124, fontWeight: '800', color: INK },
  keyword: { ...sansW('800'), fontSize: 13, color: INK, letterSpacing: 2, marginTop: 2 },

  orn: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 12 },
  ornLine: { width: 28, height: 1.5, backgroundColor: INK, opacity: 0.6 },
  ornDia: { width: 7, height: 7, backgroundColor: INK, transform: [{ rotate: '45deg' }] },
  mantra: { fontFamily: fonts.serif, fontSize: 15, lineHeight: 23, color: BROWN, textAlign: 'center', fontWeight: '700', marginTop: 12 },

  foot: { alignSelf: 'stretch', flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 'auto' },
  for: { ...sansW('700'), fontSize: 11, color: BROWN, opacity: 0.75 },
  power: { ...sansW('800'), fontSize: 13, color: INK, marginTop: 2, letterSpacing: 1 },
  seal: { alignItems: 'center' },
  sealFace: { width: 46, height: 46, borderRadius: 12, borderWidth: 2, borderColor: INK, backgroundColor: '#FFFFFF80', alignItems: 'center', justifyContent: 'center' },
  sealText: { ...sansW('800'), fontSize: 11, color: INK, marginTop: 3 },

  valid: { alignSelf: 'center', marginTop: 14, paddingHorizontal: 12, paddingVertical: 6, borderRadius: radius.pill, backgroundColor: colors.card, ...shadow.card },
  validText: { ...sansW('700'), fontSize: 13, color: colors.inkSub },

  lucky: { flexDirection: 'row', gap: 8 },
  tile: { flex: 1, alignItems: 'center', paddingVertical: 16, paddingHorizontal: 6, borderRadius: radius.lg, backgroundColor: colors.lavenderSoft },
  swatch: { width: 36, height: 36, borderRadius: 18, borderWidth: 3, borderColor: colors.card },
  clock: { fontFamily: fonts.serif, fontSize: 24, lineHeight: 36, fontWeight: '800', color: INK },
  tileV: { ...sansW('800'), fontSize: 15, color: colors.ink, marginTop: 8 },
  tileK: { ...txt.micro, marginTop: 2 },
});
