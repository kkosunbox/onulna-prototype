import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Screen from '../../components/Screen';
import Card from '../../components/Card';
import Icon from '../../components/Icon';
import PressableScale from '../../components/PressableScale';
import PrimaryButton from '../../components/PrimaryButton';
import Disclaimer from '../../components/Disclaimer';
import { Coin, Hero, HeroPill, Pill, PriceTag, Seal, SubHead, heroTxt } from '../../components/premium/Kit';
import { useApp } from '../../context/AppContext';
import { usePremium } from '../../context/PremiumContext';
import { BUNDLE, fmtP } from '../../services/premium/catalog';
import { ageNow, lifeStages, stageKeyOfAge } from '../../services/premium/engine';
import { PremiumKey, defaultItem, openPremium } from '../../navigation/premium';
import { colors } from '../../theme/colors';
import { txt } from '../../theme/typography';

type Entry = [PremiumKey | 'compatTab', string, string, string];
const LOUNGE: [string, Entry[]][] = [
  ['나의 인생 지도', [['life', '圖', '평생운', '초년 · 중년 · 말년 · 10년 대운'], ['sajuDeep', '命', '상세 사주 해석', '원국 · 오행 · 나의 본성']]],
  ['올해와 이달', [['newyear', '年', '신년운세', '올해 · 새해 미리보기 · 분기 전략'], ['monthly', '月', '월별 상세운세', '달력 · 좋은 날 · 이달의 미션']]],
  ['테마 운세', [['theme-love', '緣', '연애·결혼', '연애 스타일 · 인연의 해'], ['theme-money', '財', '재물', '돈 성향 · 재물 흐름'], ['theme-career', '業', '직업·적성', '맞는 일 · 커리어 상승기']]],
  ['도구', [['lucky', '日', '길일 찾기', '이사 · 계약 · 고백 · 면접'], ['compatTab', '和', '심층 궁합', '대화 팁 · 둘의 좋은 날']]],
];

export default function PremiumHubScreen() {
  const nav = useNavigation();
  const { user, today } = useApp();
  const { points, owned, openUnlock } = usePremium();
  if (!user) return null;
  const now = ageNow(user, today);
  const cur = lifeStages(user).find(x => x.key === stageKeyOfAge(now))!;
  const bOwned = owned(BUNDLE.key);

  return (
    <Screen title="프리미엄 콘텐츠" back>
      <Hero style={{ marginTop: 4, padding: 18, flexDirection: 'row', alignItems: 'center', gap: 14 }}>
        <View style={{ flex: 1 }}>
          <Text style={heroTxt.eyebrow}>보유 포인트</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Coin size={20} />
            <Text style={{ fontSize: 26, fontWeight: '800', color: colors.white }}>{points.toLocaleString('ko-KR')}</Text>
          </View>
        </View>
        <HeroPill label="충전하기" onPress={() => nav.navigate('Wallet')} />
      </Hero>
      <Text style={[txt.small, { marginTop: 14, marginHorizontal: 2 }]}>
        {user.nickname}님은 지금 <Text style={{ color: colors.purple, fontWeight: '700' }}>{cur.label} · {cur.headline}</Text>에 있어요. 모든 콘텐츠는 앞부분을 무료로 미리 볼 수 있어요.
      </Text>

      <Card style={[s.bundle]}>
        <View style={s.tag}><Text style={s.tagText}>{bOwned ? '보유 중' : '21% 할인'}</Text></View>
        <Text style={[txt.h3, { marginTop: 4 }]}>包 {BUNDLE.title}</Text>
        <Text style={[txt.small, { marginTop: 2 }]}>{BUNDLE.desc}</Text>
        {bOwned ? null : (
          <View style={[s.between, { marginTop: 14 }]}>
            <Text style={{ fontSize: 13, color: colors.inkMute, textDecorationLine: 'line-through' }}>{fmtP(BUNDLE.orig!)}</Text>
            <PrimaryButton label={`${fmtP(BUNDLE.cost)}로 모두 열기`} icon={<Coin size={16} />} onPress={() => openUnlock(BUNDLE)} style={{ width: 210 }} />
          </View>
        )}
      </Card>

      {LOUNGE.map(([g, items]) => (
        <View key={g}>
          <SubHead title={g} />
          <Card style={{ paddingVertical: 2, paddingHorizontal: 16 }}>
            {items.map(([k, e, t, d], i) => (
              <PressableScale
                key={k}
                onPress={() => (k === 'compatTab' ? nav.navigate('Tabs', { screen: 'Compatibility' }) : openPremium(nav, k))}
                style={[s.lrow, i > 0 && s.line]}
                scaleTo={0.98}
                accessibilityLabel={t}
              >
                <Seal ch={e} size={42} />
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 15, fontWeight: '700', color: colors.ink }}>{t}</Text>
                  <Text style={txt.small}>{d}</Text>
                </View>
                {k === 'compatTab'
                  ? <Pill><View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}><Coin size={12} /><Text style={{ fontSize: 12, fontWeight: '800', color: colors.purple }}>150</Text></View></Pill>
                  : <PriceTag item={defaultItem(k as Exclude<PremiumKey, 'lounge'>, today)} />}
                <Icon name="chevronRight" size={18} color={colors.inkMute} />
              </PressableScale>
            ))}
          </Card>
        </View>
      ))}
      <Disclaimer compact />
    </Screen>
  );
}

const s = StyleSheet.create({
  between: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  bundle: { marginTop: 14, borderWidth: 1.5, borderColor: colors.purpleSoft },
  tag: { position: 'absolute', top: -9, left: 16, backgroundColor: colors.seal, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 4 },
  tagText: { color: colors.white, fontSize: 10, fontWeight: '800' },
  lrow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14 },
  line: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.lineStrong },
});
