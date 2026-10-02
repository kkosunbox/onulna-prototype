import React, { forwardRef } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { Crescent } from './BrandMark';
import { ShareSpec } from '../services/share/shareSpecs';
import { parseISO } from '../utils/date';
import { fonts } from '../theme/typography';

/**
 * 공유 카드 — 인스타 스토리 비율(9:16). 책력(冊曆) 한 장처럼 보이도록:
 * 이중 테두리 · 제호와 호수(第 N 號) · 왼쪽 정렬 활자 · 기울어진 낙관 · 실선으로 나눈 숫자 칸 ·
 * 가려 둔 "봉인된 이야기"로 호기심을 남기고, 마지막 질문으로 보는 사람을 앱으로 부른다.
 * 모든 간격은 8pt 단위.
 */
export type CardTheme = 'paper' | 'ink' | 'red';
export const CARD_THEMES: [CardTheme, string][] = [['paper', '한지'], ['ink', '먹'], ['red', '주홍']];

const T: Record<CardTheme, { bg: string; ink: string; mute: string; line: string; accent: string; stamp: string; wm: string; bar: string }> = {
  paper: { bg: '#F2ECE0', ink: '#1C1A17', mute: '#857C6E', line: '#CDBFA6', accent: '#B5432E', stamp: '#B5432E', wm: 'rgba(28,26,23,0.05)', bar: '#1C1A17' },
  ink: { bg: '#1D2130', ink: '#F2ECE0', mute: 'rgba(242,236,224,0.58)', line: 'rgba(242,236,224,0.22)', accent: '#D9B872', stamp: '#D9644C', wm: 'rgba(242,236,224,0.05)', bar: '#F2ECE0' },
  red: { bg: '#9C3323', ink: '#FBF4E8', mute: 'rgba(251,244,232,0.68)', line: 'rgba(251,244,232,0.32)', accent: '#F1D9A4', stamp: '#FBF4E8', wm: 'rgba(251,244,232,0.07)', bar: '#FBF4E8' },
};

/** 웹에서 한국어가 단어 중간에서 끊기지 않게 */
const KEEP = (Platform.OS === 'web' ? { wordBreak: 'keep-all' } : {}) as object;

/** 가림막 막대 너비 — 글자처럼 보이게 길이를 섞는다 */
const BARS = [64, 40, 88, 28, 52];

export const CARD_W = 320;

