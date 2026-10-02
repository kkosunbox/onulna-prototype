import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Screen from '../../components/Screen';
import Card from '../../components/Card';
import Disclaimer from '../../components/Disclaimer';
import { Bullet, DarkChip, HeadRow, Hero, LockGate, Pill, Seal, SubHead, Tip, heroTxt } from '../../components/premium/Kit';
import { useApp } from '../../context/AppContext';
import { ITEMS } from '../../services/premium/catalog';
import { spouseReport } from '../../services/content/premiumContent';
import { pText } from '../../services/premium/engine';
import { ELEMENT_INFO } from '../../data/sajuData';
import { MBTI_INFO } from '../../data/mbtiData';
import { colors } from '../../theme/colors';
import { fonts, radius, txt } from '../../theme/typography';

/** 프리미엄: 미래 배우자 리포트 — 첫 줄은 무료로 보여주고 나머지는 잠금 */
export default function SpouseScreen() {
  const { user: u, today } = useApp();
  if (!u) return null;
  const item = ITEMS.spouse();
  const R = spouseReport(u, today);

  return (
    <Screen title="미래 배우자 리포트" back>
      <HeadRow item={item} caption={`배우자의 별 · ${ELEMENT_INFO[R.spouseEl].ko}(${ELEMENT_INFO[R.spouseEl].hanja})`} />
      <Hero style={{ alignItems: 'center', paddingVertical: 26 }}>
        <Text style={heroTxt.eyebrow}>{u.nickname}님의 미래 배우자는</Text>
        <Text style={[heroTxt.summ, { fontSize: 22, lineHeight: 30, textAlign: 'center', marginTop: 8 }]}>{R.headline}</Text>
        <View style={{ flexDirection: 'row', gap: 6, marginTop: 16 }}>
          <DarkChip gold>{R.mbti[0]}</DarkChip>
          <DarkChip>{R.animals[0]}띠</DarkChip>
          <DarkChip>{R.ageGap}</DarkChip>
        </View>
      </Hero>

      <LockGate item={item}>
        <SubHead title="이런 분위기의 사람이에요" />
        <Card>
          <Text style={txt.h3}>{R.look}</Text>
          <View style={{ marginTop: 8 }}>{R.personality.map(p => <Bullet key={p}>{p}</Bullet>)}</View>
        </Card>

        <SubHead title="찰떡 조건" caption="MBTI · 띠 · 나이" />
        <View style={s.grid}>
          <Card style={s.cell}><Text style={txt.caption}>MBTI</Text><Text style={s.big}>{R.mbti.join(' · ')}</Text><Text style={txt.caption}>{MBTI_INFO[R.mbti[0] as keyof typeof MBTI_INFO]?.nickname}</Text></Card>
          <Card style={s.cell}><Text style={txt.caption}>잘 맞는 띠</Text><Text style={s.big}>{R.animals.join(' · ')}</Text><Text style={txt.caption}>합을 이루는 띠</Text></Card>
        </View>

        <SubHead title="언제 만날까요?" caption="인연의 기운이 강해지는 시기" />
        <Card style={{ paddingVertical: 4, paddingHorizontal: 18 }}>
          {R.years.length ? R.years.map((x, i) => (
            <View key={x.yy} style={[s.lrow, i ? s.line : null]}>
              <Seal ch="緣" />
              <View style={{ flex: 1 }}><Text style={txt.h3}>{x.yy}년</Text><Text style={txt.small}>{x.why}</Text></View>
            </View>
          )) : <Text style={[txt.body, { paddingVertical: 14 }]}>특정 해에 몰리기보다 고르게 인연이 찾아오는 사주예요.</Text>}
          {R.daeLove.map(d => (
            <View key={d.age} style={[s.lrow, s.line]}>
              <Seal ch="家" />
              <View style={{ flex: 1 }}><Text style={txt.h3}>{d.age}~{d.age + 9}세</Text><Text style={txt.small}>{pText(d.p)} 대운 · 배우자의 별이 들어오는 10년</Text></View>
            </View>
          ))}
        </Card>
        <View style={{ flexDirection: 'row', gap: 8, marginTop: 10 }}>
          {R.months.map(x => (
            <View key={`${x.y}-${x.m}`} style={s.month}><Text style={txt.caption}>{x.y}년</Text><Text style={{ fontFamily: fonts.serif, fontSize: 20, fontWeight: '600', color: colors.love }}>{x.m}월</Text></View>
          ))}
        </View>

        <SubHead title="어디서 만날까요?" />
        <Card>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>{R.places.map(p => <Pill key={p}>{p}</Pill>)}</View>
          <Text style={[txt.body, { marginTop: 10, fontSize: 14 }]}>{R.first}</Text>
        </Card>

        <SubHead title="인연을 끌어오는 법" />
        <Card>{R.advice.map(a => <Bullet key={a}>{a}</Bullet>)}</Card>
        <Tip title="기억해 두세요">운세는 흐름을 참고하는 콘텐츠예요. 좋은 인연은 결국 내가 알아보는 눈에서 시작돼요.</Tip>
      </LockGate>
      <Disclaimer compact />
    </Screen>
  );
}

const s = StyleSheet.create({
  grid: { flexDirection: 'row', gap: 12 },
  cell: { flex: 1, alignItems: 'center', gap: 4 },
  big: { fontFamily: fonts.serif, fontSize: 18, fontWeight: '600', color: colors.purple, textAlign: 'center' },
  lrow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 13 },
  line: { borderTopWidth: 1, borderTopColor: colors.line },
  month: { flex: 1, alignItems: 'center', paddingVertical: 12, borderRadius: radius.lg, backgroundColor: colors.loveBg },
});
