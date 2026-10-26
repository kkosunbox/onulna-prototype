import React, { forwardRef } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import BrandMark from './BrandMark';
import Mascot, { MascotFace, MascotPalette, MascotProp } from './Mascot';
import { ShareSpec } from '../services/share/shareSpecs';
import { parseISO } from '../utils/date';
import { fonts } from '../theme/typography';

/**
 * 공유 카드 — '오늘의 운알이 카드' (인스타 스토리 9:16).
 * 보는 순간 '혹' 하게: 홀로그램 테두리의 수집 카드 · 등급 배지(레전드/레어/굿/충전 데이) · 오늘의 칭호 ·
 * "올해 나의 날 중 상위 N%"(올해 365일을 같은 규칙으로 계산한 실제 순위) · "너는 상위 몇 %?" 도전.
 * 캡처(html2canvas)용으로 View · Text · 선형 그라데이션 · SVG만, 회전 없이. 색은 모드와 무관하게 고정.
 */
const C = { ink: '#191C22', sub: '#4A505B', mute: '#8A909B', line: '#E4ECF5', blue: '#2F8CF0', dark: '#1E2128', lime: '#D6F07A' };
const KEEP = (Platform.OS === 'web' ? { wordBreak: 'keep-all' } : {}) as object;
export const CARD_W = 320;

/** 등급마다 홀로그램 색 */
const HOLO: Record<string, readonly [string, string, string, string]> = {
  '레전드 데이': ['#FFD86B', '#FF9EC7', '#B8A6FF', '#7FD0FF'],
  '레어 데이': ['#B8A6FF', '#7FD0FF', '#9EF0C8', '#FFE27A'],
  '굿 데이': ['#7FD0FF', '#A9E7FF', '#C9F27A', '#7FD0FF'],
  '충전 데이': ['#C9D6E8', '#E3EBF5', '#C9D6E8', '#E3EBF5'],
};

function mascotFor(kind: string, tier?: string): { palette: MascotPalette; face: MascotFace; prop: MascotProp } {
  if (tier === '레전드 데이') return { palette: 'classic', face: 'happy', prop: 'sparkle' };
  if (kind.includes('배우자') || kind.includes('궁합')) return { palette: 'pink', face: 'happy', prop: 'heart' };
  if (kind.includes('속마음')) return { palette: 'peach', face: 'wink', prop: 'heart' };
  if (kind.includes('MBTI')) return { palette: 'lavender', face: 'sleepy', prop: 'music' };
  if (kind.includes('전생')) return { palette: 'peach', face: 'curious', prop: 'question' };
  if (kind.includes('캐릭터')) return { palette: 'lavender', face: 'look', prop: 'sparkle' };
  if (kind.includes('부적')) return { palette: 'mint', face: 'happy', prop: 'clover' };
  return { palette: 'classic', face: tier === '충전 데이' ? 'sleepy' : 'look', prop: 'sparkle' };
}

const ShareCard = forwardRef<View, { spec: ShareSpec; today: string }>(({ spec, today }, ref) => {
  const { y, m, d } = parseISO(today);
  const doy = Math.round((Date.UTC(y, m - 1, d) - Date.UTC(y, 0, 0)) / 86400000);
  const tier = spec.rank?.tier;
  const holo = HOLO[tier ?? '굿 데이'];
  const stats = spec.stats.slice(0, 4);
  const title = spec.title ?? spec.headline;

  return (
    <View ref={ref} collapsable={false} style={s.card}>
      <LinearGradient colors={['#4FAEF5', '#8CCBFF', '#D9EEFF']} locations={[0, 0.5, 1]} start={{ x: 0.5, y: 0 }} end={{ x: 0.5, y: 1 }} style={StyleSheet.absoluteFill} />

      <View style={s.top}>
        <BrandMark size={22} />
        <Text style={s.topText}>오늘의 운알이 카드</Text>
      </View>

      {/* 홀로그램 테두리의 수집 카드 */}
      <LinearGradient colors={holo} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.holo}>
        <View style={s.inner}>
          <LinearGradient colors={['#FFFFFF', '#EEF7FF']} start={{ x: 0.5, y: 0 }} end={{ x: 0.5, y: 1 }} style={StyleSheet.absoluteFill} />
          {/* 비스듬한 빛 한 줄기 */}
          <LinearGradient colors={['#FFFFFF00', '#FFFFFFB3', '#FFFFFF00']} locations={[0.38, 0.5, 0.62]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />

          <View style={s.cardHead}>
            <View style={s.tier}><Text style={s.tierText}>★ {tier ?? spec.kind}</Text></View>
            <Text style={s.no}>No.{String(doy).padStart(3, '0')} · {m}.{String(d).padStart(2, '0')}</Text>
          </View>

          <View style={s.art}>
            <LinearGradient colors={[holo[0] + '66', holo[2] + '33', '#FFFFFF00']} start={{ x: 0.5, y: 0 }} end={{ x: 0.5, y: 1 }} style={s.halo} />
            <View><Mascot size={116} shadow={false} {...mascotFor(spec.kind, tier)} /></View>
          </View>

          <Text style={s.who} numberOfLines={1}>{spec.eyebrow}{spec.title ? ' 칭호' : ''}</Text>
          <Text style={[s.title, title.length > 12 && s.titleSm, KEEP]} numberOfLines={2}>{title}</Text>

          {spec.rank ? (
            <View style={s.rank}>
              <Text style={s.rankScope}>{spec.rank.scope}</Text>
              <Text style={s.rankTop}>상위 {spec.rank.top}%</Text>
            </View>
          ) : spec.big ? (
            <View style={s.rank}>
              <Text style={s.rankScope}>{spec.big.label}</Text>
              <Text style={s.rankTop}>{spec.big.value}{spec.big.unit ?? ''}</Text>
            </View>
          ) : null}

          {spec.title ? <Text style={[s.line, KEEP]} numberOfLines={2}>“{spec.headline}”</Text> : null}

          <View style={s.stats}>
            {stats.map(([k, v], i) => (
              <View key={k} style={[s.stat, i > 0 && s.statLine]}>
                <Text style={[s.statV, v.length > 5 && { fontSize: 13 }]} numberOfLines={1}>{v}</Text>
                <Text style={s.statK} numberOfLines={1}>{k}</Text>
              </View>
            ))}
          </View>
        </View>
      </LinearGradient>

      {/* 도전 */}
      <View style={s.foot}>
        <View style={{ flex: 1 }}>
          <Text style={[s.hook, KEEP]} numberOfLines={2}>{spec.hook}</Text>
          <Text style={s.url}>생일만 넣으면 30초 · 운픽</Text>
        </View>
        <View style={s.cta}><Text style={s.ctaText}>나도 뽑아보기</Text></View>
      </View>
    </View>
  );
});

