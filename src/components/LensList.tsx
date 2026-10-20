import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Ico from './Ico';
import { LensLine, Tone } from '../services/fortune/insightService';
import { analysisTheme, colors } from '../theme/colors';
import { radius, txt } from '../theme/typography';

const TONE: Record<Tone, { ko: string; fg: string; bg: string }> = {
  up: { ko: '밀어줌', fg: colors.success, bg: colors.okBg },
  flat: { ko: '유지', fg: colors.inkSub, bg: colors.lavenderSoft },
  down: { ko: '신중', fg: colors.danger, bg: colors.loveBg },
};

/**
 * 네 관점 풀이 목록 — 홈 종합 · 분야 상세 · 주간/월간/연간 · 궁합이 모두 같은 모양으로 쓴다.
 * 결론(verdict) 한 줄 → 관점마다 [아이콘 · 이름 · 근거 · 방향] + 풀이.
 */
export default function LensList({ lenses, verdict }: { lenses: LensLine[]; verdict?: string }) {
  return (
    <View style={s.card}>
      {verdict ? <Text style={s.verdict}>{verdict}</Text> : null}
      {lenses.map((l, i) => {
        const t = analysisTheme[l.source];
        const tone = TONE[l.tone];
        return (
          <View key={l.source + i} style={[s.row, (i > 0 || verdict) && s.line]}>
            <Ico ch={t.emoji} size={36} color={t.color} />
            <View style={{ flex: 1 }}>
              <View style={s.head}>
                <Text style={s.label}>{l.label}</Text>
                <View style={[s.pill, { backgroundColor: tone.bg }]}><Text style={[s.pillText, { color: tone.fg }]}>{tone.ko}</Text></View>
              </View>
              <Text style={s.basis}>{l.basis}</Text>
              <Text style={s.text}>{l.text}</Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}

const s = StyleSheet.create({
  card: { borderRadius: radius.lg, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.line, paddingHorizontal: 20, paddingVertical: 6 },
  verdict: { ...txt.bodyStrong, paddingVertical: 14 },
  row: { flexDirection: 'row', gap: 12, paddingVertical: 16 },
  line: { borderTopWidth: 1, borderTopColor: colors.line },
  head: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  label: { ...txt.bodyStrong },
  pill: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: radius.pill },
  pillText: { ...txt.micro, fontWeight: '700' },
  basis: { ...txt.small, marginTop: 2 },
  text: { ...txt.body, color: colors.ink, marginTop: 6 },
});
