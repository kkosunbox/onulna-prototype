import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import { LinearGradient } from 'expo-linear-gradient';
import Ico from './Ico';
import { fonts, radius, sansW, shadow } from '../theme/typography';
import { parseISO, weekdayOf } from '../utils/date';

/**
 * 상세 화면의 머리 카드와 목록 — 파스텔 디자인 언어.
 * 관점·분야 고유색(tone.color)을 옅게 깐 그라데이션 · 영문 눈썹 · 날짜 알약 · 굵은 제목 · 알약 키워드 · 파스텔 아이콘 칸.
 */
const KEEP = (Platform.OS === 'web' ? { wordBreak: 'keep-all' } : {}) as object;
const WEEK = ['일', '월', '화', '수', '목', '금', '토'];

export function AlmanacHero({ tone, kicker, seal, eyebrow, title, today, tags, children }: {
  tone: { color: string; bg: string }; kicker: string; seal: string; eyebrow?: string; title: string; today: string;
  tags?: string[]; children?: React.ReactNode;
}) {
  const { m, d } = parseISO(today);
  return (
    <View style={[s.sheet, shadow.hero]}>
      <LinearGradient colors={[tone.bg, colors.card]} start={{ x: 0, y: 0 }} end={{ x: 0.6, y: 1 }} style={StyleSheet.absoluteFill} />
      <View style={s.mast}>
        <Text style={[s.kicker, { color: tone.color }]}>{kicker}</Text>
        <View style={s.datePill}><Text style={s.date}>{m}월 {d}일 {WEEK[weekdayOf(today)]}요일</Text></View>
      </View>
      <View style={s.body}>
        <Ico ch={seal} size={48} color={tone.color} style={{ backgroundColor: colors.card }} />
        {eyebrow ? <Text style={[s.eyebrow, { color: tone.color }]}>{eyebrow}</Text> : null}
        <Text style={[s.title, KEEP]}>{title}</Text>
        {tags?.length ? (
          <View style={s.tags}>
            {tags.map(t => (
              <View key={t} style={s.tag}><Text style={[s.tagText, { color: tone.color }]}>#{t}</Text></View>
            ))}
          </View>
        ) : null}
      </View>
      {children}
    </View>
  );
}

/** 번호 목록 — 파스텔 번호 동그라미 + 작은 라벨 + 굵은 값 */
export function Ledger({ rows, tone }: { rows: [string, string][]; tone: string }) {
  return (
    <View style={s.ledger}>
      {rows.map(([k, v], i) => (
        <View key={k} style={[s.lrow, i > 0 && s.ldash]}>
          <View style={[s.lnum, { backgroundColor: tone + '1F' }]}><Text style={[s.lnumText, { color: tone }]}>{i + 1}</Text></View>
          <View style={{ flex: 1 }}>
            <Text style={s.lk}>{k}</Text>
            <Text style={[s.lv, KEEP]}>{v}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

/** 풀이 인용 — 흰 말풍선 칸 */
export function Quote({ label, text, tone }: { label: string; text: string; tone: string }) {
  return (
    <View style={s.quote}>
      <Text style={[s.qlabel, { color: tone }]}>{label}</Text>
      <Text style={[s.qtext, KEEP]}>{text}</Text>
    </View>
  );
}

/** 도해 카드 틀 — 제목 + 그림 */
export function Figure({ title, caption, children }: { title: string; caption?: string; children: React.ReactNode }) {
  return (
    <View style={s.fig}>
      <View style={s.figHead}>
        <Text style={s.figTitle}>{title}</Text>
        {caption ? <Text style={s.figCap}>{caption}</Text> : null}
      </View>
      {children}
    </View>
  );
}

const s = StyleSheet.create({
  sheet: { borderRadius: radius.xl, padding: 22, overflow: 'hidden', marginTop: 4, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.line },
  mast: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  kicker: { fontSize: 12, fontWeight: '700', letterSpacing: 2.2 },
  datePill: { paddingHorizontal: 11, paddingVertical: 5, borderRadius: radius.pill, backgroundColor: colors.card + 'CC' },
  date: { fontSize: 12, fontWeight: '600', color: colors.inkSub },
  body: { marginTop: 18 },
  eyebrow: { fontSize: 13, fontWeight: '700', marginTop: 16 },
  title: { ...sansW('800'), fontSize: 24, lineHeight: 33, color: colors.ink, letterSpacing: -0.7, marginTop: 4 },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 14 },
  tag: { borderRadius: radius.pill, paddingHorizontal: 12, paddingVertical: 6, backgroundColor: colors.card },
  tagText: { fontSize: 13, fontWeight: '700' },
  ledger: { borderRadius: radius.lg, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.line, paddingHorizontal: 20, paddingVertical: 6 },
  lrow: { flexDirection: 'row', gap: 14, paddingVertical: 16 },
  ldash: { borderTopWidth: 1, borderTopColor: colors.line },
  lnum: { width: 26, height: 26, borderRadius: 13, alignItems: 'center', justifyContent: 'center', marginTop: 1 },
  lnumText: { fontSize: 13, fontWeight: '800' },
  lk: { fontSize: 12, fontWeight: '600', color: colors.inkMute },
  lv: { ...sansW('700'), fontSize: 16, lineHeight: 23, color: colors.ink, marginTop: 3 },
  quote: { marginTop: 18, padding: 18, borderRadius: radius.md, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.line },
  qlabel: { fontSize: 12, fontWeight: '700', letterSpacing: 0.4 },
  qtext: { ...sansW('400'), fontSize: 16, lineHeight: 26, color: colors.ink, marginTop: 6 },
  fig: { marginTop: 14, borderRadius: radius.lg, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.line, padding: 20 },
  figHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 16 },
  figTitle: { fontFamily: fonts.display, fontSize: 17, fontWeight: '800', color: colors.ink, letterSpacing: -0.4 },
  figCap: { fontSize: 12, color: colors.inkMute, fontWeight: '600' },
});
