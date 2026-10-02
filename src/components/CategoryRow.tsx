import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import PressableScale from './PressableScale';
import ScoreBar from './ScoreBar';
import Icon from './Icon';
import { CategoryKey, categoryTheme, colors } from '../theme/colors';
import Ico from './Ico';

/** 분야별 운세 한 줄: 아이콘 · 이름 · 점수 · 막대 · 한 문장 */
export default function CategoryRow({ category, score, text, onPress, delay }: { category: CategoryKey; score: number; text?: string; onPress(): void; delay?: number }) {
  const t = categoryTheme[category];
  return (
    <PressableScale onPress={onPress} style={s.row} accessibilityLabel={`${t.label} ${score}점`}>
      <Ico ch={t.emoji} size={42} />
      <View style={{ flex: 1, gap: 6 }}>
        <View style={s.head}>
          <Text style={s.label}>{t.label}</Text>
          <Text style={[s.score, { color: t.color }]}>{score}</Text>
        </View>
        <ScoreBar value={score} color={t.color} delay={delay} />
        {text ? <Text style={s.text} numberOfLines={1}>{text}</Text> : null}
      </View>
      <Icon name="chevronRight" size={18} color={colors.inkMute} />
    </PressableScale>
  );
}

const s = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 14 },
  head: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  label: { fontSize: 15, fontWeight: '700', color: colors.ink, letterSpacing: -0.3 },
  score: { fontSize: 17, fontWeight: '800', fontVariant: ['tabular-nums'] },
  text: { fontSize: 13, color: colors.inkSub },
});
