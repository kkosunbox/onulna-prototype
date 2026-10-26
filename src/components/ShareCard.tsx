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
 * 공유 카드 — 인스타 스토리 9:16. 운픽의 얼굴이자 친구를 데려오는 카드.
 *  하늘 무대(흰 로고 · 날짜 · 구름 위 큰 운알이 · 점수 말풍선)
 *  → 흰 티켓(분류 · 한 줄 · 키워드 · 숫자 칸 · 잠긴 이야기)
 *  → 질문 + '나도 해보기'
 * 캡처(html2canvas)에서도 그대로 나오도록 View · Text · 선형 그라데이션 · SVG만 쓴다. 색은 모드와 무관하게 고정.
 */
const C = {
  ink: '#191C22', sub: '#4A505B', mute: '#7D8490', card: '#FFFFFF', soft: '#F3F5F8',
  blue: '#2F8CF0', blueBg: '#E7F2FF', dark: '#1E2128', lime: '#D6F07A',
};
const KEEP = (Platform.OS === 'web' ? { wordBreak: 'keep-all' } : {}) as object;
const BARS = [64, 40, 88, 28, 52, 36];
export const CARD_W = 320;

/** 카드 종류마다 운알이 모습 */
function mascotFor(kind: string): { palette: MascotPalette; face: MascotFace; prop: MascotProp } {
  if (kind.includes('배우자') || kind.includes('궁합')) return { palette: 'pink', face: 'happy', prop: 'heart' };
  if (kind.includes('속마음')) return { palette: 'peach', face: 'wink', prop: 'heart' };
  if (kind.includes('MBTI')) return { palette: 'lavender', face: 'sleepy', prop: 'music' };
  if (kind.includes('전생')) return { palette: 'peach', face: 'curious', prop: 'question' };
  if (kind.includes('캐릭터')) return { palette: 'lavender', face: 'look', prop: 'sparkle' };
  if (kind.includes('부적')) return { palette: 'mint', face: 'happy', prop: 'clover' };
  return { palette: 'classic', face: 'look', prop: 'sparkle' };
}

