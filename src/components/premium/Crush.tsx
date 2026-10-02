/** 프리미엄: 그 사람의 속마음 (궁합 결과 화면 안) */
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Card from '../Card';
import ScoreRing from '../ScoreRing';
import { ActRow, Hero, SubHead, heroTxt } from './Kit';
import { CompatibilityResult, User } from '../../types';
import { crushReport } from '../../services/content/premiumContent';
import { colors } from '../../theme/colors';
import { fonts, radius, txt } from '../../theme/typography';

export default function CrushView({ u, r, today }: { u: User; r: CompatibilityResult; today: string }) {
  const R = crushReport(u, r, today);
  const mx = Math.max(...R.flow.map(f => f.v));
  return (
    <>
      <SubHead title={`${r.target.nickname}님의 속마음`} caption="상대의 기운으로 본 나를 향한 마음" />
      <Hero style={{ marginTop: 0, flexDirection: 'row', alignItems: 'center', gap: 18 }}>
        <ScoreRing score={R.temp} size={100} stroke={8} label="마음 온도" />
        <View style={{ flex: 1 }}>
          <Text style={heroTxt.eyebrow}>나를 이렇게 느껴요 · {R.tg}</Text>
          <Text style={heroTxt.summ}>{R.oneLine}</Text>
        </View>
      </Hero>
      <Card style={{ marginTop: 12 }}>
        <Text style={txt.h3}>{r.target.nickname}님에게 나는</Text>
        <Text style={[txt.body, { marginTop: 6, fontSize: 14 }]}>{R.feel}</Text>
        <Text style={[txt.small, { marginTop: 8 }]}>{R.relLine}</Text>
      </Card>

      <SubHead title="앞으로 3개월 관계 흐름" />
      <Card style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 14, height: 150, paddingTop: 20 }}>
        {R.flow.map(f => (
          <View key={f.label} style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end', height: '100%', gap: 6 }}>
            <Text style={{ fontFamily: fonts.serif, fontSize: 13, fontWeight: '600', color: f.v === mx ? colors.love : colors.inkMute }}>{f.v}</Text>
            <View style={{ width: '50%', height: Math.max(12, (f.v - 50) * 1.8), borderRadius: 6, backgroundColor: f.v === mx ? colors.love : colors.loveBg }} />
            <Text style={txt.caption}>{f.label}</Text>
          </View>
        ))}
      </Card>

      <SubHead title="연락하기 좋은 날" caption="앞으로 3주 중 두 사람의 연애 흐름이 겹치는 날" />
      <View style={{ flexDirection: 'row', gap: 8 }}>
        {R.contact.map(c => (
          <View key={c.iso} style={s.day}><Text style={{ fontSize: 14, fontWeight: '700', color: colors.love }}>{c.label}</Text></View>
        ))}
      </View>

      <SubHead title="이렇게 다가가 보세요" />
      <Card style={{ gap: 10 }}>
        {R.dos.map(t => <ActRow key={t}>{t}</ActRow>)}
        {R.donts.map(t => <ActRow key={t} ok={false}>{t}</ActRow>)}
      </Card>
      <Text style={[txt.caption, { textAlign: 'center', marginTop: 12 }]}>재미로 보는 콘텐츠예요. 상대의 진짜 마음은 대화로 확인해 주세요.</Text>
    </>
  );
}

const s = StyleSheet.create({
  day: { flex: 1, alignItems: 'center', paddingVertical: 14, borderRadius: radius.lg, backgroundColor: colors.loveBg },
});

