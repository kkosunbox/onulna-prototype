import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import PressableScale from './PressableScale';
import ScoreRing from './ScoreRing';
import Mascot, { MascotFace } from './Mascot';
import Icon, { IconName } from './Icon';
import { CombinedFortune } from '../types';
import { CategoryKey, categoryTheme, colors } from '../theme/colors';
import { radius, sansW, shadow, txt } from '../theme/typography';

const CATS: { k: CategoryKey; icon: IconName; label: string }[] = [
  { k: 'love', icon: 'heart', label: '연애' },
  { k: 'money', icon: 'coin', label: '재물' },
  { k: 'work', icon: 'briefcase', label: '직장' },
  { k: 'relationship', icon: 'people', label: '관계' },
];
const KEEP = (Platform.OS === 'web' ? { wordBreak: 'keep-all' } : {}) as object;

/** 점수에 따라 운알이 표정이 달라진다 */
const faceOf = (n: number): MascotFace => (n >= 85 ? 'happy' : n >= 72 ? 'look' : n >= 60 ? 'open' : 'curious');

interface Props { fortune: CombinedFortune; today: string; onOpenStory(): void; onOpenCategory(c: CategoryKey): void }

/**
 * 홈의 얼굴 — 운알이가 오늘의 운을 말해 준다.
 * 말풍선(점수 + 한 줄) → 운알이 → 분야별 원형 게이지 4개 → '오늘의 운세' 카드(요약 · 행운의 컬러/시간).
 */
export default function TodayHero({ fortune: f, onOpenStory, onOpenCategory }: Props) {
  const story = [f.summary, f.categoryTexts.work, f.categoryTexts.relationship, f.categoryTexts.money].join(' ');
  return (
    <View>
      {/* 말풍선 */}
      <PressableScale onPress={onOpenStory} scaleTo={0.98} style={[s.bubble, shadow.hero]} accessibilityLabel={`오늘의 종합운 ${f.totalScore}점. ${f.summary}`}>
        <Text style={s.score}>{f.totalScore}</Text>
        <Text style={[s.bubbleText, KEEP]} numberOfLines={2}>{f.summary}</Text>
      </PressableScale>
      <View style={s.tail} />

      <View style={s.mascot}><Mascot size={128} face={faceOf(f.totalScore)} prop={f.totalScore >= 80 ? 'sparkle' : 'none'} /></View>

      {/* 분야별 게이지 */}
      <View style={s.rings}>
        {CATS.map(({ k, icon, label }) => {
          const t = categoryTheme[k];
          return (
            <PressableScale key={k} onPress={() => onOpenCategory(k)} scaleTo={0.94} style={s.ring} accessibilityLabel={`${t.label} ${f[k]}점`}>
              <ScoreRing score={f[k]} size={68} stroke={5} color={t.color} track={colors.line} textColor={colors.ink} />
              <View style={s.ringLabel}>
                <Icon name={icon} size={16} color={t.color} filled strokeWidth={2} />
                <Text style={s.ringText}>{label}</Text>
              </View>
            </PressableScale>
          );
        })}
      </View>

      {/* 오늘의 운세 */}
      <View style={s.card}>
        <PressableScale onPress={onOpenStory} scaleTo={0.98} style={s.cardHead} accessibilityLabel="종합풀이 보기">
          <Text style={txt.h3}>오늘의 운세</Text>
          <View style={s.more}><Text style={txt.small}>종합풀이</Text><Icon name="chevronRight" size={16} color={colors.inkMute} strokeWidth={2} /></View>
        </PressableScale>
        <Text style={[txt.body, { marginTop: 8 }, KEEP]}>{story}</Text>
        <View style={s.lucky}>
          <View style={s.luck}>
            <Text style={txt.small}>행운의 컬러</Text>
            <View style={[s.swatch, { backgroundColor: f.luckyColorHex }]} />
            <Text style={s.luckV}>{f.luckyColor}</Text>
          </View>
          <View style={[s.luck, { flex: 1.3 }]}>
            <Text style={txt.small}>행운의 시간</Text>
            <Text style={s.luckV} numberOfLines={1}>{f.luckyTime.replace('~', '–')}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  bubble: { flexDirection: 'row', alignItems: 'center', gap: 14, marginHorizontal: 8, paddingVertical: 16, paddingHorizontal: 20, borderRadius: 18, backgroundColor: colors.card },
  score: { ...sansW('800'), flexShrink: 0, fontSize: 40, lineHeight: 46, letterSpacing: -1.2, color: colors.ink, fontVariant: ['tabular-nums'] },
  bubbleText: { ...txt.bodyStrong, flex: 1 },
  tail: { alignSelf: 'center', width: 0, height: 0, borderLeftWidth: 10, borderRightWidth: 10, borderTopWidth: 12, borderLeftColor: 'transparent', borderRightColor: 'transparent', borderTopColor: colors.card },
  mascot: { alignItems: 'center', marginTop: 2 },
  rings: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12, paddingHorizontal: 4 },
  ring: { alignItems: 'center', gap: 8 },
  ringLabel: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ringText: { ...txt.bodyStrong },
  card: { marginTop: 24, padding: 20, borderRadius: radius.lg, backgroundColor: colors.lavenderSoft },
  cardHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  more: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  lucky: { flexDirection: 'row', marginTop: 16, paddingVertical: 12, paddingHorizontal: 14, borderRadius: radius.md, backgroundColor: colors.card, gap: 10 },
  luck: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 6 },
  swatch: { width: 14, height: 14, borderRadius: 7 },
  luckV: { ...txt.bodyStrong },
});
