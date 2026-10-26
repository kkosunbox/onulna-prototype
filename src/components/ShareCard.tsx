import React, { forwardRef } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, Path } from 'react-native-svg';
import BrandMark from './BrandMark';
import Mascot, { MascotFace, MascotPalette, MascotProp } from './Mascot';
import { ShareSpec } from '../services/share/shareSpecs';
import { parseISO } from '../utils/date';
import { fonts } from '../theme/typography';

/**
 * 공유 카드 — 인스타 스토리 9:16.
 * 주인공은 하나: 하늘 위 운알이와 큰 숫자. 나머지는 흰 시트 한 장에 여백과 얇은 선으로만 나눈다.
 *  ① 하늘: 로고 · 날짜 / 운알이 / 큰 숫자 + 한 줄 라벨
 *  ② 흰 시트: 한 줄 결과 · 숫자 칸(선으로 구분) · 잠긴 이야기 한 줄
 *  ③ 시트 아래: 질문 + 버튼
 * 캡처(html2canvas)용으로 View · Text · 선형 그라데이션 · SVG만, 색은 모드와 무관하게 고정.
 */
const C = { ink: '#191C22', sub: '#4A505B', mute: '#8A909B', line: '#ECEFF3', card: '#FFFFFF', blue: '#2F8CF0' };
const KEEP = (Platform.OS === 'web' ? { wordBreak: 'keep-all' } : {}) as object;
export const CARD_W = 320;

function mascotFor(kind: string): { palette: MascotPalette; face: MascotFace; prop: MascotProp } {
  if (kind.includes('배우자') || kind.includes('궁합')) return { palette: 'pink', face: 'happy', prop: 'heart' };
  if (kind.includes('속마음')) return { palette: 'peach', face: 'wink', prop: 'heart' };
  if (kind.includes('MBTI')) return { palette: 'lavender', face: 'sleepy', prop: 'music' };
  if (kind.includes('전생')) return { palette: 'peach', face: 'curious', prop: 'question' };
  if (kind.includes('캐릭터')) return { palette: 'lavender', face: 'look', prop: 'none' };
  if (kind.includes('부적')) return { palette: 'mint', face: 'happy', prop: 'clover' };
  return { palette: 'classic', face: 'look', prop: 'none' };
}

const ShareCard = forwardRef<View, { spec: ShareSpec; today: string }>(({ spec, today }, ref) => {
  const { y, m, d } = parseISO(today);
  const stats = spec.stats.slice(0, 4);
  const big = spec.big;
  return (
    <View ref={ref} collapsable={false} style={s.card}>
      <LinearGradient colors={['#4FAEF5', '#8CCBFF', '#CFE9FF']} locations={[0, 0.45, 1]} start={{ x: 0.5, y: 0 }} end={{ x: 0.5, y: 1 }} style={StyleSheet.absoluteFill} />
      {/* 아주 옅은 구름 한 덩이와 별 두 개만 */}
      <View pointerEvents="none" style={s.deco}>
        <Svg width={CARD_W} height={300} viewBox="0 0 320 300">
          {[[118, 176, 22], [150, 168, 28], [186, 174, 24], [210, 182, 16], [100, 184, 15]].map(([x, yy, r], i) => <Circle key={i} cx={x} cy={yy} r={r} fill="#FFFFFF" fillOpacity={0.6} />)}
          <Path d="M58 120 L60.5 126 L66 128.5 L60.5 131 L58 137 L55.5 131 L50 128.5 L55.5 126 Z" fill="#FFFFFF" fillOpacity={0.9} />
          <Path d="M262 92 L264 97 L269 99 L264 101 L262 106 L260 101 L255 99 L260 97 Z" fill="#FFE27A" />
        </Svg>
      </View>

      {/* ① 하늘 */}
      <View style={s.top}>
        <BrandMark size={24} />
        <Text style={s.date}>{y}.{String(m).padStart(2, '0')}.{String(d).padStart(2, '0')}</Text>
      </View>
      <View style={s.hero}>
        <View><Mascot size={132} shadow={false} {...mascotFor(spec.kind)} /></View>
        {big ? (
          <View style={s.scoreRow}>
            <Text style={s.score}>{big.value}</Text>
            {big.unit ? <Text style={s.unit}>{big.unit}</Text> : null}
          </View>
        ) : null}
        <Text style={s.label}>{big ? big.label : spec.kind}</Text>
      </View>

      {/* ② 흰 시트 */}
      <View style={s.sheet}>
        <Text style={s.who} numberOfLines={1}>{spec.eyebrow}</Text>
        <Text style={[s.head, spec.headline.length > 22 && s.headSm, KEEP]} numberOfLines={3}>{spec.headline}</Text>

        <View style={s.stats}>
          {stats.map(([k, v], i) => (
            <View key={k} style={[s.stat, i > 0 && s.statLine]}>
              <Text style={[s.statV, v.length > 5 && { fontSize: 13 }]} numberOfLines={1}>{v}</Text>
              <Text style={s.statK} numberOfLines={1}>{k}</Text>
            </View>
          ))}
        </View>

        {spec.teaser ? (
          <View style={s.teaser}>
            <View style={s.lockDot} />
            <Text style={s.teaserText} numberOfLines={1}>{spec.teaser}</Text>
            <Text style={s.teaserOpen}>앱에서 보기</Text>
          </View>
        ) : null}

        {/* ③ 질문 + 버튼 */}
        <View style={s.foot}>
          <View style={{ flex: 1 }}>
            <Text style={[s.hook, KEEP]} numberOfLines={2}>{spec.hook}</Text>
            <Text style={s.url}>생일만 넣으면 30초 · 운픽</Text>
          </View>
          <View style={s.cta}><Text style={s.ctaText}>나도 해보기</Text></View>
        </View>
      </View>
    </View>
  );
});

