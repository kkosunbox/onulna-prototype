import React, { forwardRef } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import BrandMark from './BrandMark';
import Mascot from './Mascot';
import { ShareSpec } from '../services/share/shareSpecs';
import { parseISO } from '../utils/date';
import { fonts } from '../theme/typography';

/**
 * 공유 카드 — 인스타 스토리 비율(9:16). 앱과 같은 파스텔 디자인:
 * 살구·하늘·분홍 그라데이션 바탕 · 흰 카드(반경 22) · 코랄 눈썹 · 굵은 고딕 제목 · 파스텔 아이콘 칸 ·
 * 숫자 칸 · 가려 둔 "잠긴 이야기"로 호기심을 남기고, 마지막 질문과 검정 알약으로 앱에 부른다.
 * 모든 간격은 8pt(4pt) 단위. 캡처(html2canvas)에서도 그대로 나오도록 View·Text·선형 그라데이션만 쓴다.
 */
const C = {
  bg: '#FFFFFF', ink: '#191C22', sub: '#4A505B', mute: '#7D8490', line: '#E8ECF2', card: '#FFFFFF',
  accent: '#2F8CF0', accentBg: '#E7F2FF', lav: '#1E2128', violet: '#D6F07A',
  glowA: '#8CCBFF', glowB: '#D7EEFF', glowC: '#E7F2FF',
};

/** 웹에서 한국어가 단어 중간에서 끊기지 않게 */
const KEEP = (Platform.OS === 'web' ? { wordBreak: 'keep-all' } : {}) as object;

/** 가림막 막대 너비 — 글자처럼 보이게 길이를 섞는다 */
const BARS = [64, 40, 88, 28, 52, 36];

export const CARD_W = 320;

