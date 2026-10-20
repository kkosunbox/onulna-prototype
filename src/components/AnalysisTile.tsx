import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import PressableScale from './PressableScale';
import Mascot, { MascotFace, MascotPalette, MascotProp } from './Mascot';
import Icon from './Icon';
import { AnalysisResult } from '../types';
import { analysisTheme, colors } from '../theme/colors';
import { fonts, radius, shadow, sansW } from '../theme/typography';
import { KEYWORDS } from '../data/keywords';

const KEEP = (Platform.OS === 'web' ? { wordBreak: 'keep-all' } : {}) as object;

/** 관점마다 운알이 모습 */
const MASCOT: Record<AnalysisResult['source'], { palette: MascotPalette; face: MascotFace; prop: MascotProp }> = {
  saju: { palette: 'peach', face: 'look', prop: 'sparkle' },
  thai: { palette: 'classic', face: 'curious', prop: 'sparkle' },
  mbti: { palette: 'lavender', face: 'sleepy', prop: 'music' },
  blood: { palette: 'pink', face: 'happy', prop: 'heart' },
};

/**
 * 4가지 관점 타일 — 관점 고유 파스텔 바탕 · 작은 관점 이름 · 굵은 한 줄 · 테두리 키워드 칩 · 운알이 · 동그란 화살표.
 */
export default function AnalysisTile({ analysis, onPress }: { analysis: AnalysisResult; onPress(): void }) {
  const t = analysisTheme[analysis.source];
  return (
    <PressableScale onPress={onPress} style={[s.tile, { backgroundColor: t.bg }]} accessibilityLabel={`${t.label}: ${analysis.headline}`}>
      <View style={s.mascot} pointerEvents="none"><Mascot size={70} shadow={false} {...MASCOT[analysis.source]} /></View>
      <Text style={s.label}>{t.label} · {t.sub}</Text>
      <Text style={[s.headline, KEEP]} numberOfLines={3}>{analysis.headline}</Text>
      <View style={s.foot}>
        <View style={[s.tag, { borderColor: t.color }]}>
          <Text style={[s.tagText, { color: t.color }]}>{KEYWORDS[analysis.tags[0]].label}</Text>
        </View>
        <View style={s.go}><Icon name="chevronRight" size={16} color={colors.ink} strokeWidth={2.2} /></View>
      </View>
    </PressableScale>
  );
}

const s = StyleSheet.create({
  tile: { flex: 1, borderRadius: radius.lg, padding: 16, minHeight: 176, overflow: 'hidden' },
  mascot: { position: 'absolute', right: -6, top: 54 },
  label: { fontSize: 13, color: colors.inkSub, fontWeight: '500' },
  headline: { ...sansW('700'), fontSize: 15, lineHeight: 23, color: colors.ink, letterSpacing: -0.2, marginTop: 6, paddingRight: 44, flex: 1 },
  foot: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 },
  tag: { borderRadius: 6, borderWidth: 1, paddingHorizontal: 7, paddingVertical: 2, backgroundColor: colors.card },
  tagText: { fontSize: 11, fontWeight: '700' },
  go: { width: 30, height: 30, borderRadius: 15, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center', ...shadow.card },
});