export default ShareCard;

const s = StyleSheet.create({
  card: { width: CARD_W, aspectRatio: 9 / 16, overflow: 'hidden', backgroundColor: '#8CCBFF' },
  deco: { position: 'absolute', left: 0, top: 0 },
  top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 18 },
  date: { fontSize: 11, fontWeight: '700', color: 'rgba(255,255,255,0.92)', letterSpacing: 0.6 },

  hero: { alignItems: 'center', marginTop: 8 },
  scoreRow: { flexDirection: 'row', alignItems: 'flex-end', marginTop: 10 },
  score: { fontFamily: fonts.display, fontSize: 56, lineHeight: 60, fontWeight: '800', letterSpacing: -2, color: '#FFFFFF' },
  unit: { fontSize: 18, fontWeight: '800', color: '#FFFFFF', marginLeft: 2, marginBottom: 9 },
  label: { fontSize: 13, fontWeight: '700', color: 'rgba(255,255,255,0.92)', marginTop: 2 },

  sheet: { position: 'absolute', left: 0, right: 0, bottom: 0, paddingHorizontal: 22, paddingTop: 22, paddingBottom: 18, borderTopLeftRadius: 28, borderTopRightRadius: 28, backgroundColor: C.card },
  who: { fontSize: 11, fontWeight: '700', color: C.blue },
  head: { fontFamily: fonts.display, fontSize: 22, lineHeight: 30, fontWeight: '800', letterSpacing: -0.7, color: C.ink, marginTop: 6 },
  headSm: { fontSize: 18, lineHeight: 26, letterSpacing: -0.5 },

  stats: { flexDirection: 'row', marginTop: 16, paddingVertical: 12, borderTopWidth: 1, borderBottomWidth: 1, borderColor: C.line },
  stat: { flex: 1, alignItems: 'center' },
  statLine: { borderLeftWidth: 1, borderLeftColor: C.line },
  statV: { fontFamily: fonts.display, fontSize: 18, lineHeight: 24, fontWeight: '800', color: C.ink },
  statK: { fontSize: 11, fontWeight: '600', color: C.mute, marginTop: 1 },

  teaser: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 12 },
  lockDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: C.blue },
  teaserText: { flex: 1, fontSize: 13, fontWeight: '600', color: C.sub },
  teaserOpen: { fontSize: 11, fontWeight: '700', color: C.blue },

  foot: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 16 },
  hook: { fontFamily: fonts.display, fontSize: 15, lineHeight: 22, fontWeight: '800', letterSpacing: -0.3, color: C.ink },
  url: { fontSize: 11, fontWeight: '600', color: C.mute, marginTop: 2 },
  cta: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 999, backgroundColor: C.ink },
  ctaText: { fontSize: 13, fontWeight: '800', color: '#FFFFFF' },
});