const ShareCard = forwardRef<View, { spec: ShareSpec; today: string; theme?: CardTheme }>(({ spec, today, theme = 'paper' }, ref) => {
  const c = T[theme];
  const { y, m, d } = parseISO(today);
  const doy = Math.round((Date.UTC(y, m - 1, d) - Date.UTC(y, 0, 0)) / 86400000);
  const longHead = spec.headline.length > 18;
  return (
    <View ref={ref} collapsable={false} style={[s.card, { backgroundColor: c.bg }]}>
      {/* 큰 워터마크 한자 */}
      <Text style={[s.wm, { color: c.wm }]} numberOfLines={1}>{spec.seal}</Text>

      <View style={[s.frame, { borderColor: c.line }]}>
        <View style={[s.frameIn, { borderColor: c.line }]}>
          {/* 제호 */}
          <View style={s.mast}>
            <View style={s.brand}>
              <Crescent size={14} color={c.accent} cut={c.bg} />
              <Text style={[s.brandText, { color: c.ink }]}>오늘나</Text>
            </View>
            <Text style={[s.issue, { color: c.mute }]}>第 {doy} 號 · {y}.{String(m).padStart(2, '0')}.{String(d).padStart(2, '0')}</Text>
          </View>
          <View style={[s.rule, { backgroundColor: c.ink }]} />
          <View style={[s.ruleThin, { backgroundColor: c.ink }]} />

          {/* 분류 */}
          <View style={s.kindRow}>
            <View style={[s.kindBar, { backgroundColor: c.accent }]} />
            <Text style={[s.kind, { color: c.accent }]}>{spec.kind}</Text>
          </View>

          {/* 본문 */}
          <View style={s.hero}>
            <Text style={[s.eyebrow, { color: c.mute }]} numberOfLines={1}>{spec.eyebrow}</Text>
            <Text style={[longHead ? s.headSm : s.head, { color: c.ink }, KEEP]} numberOfLines={3}>{spec.headline}</Text>
            {spec.sub ? <Text style={[s.sub, { color: c.mute }, KEEP]} numberOfLines={spec.big ? 1 : 2}>{spec.sub}</Text> : null}
            <View style={[s.stamp, { borderColor: c.stamp }]}>
              <Text style={[s.stampText, { color: c.stamp }]}>{spec.seal}</Text>
            </View>
          </View>

          <View style={{ flex: 1 }} />

          {spec.big ? (
            <View style={[s.big, { borderTopColor: c.line }]}>
              <Text style={[s.bigVal, { color: c.ink }]}>{spec.big.value}<Text style={[s.bigUnit, { color: c.mute }]}>{spec.big.unit}</Text></Text>
              <Text style={[s.bigLabel, { color: c.mute }]}>{spec.big.label}</Text>
            </View>
          ) : null}

          {/* 숫자 칸 */}
          <View style={[s.stats, { borderColor: c.line }]}>
            {spec.stats.map(([k, v], i) => (
              <View key={k} style={[s.stat, i > 0 && { borderLeftWidth: 1, borderLeftColor: c.line }]}>
                <Text style={[s.statK, { color: c.mute }]} numberOfLines={1}>{k}</Text>
                <Text style={[s.statV, { color: c.ink }, v.length > 7 ? { fontSize: 12, lineHeight: 20 } : v.length > 5 ? { fontSize: 14 } : null]} numberOfLines={1}>{v}</Text>
              </View>
            ))}
          </View>

          {/* 봉인된 이야기 */}
          {spec.teaser ? (
            <View style={[s.teaser, { borderColor: c.line }]}>
              <View style={s.teaserHead}>
                <View style={[s.lock, { borderColor: c.accent }]}><Text style={[s.lockText, { color: c.accent }]}>封</Text></View>
                <Text style={[s.teaserLabel, { color: c.ink }]} numberOfLines={1}>{spec.teaser}</Text>
              </View>
              <View style={s.bars}>
                {BARS.map((w, i) => <View key={i} style={[s.bar, { width: w, backgroundColor: c.bar }]} />)}
              </View>
            </View>
          ) : null}

          {/* 질문 */}
          <View style={s.foot}>
            <Text style={[s.hook, { color: c.ink }, KEEP]} numberOfLines={2}>{spec.hook}</Text>
            <View style={s.footRow}>
              <Text style={[s.url, { color: c.mute }]}>생일만 넣으면 30초 · onulna</Text>
              <Text style={[s.cta, { color: c.accent }]}>내 결과 보기 →</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
});

export default ShareCard;

const s = StyleSheet.create({
  card: { width: CARD_W, aspectRatio: 9 / 16, padding: 12, overflow: 'hidden' },
  wm: { position: 'absolute', right: -48, bottom: 72, fontFamily: fonts.serif, fontSize: 300, lineHeight: 320, fontWeight: '700' },
  frame: { flex: 1, borderWidth: 1, padding: 3 },
  frameIn: { flex: 1, borderWidth: 0.5, paddingHorizontal: 16, paddingTop: 16, paddingBottom: 16 },
  mast: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  brandText: { fontFamily: fonts.serif, fontSize: 15, fontWeight: '700', letterSpacing: -0.3 },
  issue: { fontSize: 9.5, fontWeight: '600', letterSpacing: 0.4 },
  rule: { height: 1.5, marginTop: 8 },
  ruleThin: { height: 0.5, marginTop: 2 },
  kindRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 12 },
  kindBar: { width: 16, height: 2 },
  kind: { fontSize: 11, fontWeight: '800', letterSpacing: 1.6 },
  hero: { marginTop: 12, paddingRight: 56 },
  eyebrow: { fontSize: 12, fontWeight: '600' },
  head: { fontFamily: fonts.serif, fontSize: 30, lineHeight: 38, fontWeight: '700', letterSpacing: -0.8, marginTop: 8 },
  headSm: { fontFamily: fonts.serif, fontSize: 22, lineHeight: 30, fontWeight: '700', letterSpacing: -0.6, marginTop: 8 },
  sub: { fontSize: 12, lineHeight: 18, marginTop: 8 },
  stamp: { position: 'absolute', right: 0, top: 0, width: 48, height: 48, borderWidth: 2, borderRadius: 4, alignItems: 'center', justifyContent: 'center', transform: [{ rotate: '-8deg' }] },
  stampText: { fontFamily: fonts.serif, fontSize: 28, lineHeight: 34, fontWeight: '700' },
  big: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', borderTopWidth: 1, paddingTop: 4, marginTop: 12 },
  bigVal: { fontFamily: fonts.serif, fontSize: 44, lineHeight: 48, fontWeight: '700', letterSpacing: -1.5 },
  bigUnit: { fontSize: 16, fontWeight: '600', letterSpacing: 0 },
  bigLabel: { fontSize: 11, fontWeight: '700', letterSpacing: 0.8, paddingBottom: 8 },
  stats: { flexDirection: 'row', borderTopWidth: 1, borderBottomWidth: 1, marginTop: 8 },
  stat: { flex: 1, paddingVertical: 6, paddingHorizontal: 8 },
  statK: { fontSize: 9.5, fontWeight: '700', letterSpacing: 0.6 },
  statV: { fontFamily: fonts.serif, fontSize: 16, lineHeight: 20, fontWeight: '700', marginTop: 2 },
  teaser: { marginTop: 12, borderWidth: 1, borderStyle: 'dashed', borderRadius: 4, padding: 8 },
  teaserHead: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  lock: { width: 18, height: 18, borderWidth: 1, borderRadius: 2, alignItems: 'center', justifyContent: 'center' },
  lockText: { fontFamily: fonts.serif, fontSize: 11, lineHeight: 14, fontWeight: '700' },
  teaserLabel: { flex: 1, fontSize: 12, fontWeight: '700' },
  bars: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginTop: 8 },
  bar: { height: 8, borderRadius: 1 },
  foot: { marginTop: 12 },
  hook: { fontFamily: fonts.serif, fontSize: 17, lineHeight: 24, fontWeight: '700', letterSpacing: -0.4 },
  footRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  url: { fontSize: 10, fontWeight: '600' },
  cta: { fontSize: 11, fontWeight: '800' },
});
