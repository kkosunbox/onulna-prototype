import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import PressableScale from './PressableScale';
import Icon from './Icon';
import { usePremium } from '../context/PremiumContext';
import { ShareSpec } from '../services/share/shareSpecs';
import { shareLink } from '../services/share/linkShare';
import { colors } from '../theme/colors';
import { radius } from '../theme/typography';

/** 결과 아래 공유 버튼 두 개: 카드 이미지로 공유 · 링크 보내기 */
export default function ShareActions({ spec }: { spec: ShareSpec }) {
  const nav = useNavigation();
  const { toast } = usePremium();
  const send = async () => {
    const r = await shareLink(spec.text);
    if (r === 'copied') toast('링크를 복사했어요. 친구에게 붙여 넣어 보내세요');
  };
  return (
    <View style={s.row}>
      <PressableScale onPress={send} style={[s.btn, s.soft]} scaleTo={0.96}>
        <Icon name="heart" size={18} color={colors.purple} />
        <Text style={[s.text, { color: colors.purple }]}>링크 보내기</Text>
      </PressableScale>
      <PressableScale onPress={() => nav.navigate('Share', { spec })} style={[s.btn, s.solid]} scaleTo={0.96} haptic>
        <Icon name="share" size={18} color={colors.white} />
        <Text style={[s.text, { color: colors.white }]}>카드로 공유</Text>
      </PressableScale>
    </View>
  );
}

const s = StyleSheet.create({
  row: { flexDirection: 'row', gap: 8, marginTop: 16 },
  btn: { flex: 1, height: 52, borderRadius: radius.md, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  soft: { backgroundColor: colors.lavenderSoft },
  solid: { backgroundColor: colors.navy },
  text: { fontSize: 15, fontWeight: '600' },
});