const ShareCard = forwardRef<View, { spec: ShareSpec; today: string }>(({ spec, today }, ref) => {
  const { y, m, d } = parseISO(today);
  const longHead = spec.headline.length > 18;
  return (
    <View ref={ref} collapsable={false} style={s.card}>
      {/* 바탕 빛: 위는 살구 → 하늘, 아래는 분홍 */}
      <LinearGradient colors={[C.glowA, C.glowB, C.bg]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={s.glowTop} />
      <LinearGradient colors={[C.glowC + '00', C.glowC]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={s.glowBottom} />

      {/* 머리 */}
      <View style={s.mast}>
        <BrandMark size={15} fg={C.ink} />
        <View style={s.datePill}><Text style={s.date}>{y}.{String(m).padStart(2, '0')}.{String(d).padStart(2, '0')}</Text></View>
      </View>

      <View style={s.sheet}>
        <View style={s.heroRow}>
          <View style={{ flex: 1 }}>
            <Text style={s.kind}>{spec.kind}</Text>
            <Text style={s.eyebrow} numberOfLines={1}>{spec.eyebrow}</Text>
          </View>
          <Mascot size={64} face="look" prop="sparkle" shadow={false} />
        </View>
        <Text style={[longHead ? s.headSm : s.head, KEEP]} numberOfLines={3}>{spec.headline}</Text>
        {spec.sub ? <Text style={[s.sub, KEEP]} numberOfLines={spec.big ? 1 : 2}>{spec.sub}</Text> : null}

        <View style={{ flex: 1 }} />

        {spec.big ? (
          <View style={s.big}>
            <Text style={s.bigVal}>{spec.big.value}<Text style={s.bigUnit}>{spec.big.unit}</Text></Text>
            <View style={s.bigPill}><Text style={s.bigLabel}>{spec.big.label}</Text></View>
          </View>
        ) : null}

        {/* 숫자 칸 */}
        <View style={s.stats}>
          {spec.stats.map(([k, v]) => (
            <View key={k} style={s.stat}>
              <Text style={s.statK} numberOfLines={1}>{k}</Text>
              <Text style={[s.statV, v.length > 7 ? { fontSize: 13, lineHeight: 19 } : v.length > 5 ? { fontSize: 13 } : null]} numberOfLines={1}>{v}</Text>
            </View>
          ))}
        </View>

        {/* 잠긴 이야기 */}
        {spec.teaser ? (
          <View style={s.teaser}>
            <View style={s.teaserHead}>
              <View style={s.lock}><Text style={s.lockText}>秘</Text></View>
              <Text style={s.teaserLabel} numberOfLines={1}>{spec.teaser}</Text>
              <Text style={s.teaserOpen}>앱에서 열기</Text>
            </View>
            <View style={s.bars}>
              {BARS.map((w, i) => <View key={i} style={[s.bar, { width: w, opacity: 0.55 + (i % 3) * 0.12 }]} />)}
            </View>
          </View>
        ) : null}
      </View>

      {/* 질문 */}
      <View style={s.foot}>
        <Text style={[s.hook, KEEP]} numberOfLines={2}>{spec.hook}</Text>
        <View style={s.footRow}>
          <Text style={s.url}>생일만 넣으면 30초 · 운픽</Text>
          <View style={s.cta}><Text style={s.ctaText}>내 결과 보기 →</Text></View>
        </View>
      </View>
    </View>
  );
});

export default ShareCard;

const s = StyleSheet.create({
  card: { width: CARD_W, aspectRatio: 9 / 16, paddingHorizontal: 16, paddingTop: 18, paddingBottom: 16, overflow: 'hidden', backgroundColor: C.bg },
  glowTop: { position: 'absolute', left: 0, right: 0, top: 0, height: 300 },
  glowBottom: { position: 'absolute', left: 0, right: 0, bottom: 0, height: 240 },
  mast: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  datePill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.8)' },
  date: { fontSize: 11, fontWeight: '700', color: C.sub, letterSpacing: 0.3 },
  sheet: { flex: 1, marginTop: 12, padding: 16, borderRadius: 18, backgroundColor: C.card, shadowColor: '#2F6FB0', shadowOpacity: 0.12, shadowRadius: 16, shadowOffset: { width: 0, height: 6 } },
  heroRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  kind: { fontSize: 11, fontWeight: '700', letterSpacing: 1.8, color: C.accent },
  eyebrow: { fontSize: 13, fontWeight: '600', color: C.mute, marginTop: 6 },
  ico: { width: 48, height: 48, borderRadius: 14, backgroundColor: C.accentBg, alignItems: 'center', justifyContent: 'center' },
  icoText: { fontFamily: fonts.serif, fontSize: 24, lineHeight: 32, fontWeight: '800', color: C.accent },
  head: { fontFamily: fonts.display, fontSize: 24, lineHeight: 32, fontWeight: '800', letterSpacing: -0.6, marginTop: 12, color: C.ink },
  headSm: { fontFamily: fonts.display, fontSize: 24, lineHeight: 32, fontWeight: '800', letterSpacing: -0.6, marginTop: 12, color: C.ink },
  sub: { fontSize: 13, lineHeight: 19, marginTop: 8, color: C.mute },
  big: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' },
  bigVal: { fontFamily: fonts.display, fontSize: 40, lineHeight: 46, fontWeight: '800', letterSpacing: -1.2, color: C.ink },
  bigUnit: { fontSize: 15, fontWeight: '700', letterSpacing: 0, color: C.sub },
  bigPill: { marginBottom: 10, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, backgroundColor: C.accent },
  bigLabel: { fontSize: 11, fontWeight: '700', color: '#FFFFFF' },
  stats: { flexDirection: 'row', gap: 6, marginTop: 10 },
  stat: { flex: 1, paddingVertical: 8, paddingHorizontal: 8, borderRadius: 12, backgroundColor: '#F3F5F8' },
  statK: { fontSize: 11, fontWeight: '600', color: C.mute },
  statV: { fontFamily: fonts.display, fontSize: 15, lineHeight: 23, fontWeight: '700', marginTop: 2, color: C.ink },
  teaser: { marginTop: 10, borderRadius: 14, padding: 10, backgroundColor: C.lav },
  teaserHead: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  lock: { width: 20, height: 20, borderRadius: 7, backgroundColor: C.violet, alignItems: 'center', justifyContent: 'center' },
  lockText: { fontFamily: fonts.serif, fontSize: 11, lineHeight: 15, fontWeight: '700', color: '#1E2128' },
  teaserLabel: { flex: 1, fontSize: 13, fontWeight: '700', color: '#FFFFFF' },
  teaserOpen: { fontSize: 11, fontWeight: '700', color: C.violet },
  bars: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginTop: 8 },
  bar: { height: 8, borderRadius: 4, backgroundColor: C.violet },
  foot: { marginTop: 14, paddingHorizontal: 4 },
  hook: { fontFamily: fonts.display, fontSize: 18, lineHeight: 26, fontWeight: '700', letterSpacing: -0.4, color: C.ink },
  footRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
  url: { fontSize: 11, fontWeight: '600', color: C.mute },
  cta: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: 999, backgroundColor: C.ink },
  ctaText: { fontSize: 11, fontWeight: '700', color: '#FFFFFF' },
});
