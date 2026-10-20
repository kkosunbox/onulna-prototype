import React from 'react';
import { darkSurface, onDark } from '../../components/HeroCard';
import Mascot from '../../components/Mascot';
import { StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Screen from '../../components/Screen';
import Card from '../../components/Card';
import PressableScale from '../../components/PressableScale';
import ShareActions from '../../components/ShareActions';
import FriendCompare from '../../components/FriendCompare';
import BrandMark from '../../components/BrandMark';
import { SubHead } from '../../components/premium/Kit';
import { useApp } from '../../context/AppContext';
import { pastLife } from '../../services/content/freeContent';
import { pastLifeSpec } from '../../services/share/shareSpecs';
import { colors } from '../../theme/colors';
import { fonts, radius, txt } from '../../theme/typography';

/** 무료: 전생 테스트 — 띠(시대) · 일간 오행 × MBTI(신분) · 일지(장면) */
export default function PastLifeScreen() {
  const nav = useNavigation();
  const { user: u } = useApp();
  if (!u) return null;
  const P = pastLife(u);
  const spec = pastLifeSpec(u);

  return (
    <Screen title="전생 테스트" back>
      <FriendCompare route="PastLife" spec={spec} />
      <View style={[darkSurface, s.card]}>
        <View style={s.mascot} pointerEvents="none"><Mascot size={120} palette="peach" face="curious" prop="question" shadow={false} /></View>
        <BrandMark size={20} light />
        <View style={s.seal}><Text style={s.sealText}>{P.hanja}</Text></View>
        <Text style={s.eyebrow}>{u.nickname}님은 전생에</Text>
        <Text style={s.name}>{P.title}</Text>
        <Text style={s.era}>{P.era}</Text>
        <Text style={s.scene}>“{P.scene}”</Text>
      </View>
      <ShareActions spec={spec} title="친구는 전생에 누구였을까?" />

      <SubHead title="이번 생까지 가져온 것" />
      <Card style={{ gap: 12 }}>
        <Row k="타고난 재능" v={P.carried} />
        <Row k="이번 생의 숙제" v={P.karma} />
        <Row k="전생에서 이어진 인연" v={`${P.bond} 사람과 처음 만나도 오래 안 사이처럼 편해요`} />
      </Card>

      <PressableScale onPress={() => nav.navigate('Spouse')} style={s.cta} scaleTo={0.98}>
        <Text style={{ fontSize: 15, fontWeight: '700', color: colors.purple }}>이번 생의 인연이 궁금하다면</Text>
        <Text style={[txt.small, { marginTop: 2 }]}>미래 배우자는 어떤 사람일까? 첫 화면은 무료로 볼 수 있어요 →</Text>
      </PressableScale>
    </Screen>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <View>
      <Text style={txt.caption}>{k}</Text>
      <Text style={[txt.body, { fontSize: 15, marginTop: 2 }]}>{v}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  card: { marginTop: 4 },
  mascot: { position: 'absolute', right: -2, top: 26 },
  seal: { alignSelf: 'flex-start', marginTop: 18, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, borderWidth: 1, borderColor: onDark.accent },
  sealText: { fontFamily: fonts.serif, fontSize: 15, fontWeight: '700', color: onDark.accent },
  eyebrow: { color: onDark.sub, fontSize: 15, marginTop: 14 },
  name: { fontFamily: fonts.serif, color: onDark.text, fontSize: 24, lineHeight: 32, fontWeight: '800', marginTop: 4, paddingRight: 96 },
  era: { color: onDark.accent, fontSize: 13, fontWeight: '700', marginTop: 4 },
  scene: { color: onDark.sub, fontSize: 15, lineHeight: 23, marginTop: 16 },
  cta: { marginTop: 24, padding: 20, borderRadius: radius.lg, backgroundColor: colors.lavenderSoft, borderWidth: 1, borderColor: colors.lavender },
});