const ShareCard = forwardRef<View, { spec: ShareSpec; today: string }>(({ spec, today }, ref) => {
  const { y, m, d } = parseISO(today);
  const longHead = spec.headline.length > 20;
  const stats = spec.stats.slice(0, 4);
  return (
    <View ref={ref} collapsable={false} style={s.card}>
      {/* 하늘 무대 */}
      <LinearGradient colors={['#5BB5F6', '#9AD3FF', '#DDF0FF', '#F4FAFF']} locations={[0, 0.3, 0.62, 1]} start={{ x: 0.5, y: 0 }} end={{ x: 0.5, y: 1 }} style={StyleSheet.absoluteFill} />
      <View pointerEvents="none" style={s.sky}>
        <Svg width={CARD_W} height={230} viewBox="0 0 320 230">
          {[[30, 196, 24], [60, 186, 30], [92, 198, 22], [12, 210, 18]].map(([x, yy, r], i) => <Circle key={`l${i}`} cx={x} cy={yy} r={r} fill="#FFFFFF" fillOpacity={0.9} />)}
          {[[236, 200, 22], [266, 188, 30], [298, 200, 24], [284, 214, 20]].map(([x, yy, r], i) => <Circle key={`r${i}`} cx={x} cy={yy} r={r} fill="#FFFFFF" fillOpacity={0.9} />)}
          <Path d="M52 92 L55 99 L62 102 L55 105 L52 112 L49 105 L42 102 L49 99 Z" fill="#FFE27A" />
          <Path d="M270 78 L272 83 L277 85 L272 87 L270 92 L268 87 L263 85 L268 83 Z" fill="#FFFFFF" />
          <Path d="M248 128 L250 133 L255 135 L250 137 L248 142 L246 137 L241 135 L246 133 Z" fill="#FFE27A" />
          <Circle cx={84} cy={138} r={2.5} fill="#FFFFFF" />
        </Svg>
      </View>

      <View style={s.mast}>
        <BrandMark size={28} />
        <View style={s.datePill}><Text style={s.date}>{y}.{String(m).padStart(2, '0')}.{String(d).padStart(2, '0')}</Text></View>
      </View>

      {/* 점수 말풍선 + 운알이 */}
      <View style={s.stage}>
        {spec.big ? (
          <View style={s.bubbleWrap}>
            <View style={s.bubble}>
              <Text style={s.bigVal}>{spec.big.value}<Text style={s.bigUnit}>{spec.big.unit}</Text></Text>
              <View style={s.bigPill}><Text style={s.bigLabel}>{spec.big.label}</Text></View>
            </View>
            <View style={s.tail} />
          </View>
        ) : null}
        <View><Mascot size={spec.big ? 104 : 128} shadow={false} {...mascotFor(spec.kind)} /></View>
      </View>

      {/* 흰 티켓 */}
      <View style={s.ticket}>
        <View style={s.ticketHead}>
          <View style={s.kindPill}><Text style={s.kind}>{spec.kind}</Text></View>
          <Text style={s.eyebrow} numberOfLines={1}>{spec.eyebrow}</Text>
        </View>
        <Text style={[longHead ? s.headSm : s.head, KEEP]} numberOfLines={3}>{spec.headline}</Text>
        {spec.tags?.length ? (
          <View style={s.tags}>{spec.tags.map(t => <View key={t} style={s.tag}><Text style={s.tagText}>#{t}</Text></View>)}</View>
        ) : spec.sub ? <Text style={[s.sub, KEEP]} numberOfLines={2}>{spec.sub}</Text> : null}

        <View style={{ flex: 1 }} />
        <View style={s.stats}>
          {stats.map(([k, v]) => (
            <View key={k} style={s.stat}>
              <Text style={s.statK} numberOfLines={1}>{k}</Text>
              <Text style={[s.statV, v.length > 6 ? { fontSize: 13 } : null]} numberOfLines={1}>{v}</Text>
            </View>
          ))}
        </View>

        {spec.teaser ? (
          <View style={s.teaser}>
            <View style={s.teaserHead}>
              <View style={s.lock}><Text style={s.lockText}>秘</Text></View>
              <Text style={s.teaserLabel} numberOfLines={1}>{spec.teaser}</Text>
              <Text style={s.teaserOpen}>앱에서 열기</Text>
            </View>
            <View style={s.bars}>{BARS.map((w, i) => <View key={i} style={[s.bar, { width: w, opacity: 0.5 + (i % 3) * 0.15 }]} />)}</View>
          </View>
        ) : null}
      </View>

      {/* 질문 + 행동 */}
      <View style={s.foot}>
        <View style={{ flex: 1 }}>
          <Text style={[s.hook, KEEP]} numberOfLines={2}>{spec.hook}</Text>
          <Text style={s.url}>생일만 넣으면 30초 · 운픽</Text>
        </View>
        <View style={s.cta}><Text style={s.ctaText}>나도 해보기 →</Text></View>
      </View>
    </View>
  );
});

export default ShareCard;

const s = StyleSheet.create({
  card: { width: CARD_W, aspectRatio: 9 / 16, paddingHorizontal: 16, paddingTop: 16, paddingBottom: 14, overflow: 'hidden', backgroundColor: '#DDF0FF' },
  sky: { position: 'absolute', left: 0, top: 0 },
  mast: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  datePill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.85)' },
  date: { fontSize: 11, fontWeight: '700', color: C.sub, letterSpacing: 0.3 },

  stage: { alignItems: 'center', marginTop: 2, height: 172, justifyContent: 'flex-end' },
  bubbleWrap: { alignItems: 'center', marginBottom: -2 },
  bubble: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 14, paddingVertical: 6, borderRadius: 16, backgroundColor: C.card, shadowColor: '#2F6FB0', shadowOpacity: 0.18, shadowRadius: 10, shadowOffset: { width: 0, height: 4 } },
  tail: { width: 0, height: 0, borderLeftWidth: 7, borderRightWidth: 7, borderTopWidth: 8, borderLeftColor: 'transparent', borderRightColor: 'transparent', borderTopColor: C.card },
  bigVal: { fontFamily: fonts.display, fontSize: 32, lineHeight: 38, fontWeight: '800', letterSpacing: -1.2, color: C.ink },
  bigUnit: { fontSize: 15, fontWeight: '700', letterSpacing: 0, color: C.sub },
  bigPill: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999, backgroundColor: C.blueBg },
  bigLabel: { fontSize: 11, fontWeight: '700', color: C.blue },

  ticket: { flex: 1, marginTop: 6, padding: 16, borderRadius: 20, backgroundColor: C.card, shadowColor: '#2F6FB0', shadowOpacity: 0.12, shadowRadius: 16, shadowOffset: { width: 0, height: 6 } },
  ticketHead: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  kindPill: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999, backgroundColor: C.blueBg },
  kind: { fontSize: 11, fontWeight: '800', color: C.blue },
  eyebrow: { flex: 1, fontSize: 11, fontWeight: '600', color: C.mute },
  head: { fontFamily: fonts.display, fontSize: 24, lineHeight: 32, fontWeight: '800', letterSpacing: -0.8, marginTop: 10, color: C.ink },
  headSm: { fontFamily: fonts.display, fontSize: 18, lineHeight: 26, fontWeight: '800', letterSpacing: -0.5, marginTop: 10, color: C.ink },
  sub: { fontSize: 13, lineHeight: 19, marginTop: 8, color: C.sub },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 10 },
  tag: { paddingHorizontal: 9, paddingVertical: 4, borderRadius: 999, backgroundColor: C.soft },
  tagText: { fontSize: 11, fontWeight: '700', color: C.sub },
  stats: { flexDirection: 'row', gap: 6, paddingTop: 12 },
  stat: { flex: 1, alignItems: 'center', paddingVertical: 8, borderRadius: 12, backgroundColor: C.soft },
  statK: { fontSize: 11, fontWeight: '600', color: C.mute },
  statV: { fontFamily: fonts.display, fontSize: 18, lineHeight: 24, fontWeight: '800', color: C.ink, marginTop: 1 },
  teaser: { marginTop: 8, borderRadius: 14, padding: 10, backgroundColor: C.dark },
  teaserHead: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  lock: { width: 20, height: 20, borderRadius: 7, backgroundColor: C.lime, alignItems: 'center', justifyContent: 'center' },
  lockText: { fontSize: 11, lineHeight: 15, fontWeight: '800', color: C.dark },
  teaserLabel: { flex: 1, fontSize: 13, fontWeight: '700', color: '#FFFFFF' },
  teaserOpen: { fontSize: 11, fontWeight: '700', color: C.lime },
  bars: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginTop: 8 },
  bar: { height: 7, borderRadius: 4, backgroundColor: C.lime },

  foot: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 12, paddingHorizontal: 2 },
  hook: { fontFamily: fonts.display, fontSize: 17, lineHeight: 24, fontWeight: '800', letterSpacing: -0.5, color: C.ink },
  url: { fontSize: 11, fontWeight: '600', color: C.mute, marginTop: 2 },
  cta: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 999, backgroundColor: C.ink },
  ctaText: { fontSize: 13, fontWeight: '800', color: '#FFFFFF' },
});
