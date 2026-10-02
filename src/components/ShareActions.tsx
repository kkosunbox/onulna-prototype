import React, { RefObject } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import PressableScale from './PressableScale';
import Icon from './Icon';
import { usePremium } from '../context/PremiumContext';
import { shareCardImage } from '../services/shareService';
import { shareLink } from '../services/share/linkShare';
import { colors } from '../theme/colors';
import { radius } from '../theme/typography';

/** 결과 카드 아래 공유 버튼 두 개: 이미지로 저장 · 친구에게 보내기 */
export default function ShareActions({ cardRef, text, url }: { cardRef: RefObject<View | null>; text: string; url?: string }) {
  const { toast } = usePremium();
  const send = async () => {
    const r = await shareLink(text, url);
    if (r === 'copied') toast('링크를 복사했어요. 친구에게 붙여 넣어 보내세요');
  };
  return (
    <View style={s.row}>
      <PressableScale onPress={() => shareCardImage(cardRef)} style={[s.btn, s.soft]} scaleTo={0.96}>
        <Icon name="share" size={18} color={colors.purple} />
        <Text style={[s.text, { color: colors.purple }]}>이미지 저장</Text>
      </PressableScale>
      <PressableScale onPress={send} style={[s.btn, s.solid]} scaleTo={0.96} haptic>
        <Icon name="heart" size={18} color={colors.white} />
        <Text style={[s.text, { color: colors.white }]}>친구에게 공유</Text>
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
