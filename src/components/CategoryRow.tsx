import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import PressableScale from './PressableScale';
import ScoreBar from './ScoreBar';
import Icon, { IconName } from './Icon';
import { CategoryKey, categoryTheme, colors } from '../theme/colors';
import { radius, sansW, shadow, txt } from '../theme/typography';

/** 웹에서도 한 줄 말줄임이 확실히 되도록 */
const ONE_LINE = (Platform.OS === 'web' ? { whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' } : {}) as object;
const ICON: Record<CategoryKey, IconName> = { love: 'heart', money: 'coin', work: 'briefcase', relationship: 'people' };

/**
 * 분야별 운세 카드 — 회색 카드 한 장에 [흰 아이콘 칸 · 이름(+최고 배지) · 점수 · 막대 · 한 문장 · 동그란 화살표].
 * expand: 기간 운세처럼 눌러서 풀이를 펼치는 경우(화살표가 아래로).
 */
export default function CategoryRow({ category, score, text, onPress, delay, badge, lines = 1, expand = false, delta }: {
  category: CategoryKey; score: number; text?: string; onPress(): void; delay?: number; badge?: string; lines?: number; expand?: boolean; delta?: number;
}) {
  // 운세 탭 흐름 패널과 같은 기준: 72 이상 좋음 · 60 이상 보통 · 그 아래 주의
  const g = score >= 72 ? { ko: '좋음', fg: colors.success, bg: colors.okBg } : score >= 60 ? { ko: '보통', fg: colors.inkSub, bg: colors.lavender } : { ko: '주의', fg: colors.danger, bg: colors.loveBg };
  const t = categoryTheme[category];
  return (
    <PressableScale onPress={onPress} style={s.card} scaleTo={0.98} accessibilityLabel={`${t.label} ${score}점`}>
      <View style={s.icon}><Icon name={ICON[category]} size={24} color={t.color} filled fillOpacity={category === 'love' ? 1 : 0.35} strokeWidth={2} /></View>
      <View style={{ flex: 1, gap: 8 }}>
        <View style={s.head}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flexShrink: 1 }}>
            <Text style={s.label}>{t.label}</Text>
            <View style={[s.badge, { backgroundColor: g.bg }]}><Text style={[s.badgeText, { color: g.fg }]}>{g.ko}</Text></View>
            {badge ? <View style={[s.badge, { backgroundColor: t.bg }]}><Text style={[s.badgeText, { color: t.color }]}>{badge}</Text></View> : null}
          </View>
          <Text style={[s.score, { color: t.color }]}>{score}<Text style={s.of}>/100</Text></Text>
        </View>
        <ScoreBar value={score} color={t.color} delay={delay} track={colors.lineStrong} height={6} />
        {text ? <Text style={[s.text, lines === 1 && ONE_LINE]} numberOfLines={lines}>{text}</Text> : null}
        {delta !== undefined ? (
          <Text style={[s.delta, { color: delta > 0 ? colors.success : delta < 0 ? colors.danger : colors.inkMute }]}>
            {delta > 0 ? `어제보다 ▲${delta}` : delta < 0 ? `어제보다 ▼${-delta}` : '어제와 같아요'}
          </Text>
        ) : null}
      </View>
      {expand ? (
        <View style={[s.go, s.flat, { transform: [{ rotate: lines > 1 ? '-90deg' : '90deg' }] }]}>
          <Icon name="chevronRight" size={20} color={colors.inkSub} strokeWidth={2.2} />
        </View>
      ) : (
        <View style={s.go}><Icon name="chevronRight" size={18} color={colors.inkSub} strokeWidth={2.2} /></View>
      )}
    </PressableScale>
  );
}

const s = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16, borderRadius: radius.lg, backgroundColor: colors.lavenderSoft },
  icon: { width: 48, height: 48, borderRadius: 14, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center' },
  head: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  label: { ...txt.bodyStrong, fontWeight: '700' },
  score: { ...sansW('800'), fontSize: 18, fontVariant: ['tabular-nums'] },
  of: { ...sansW('600'), fontSize: 11, color: colors.inkMute },
  delta: { ...sansW('600'), fontSize: 11, marginTop: -2 },
  text: { ...txt.small, color: colors.inkSub },
  badge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: radius.pill },
  badgeText: { fontSize: 11, fontWeight: '700' },
  go: { width: 32, height: 32, borderRadius: 16, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center', ...shadow.card },
  flat: { backgroundColor: 'transparent', shadowOpacity: 0, elevation: 0 },
});
