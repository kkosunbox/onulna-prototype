import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import PressableScale from './PressableScale';
import Icon, { IconName } from './Icon';
import { CategoryKey, categoryTheme, colors } from '../theme/colors';
import { radius, sansW, txt } from '../theme/typography';

const ICON: Record<CategoryKey, IconName> = { love: 'heart', money: 'coin', work: 'briefcase', relationship: 'people' };
const KEEP = (Platform.OS === 'web' ? { wordBreak: 'keep-all' } : {}) as object;

/** 가장 좋은 때에 하면 좋은 일 */
const TIP: Record<CategoryKey, string> = {
  love: '먼저 연락하거나 약속을 잡아 보세요. 마음이 가장 잘 전해지는 때예요.',
  money: '미뤄 둔 정산 · 가격 비교 · 저축 계획을 이때 정리해 보세요.',
  work: '중요한 보고나 제안은 이때로 잡으면 힘이 실려요.',
  relationship: '모임이나 오랜만의 안부 연락을 이때 해 보세요.',
};

/**
 * 기간(주간 · 월간 · 연간) 분야 카드.
 * 머리: 아이콘 · 이름 · '○○에 가장 좋아요' · 점수/100
 * 몸: 기간 흐름 미니 막대(가장 좋은 때만 진한 색) · 풀이 두 줄
 * 펼치면: 전체 풀이 + '이렇게 활용해요'
 */
export default function PeriodCatCard({ category, score, text, best, series = [], open, onPress }: {
  category: CategoryKey; score: number; text: string; best: string; series?: { label: string; v: number }[]; open: boolean; onPress(): void;
}) {
  const t = categoryTheme[category];
  // 머리 줄의 '○○에 가장 좋아요'와 겹치는 끝 문장은 뺀다
  const body = text.replace(/\s*\S+에 가장 힘이 실려요\.?$/, '');
  const vals = series.map(x => x.v);
  const lo = Math.min(...vals, score) - 4, hi = Math.max(...vals, score);
  const top = series.reduce<{ label: string; v: number } | null>((a, b) => (!a || b.v > a.v ? b : a), null);

  return (
    <PressableScale onPress={onPress} scaleTo={0.99} style={s.card} accessibilityLabel={`${t.label} ${score}점, ${best}에 가장 좋아요. ${open ? '접기' : '펼치기'}`} accessibilityState={{ expanded: open }}>
      <View style={s.head}>
        <View style={s.icon}><Icon name={ICON[category]} size={22} color={t.color} filled fillOpacity={category === 'love' ? 1 : 0.35} strokeWidth={2} /></View>
        <View style={{ flex: 1 }}>
          <Text style={s.name}>{t.label}</Text>
          <View style={s.bestRow}>
            <Icon name="sparkle" size={12} color={t.color} filled fillOpacity={1} strokeWidth={1.4} />
            <Text style={[s.bestText, { color: t.color }]}>{best}에 가장 좋아요</Text>
          </View>
        </View>
        <Text style={[s.score, { color: t.color }]}>{score}<Text style={s.of}>/100</Text></Text>
      </View>

      {series.length ? (
        <View style={s.chart}>
          {series.map(x => {
            const isTop = top && x.label === top.label;
            const h = 6 + ((x.v - lo) / Math.max(1, hi - lo)) * 30;
            return (
              <View key={x.label} style={s.col}>
                <View style={[s.bar, { height: h, backgroundColor: isTop ? t.color : t.color + '38' }]} />
                <Text style={[s.colLabel, isTop && { color: t.color, fontWeight: '700' }]} numberOfLines={1}>{x.label.replace('주차', '주')}</Text>
              </View>
            );
          })}
        </View>
      ) : null}

      <Text style={[s.text, KEEP]} numberOfLines={open ? undefined : 2}>{body}</Text>

      {open ? (
        <View style={s.tip}>
          <Text style={[s.tipHead, { color: t.color }]}>이렇게 활용해요</Text>
          <Text style={[txt.small, { color: colors.inkSub, marginTop: 4 }, KEEP]}>{best}에 {TIP[category]}</Text>
        </View>
      ) : null}

      <View style={s.more}>
        <Text style={s.moreText}>{open ? '접기' : '자세히'}</Text>
        <View style={{ transform: [{ rotate: open ? '-90deg' : '90deg' }] }}><Icon name="chevronRight" size={14} color={colors.inkMute} strokeWidth={2.2} /></View>
      </View>
    </PressableScale>
  );
}

const s = StyleSheet.create({
  card: { padding: 16, borderRadius: radius.lg, backgroundColor: colors.lavenderSoft },
  head: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  icon: { width: 44, height: 44, borderRadius: 13, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center' },
  name: { ...txt.bodyStrong, fontWeight: '700' },
  bestRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  bestText: { ...sansW('700'), fontSize: 13 },
  score: { ...sansW('800'), fontSize: 24, letterSpacing: -0.6, fontVariant: ['tabular-nums'] },
  of: { ...sansW('600'), fontSize: 11, color: colors.inkMute, letterSpacing: 0 },
  chart: { flexDirection: 'row', alignItems: 'flex-end', gap: 4, height: 72, marginTop: 14, paddingHorizontal: 2, paddingTop: 4, borderRadius: radius.md, backgroundColor: colors.card, paddingBottom: 4 },
  col: { flex: 1, alignItems: 'center', justifyContent: 'flex-end', gap: 3 },
  bar: { width: '64%', maxWidth: 18, borderRadius: 4 },
  colLabel: { ...txt.micro, fontSize: 11 },
  text: { ...txt.small, color: colors.inkSub, marginTop: 12 },
  tip: { marginTop: 12, padding: 12, borderRadius: radius.md, backgroundColor: colors.card },
  tipHead: { ...sansW('700'), fontSize: 13 },
  more: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 2, marginTop: 10 },
  moreText: { ...sansW('600'), fontSize: 11, color: colors.inkMute },
});