export default ShareCard;

const s = StyleSheet.create({
  card: { width: CARD_W, aspectRatio: 9 / 16, overflow: 'hidden', backgroundColor: '#8CCBFF', paddingHorizontal: 18, paddingTop: 16, paddingBottom: 16 },
  top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  topText: { fontSize: 11, fontWeight: '800', color: '#FFFFFF', letterSpacing: 0.4 },

  holo: { flex: 1, marginTop: 12, padding: 3, borderRadius: 26 },
  inner: { flex: 1, borderRadius: 23, overflow: 'hidden', paddingHorizontal: 16, paddingTop: 14, paddingBottom: 14, alignItems: 'center' },
  cardHead: { alignSelf: 'stretch', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  tier: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, backgroundColor: C.dark },
  tierText: { fontSize: 11, fontWeight: '800', color: C.lime, letterSpacing: 0.3 },
  no: { fontSize: 11, fontWeight: '700', color: C.mute, letterSpacing: 0.4 },

  art: { alignItems: 'center', justifyContent: 'center', marginTop: 6, height: 132 },
  halo: { position: 'absolute', width: 150, height: 150, borderRadius: 75 },

  who: { fontSize: 11, fontWeight: '700', color: C.blue, marginTop: 2 },
  title: { fontFamily: fonts.display, fontSize: 24, lineHeight: 32, fontWeight: '800', letterSpacing: -0.8, color: C.ink, textAlign: 'center', marginTop: 4 },
  titleSm: { fontSize: 18, lineHeight: 26, letterSpacing: -0.5 },

  rank: { alignItems: 'center', marginTop: 10 },
  rankScope: { fontSize: 11, fontWeight: '700', color: C.sub },
  rankTop: { fontFamily: fonts.display, fontSize: 40, lineHeight: 46, fontWeight: '800', letterSpacing: -1.5, color: C.blue },

  line: { fontSize: 13, lineHeight: 19, fontWeight: '600', color: C.sub, textAlign: 'center', marginTop: 10, paddingHorizontal: 6 },
  stats: { alignSelf: 'stretch', flexDirection: 'row', marginTop: 'auto', paddingTop: 10, borderTopWidth: 1, borderTopColor: C.line },
  stat: { flex: 1, alignItems: 'center' },
  statLine: { borderLeftWidth: 1, borderLeftColor: C.line },
  statV: { fontFamily: fonts.display, fontSize: 16, lineHeight: 22, fontWeight: '800', color: C.ink },
  statK: { fontSize: 11, fontWeight: '600', color: C.mute },

  foot: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 14 },
  hook: { fontFamily: fonts.display, fontSize: 17, lineHeight: 24, fontWeight: '800', letterSpacing: -0.4, color: C.ink },
  url: { fontSize: 11, fontWeight: '600', color: C.sub, marginTop: 2 },
  cta: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 999, backgroundColor: C.ink },
  ctaText: { fontSize: 13, fontWeight: '800', color: '#FFFFFF' },
});
