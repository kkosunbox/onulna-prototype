import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import PressableScale from './PressableScale';
import Ico from './Ico';
import { AnalysisResult } from '../types';
import { analysisTheme, colors } from '../theme/colors';
import { fonts, radius, shadow, sansW } from '../theme/typography';
import { KEYWORDS } from '../data/keywords';

const KICKER = { saju: '四柱', thai: '七曜', mbti: '性向', blood: '血型' } as const;
const KEEP = (Platform.OS === 'web' ? { wordBreak: 'keep-all' } : {}) as object;

/**
 * 4가지 관점 타일 — 파스텔 아이콘 칸 · 작은 관점 이름 · 굵은 한 줄 · 키워드 알약 · '자세히'.
 */
export default function AnalysisTile({ analysis, onPress }: { analysis: AnalysisResult; onPress(): void }) {
  const t = analysisTheme[analysis.source];
  return (
    <PressableScale onPress={onPress} style={[s.tile, shadow.card]} accessibilityLabel={`${t.label}: ${analysis.headline}`}>
      <View style={s.head}>
        <Ico ch={t.emoji} size={40} color={t.color} />
        <Text style={[s.kicker, { color: t.color }]}>{KICKER[analysis.source]}</Text>
      </View>
      <Text style={s.label}>{t.label} · {t.sub}</Text>
      <Text style={[s.headline, KEEP]} numberOfLines={3}>{analysis.headline}</Text>
      <View style={s.foot}>
        <View style={[s.tag, { backgroundColor: t.bg }]}>
          <Text style={[s.tagText, { color: t.color }]}>{KEYWORDS[analysis.tags[0]].label}</Text>
        </View>
        <Text style={s.more}>자세히 →</Text>
      </View>
    </PressableScale>
  );
}

const s = StyleSheet.create({
  tile: { flex: 1, backgroundColor: colors.card, borderRadius: radius.lg, padding: 18, borderWidth: 1, borderColor: colors.line, minHeight: 196 },
  head: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  kicker: { fontFamily: fonts.serif, fontSize: 12, fontWeight: '700', letterSpacing: 2, opacity: 0.8 },
  label: { fontSize: 12, color: colors.inkMute, fontWeight: '600', marginTop: 14 },
  headline: { ...sansW('800'), fontSize: 15.5, lineHeight: 22, color: colors.ink, letterSpacing: -0.4, marginTop: 4, flex: 1 },
  foot: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 14 },
  tag: { borderRadius: radius.pill, paddingHorizontal: 9, paddingVertical: 4 },
  tagText: { fontSize: 11.5, fontWeight: '700' },
  more: { fontSize: 12, fontWeight: '700', color: colors.seal },
});
