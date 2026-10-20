import React, { useRef } from 'react';
import { darkSurface, onDark } from '../../components/HeroCard';
import Mascot from '../../components/Mascot';
import { StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Screen from '../../components/Screen';
import Card from '../../components/Card';
import PressableScale from '../../components/PressableScale';
import ShareActions from '../../components/ShareActions';
import BrandMark from '../../components/BrandMark';
import { Bullet, SubHead } from '../../components/premium/Kit';
import { useApp } from '../../context/AppContext';
import { sajuCharacter } from '../../services/content/freeContent';
import { ELEMENT_INFO } from '../../data/sajuData';
import { colors } from '../../theme/colors';
import { fonts, radius, txt } from '../../theme/typography';
import { characterSpec } from '../../services/share/shareSpecs';
import FriendCompare from '../../components/FriendCompare';

/** 무료: 일주(60갑자)로 보는 나의 사주 캐릭터 */
export default function CharacterScreen() {
  const nav = useNavigation();
  const { user: u } = useApp();
  const card = useRef<View>(null);
  if (!u) return null;
  const c = sajuCharacter(u);

  return (
    <Screen title="나의 사주 캐릭터" back>
      <FriendCompare route="Character" spec={characterSpec(u)} />
      <View ref={card} collapsable={false} style={[darkSurface, s.card]}>
        <View style={s.mascot} pointerEvents="none"><Mascot size={120} palette="lavender" face="look" prop="sparkle" shadow={false} /></View>
        <BrandMark size={20} light />
        <View style={s.seal}><Text style={s.sealText}>{c.hanja}</Text></View>
        <Text style={s.eyebrow}>{u.nickname}님은</Text>
        <Text style={s.name}>{c.name}</Text>
        <Text style={s.title}>{c.title}</Text>
        <View style={s.chips}>
          {c.traits.slice(0, 3).map(t => <View key={t} style={s.chip}><Text style={s.chipText}>{t}</Text></View>)}
        </View>
        <Text style={s.foot}>60가지 사주 캐릭터 중 하나 · {ELEMENT_INFO[c.element].ko}({ELEMENT_INFO[c.element].hanja})의 기운</Text>
      </View>
      <ShareActions spec={characterSpec(u)} />

      <SubHead title="이런 사람이에요" caption={c.core} />
      <Card>
        {c.traits.map(t => <Bullet key={t}>{t}</Bullet>)}
        <Text style={[txt.body, { marginTop: 10, fontSize: 15 }]}>속마음 · {c.inner}</Text>
      </Card>

      <SubHead title="찰떡 캐릭터" caption="함께 있으면 편안한 기운" />
      <Card style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
        <Text style={{ fontFamily: fonts.serif, fontSize: 24, color: colors.purpleSoft }}>合</Text>
        <View style={{ flex: 1 }}>
          <Text style={txt.h3}>{c.bestFriend}</Text>
          <Text style={[txt.small, { marginTop: 2 }]}>친구에게 공유해서 찰떡 캐릭터인지 확인해 보세요</Text>
        </View>
      </Card>

      <PressableScale onPress={() => nav.navigate('SajuDeep')} style={s.cta} scaleTo={0.98}>
        <Text style={{ fontSize: 15, fontWeight: '700', color: colors.purple }}>내 사주를 더 깊이 알고 싶다면</Text>
        <Text style={[txt.small, { marginTop: 2 }]}>원국표 · 오행 · 신살 · 재물 · 연애까지, 상세 사주 해석 보러 가기 →</Text>
      </PressableScale>
    </Screen>
  );
}

const s = StyleSheet.create({
  card: { marginTop: 4 },
  mascot: { position: 'absolute', right: -2, top: 26 },
  seal: { alignSelf: 'flex-start', marginTop: 18, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, borderWidth: 1, borderColor: onDark.accent },
  sealText: { fontFamily: fonts.serif, fontSize: 15, fontWeight: '700', color: onDark.accent, letterSpacing: 1 },
  eyebrow: { color: onDark.sub, fontSize: 15, marginTop: 14 },
  name: { fontFamily: fonts.serif, color: onDark.text, fontSize: 40, lineHeight: 46, fontWeight: '800', letterSpacing: -1.2, marginTop: 2 },
  title: { color: onDark.accent, fontSize: 15, fontWeight: '700', marginTop: 4 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 16, paddingRight: 80 },
  chip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.12)' },
  chipText: { color: onDark.text, fontSize: 13, fontWeight: '600' },
  foot: { color: onDark.mute, fontSize: 11, marginTop: 16 },
  cta: { marginTop: 24, padding: 20, borderRadius: radius.lg, backgroundColor: colors.lavenderSoft, borderWidth: 1, borderColor: colors.lavender },
});
