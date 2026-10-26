import React, { useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Screen from '../../components/Screen';
import ShareActions from '../../components/ShareActions';
import TalismanCard from '../../components/TalismanCard';
import PressableScale from '../../components/PressableScale';
import Icon from '../../components/Icon';
import { SubHead } from '../../components/premium/Kit';
import { useApp } from '../../context/AppContext';
import { usePremium } from '../../context/PremiumContext';
import { todayTalisman } from '../../services/content/freeContent';
import { shareCardImage } from '../../services/shareService';
import { useShare } from '../../services/share/useShare';
import { formatKoreanDate } from '../../utils/date';
import { colors } from '../../theme/colors';
import { fonts, radius, sansW, shadow, txt } from '../../theme/typography';
import { talismanSpec } from '../../services/share/shareSpecs';
import FriendCompare from '../../components/FriendCompare';

const INK = '#C9402B';

/** 무료: 매일 바뀌는 오늘의 부적 — 운알이가 건네는 귀여운 부적 한 장(오른쪽 위에서 이미지 저장) */
export default function TalismanScreen() {
  const { user: u, today } = useApp();
  const card = useRef<View>(null);
  const { toast } = usePremium();
  const { reward } = useShare();
  if (!u) return null;
  const t = todayTalisman(u, today);
  const power = t.score >= 85 ? 5 : t.score >= 75 ? 4 : t.score >= 65 ? 3 : 2;
  const left = Math.max(1, 24 - new Date().getHours());
  const spec = talismanSpec(u, today);
  const save = async () => {
    const r = await shareCardImage(card, { file: spec.file, mode: 'save' });
    if (r === 'saved' || r === 'shared') { toast('부적을 저장했어요. 배경화면으로 써 보세요'); reward(spec); }
  };

  return (
    <Screen
      title="오늘의 부적"
      back
      right={
        <PressableScale onPress={save} hitSlop={10} scaleTo={0.9} style={{ padding: 6 }} accessibilityLabel="부적 이미지 저장">
          <Icon name="download" size={24} color={colors.ink} strokeWidth={2.2} />
        </PressableScale>
      }
    >
      <FriendCompare route="Talisman" spec={spec} />

      <View style={{ alignItems: 'center' }}>
        <View style={[s.shadow, shadow.hero]}>
          <TalismanCard ref={card} t={t} name={u.nickname} dateLabel={formatKoreanDate(today)} />
        </View>
        <View style={s.valid}>
          <Text style={s.validText}>효력 <Text style={{ color: INK }}>{'★'.repeat(power)}</Text><Text style={{ color: colors.lineStrong }}>{'★'.repeat(5 - power)}</Text>  ·  오늘 자정까지 약 {left}시간</Text>
        </View>
      </View>

      <ShareActions spec={spec} />

      <SubHead title="부적과 함께하는 행운" caption="매일 자정에 새 부적으로 바뀌어요" />
      <View style={s.lucky}>
        <View style={s.tile}>
          <View style={[s.swatch, { backgroundColor: t.colorHex }]} />
          <Text style={s.tileV} numberOfLines={1}>{t.color}</Text>
          <Text style={s.tileK}>행운의 색</Text>
        </View>
        <View style={s.tile}>
          <Text style={s.clock}>數</Text>
          <Text style={s.tileV}>{t.number}번</Text>
          <Text style={s.tileK}>행운의 숫자</Text>
        </View>
        <View style={s.tile}>
          <Text style={s.clock}>時</Text>
          <Text style={s.tileV} numberOfLines={1}>{t.time.split('~')[0]}</Text>
          <Text style={s.tileK}>~{t.time.split('~')[1] ?? ''} 까지</Text>
        </View>
      </View>
      <Text style={[txt.caption, { textAlign: 'center', marginTop: 16 }]}>휴대폰 배경화면으로 저장해 두고 하루를 시작해 보세요.</Text>
    </Screen>
  );
}

const s = StyleSheet.create({
  shadow: { borderRadius: 24, marginTop: 4 },
  valid: { marginTop: 14, paddingHorizontal: 14, paddingVertical: 7, borderRadius: radius.pill, backgroundColor: colors.lavenderSoft },
  validText: { ...sansW('700'), fontSize: 13, color: colors.inkSub },

  lucky: { flexDirection: 'row', gap: 8 },
  tile: { flex: 1, alignItems: 'center', paddingVertical: 16, paddingHorizontal: 6, borderRadius: radius.lg, backgroundColor: colors.lavenderSoft },
  swatch: { width: 36, height: 36, borderRadius: 18, borderWidth: 3, borderColor: colors.card },
  clock: { fontFamily: fonts.serif, fontSize: 24, lineHeight: 36, fontWeight: '800', color: INK },
  tileV: { ...sansW('800'), fontSize: 15, color: colors.ink, marginTop: 8 },
  tileK: { ...txt.micro, marginTop: 2 },
});
