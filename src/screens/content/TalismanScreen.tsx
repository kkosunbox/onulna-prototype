import React, { useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Screen from '../../components/Screen';
import ShareActions from '../../components/ShareActions';
import TalismanCard from '../../components/TalismanCard';
import Segmented from '../../components/Segmented';
import TextField from '../../components/TextField';
import PrimaryButton from '../../components/PrimaryButton';
import Mascot from '../../components/Mascot';
import { CHARM_EN, CHARM_THEME, WISHES } from '../../data/charms';
import PressableScale from '../../components/PressableScale';
import Icon from '../../components/Icon';
import { SubHead } from '../../components/premium/Kit';
import { useApp } from '../../context/AppContext';
import { usePremium } from '../../context/PremiumContext';
import { todayTalisman } from '../../services/content/freeContent';
import { shareCardImage } from '../../services/shareService';
import { useShare } from '../../services/share/useShare';
import { formatKoreanDate, parseISO } from '../../utils/date';
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
  const { reward, sendLink } = useShare();
  const [mode, setMode] = useState<'mine' | 'gift'>('mine');
  const [wishKey, setWishKey] = useState(WISHES[0].key);
  const [to, setTo] = useState('');
  if (!u) return null;
  const t = todayTalisman(u, today);
  const power = t.score >= 85 ? 5 : t.score >= 75 ? 4 : t.score >= 65 ? 3 : 2;
  const left = Math.max(1, 24 - new Date().getHours());
  const { y, m, d } = parseISO(today);
  const no = String(Math.round((Date.UTC(y, m - 1, d) - Date.UTC(y, 0, 0)) / 86400000)).padStart(3, '0');
  const mine = { hanja: t.hanja, name: `${t.keyword}의 부적`, en: CHARM_EN[t.tag], mantra: t.mantra, theme: CHARM_THEME[t.tag] };

  // 선물 부적: 받는 사람에게 빌어 줄 소원을 골라 보낸다
  const wish = WISHES.find(w => w.key === wishKey) ?? WISHES[0];
  const toName = to.trim() || '소중한 너';
  const gifting = mode === 'gift';
  const charm = gifting ? wish : mine;
  const base = talismanSpec(u, today);
  const spec = gifting
    ? { ...base, kind: '부적 선물', headline: wish.mantra, sub: `${wish.hanja} · ${wish.name}`, file: 'woonpick-gift-charm', short: `${wish.hanja} ${wish.name}`,
        text: `${toName}에게 ${u.nickname}이(가) '${wish.hanja}' ${wish.name}을 보냈어요. "${wish.mantra}" 운알이가 꼭 지켜 줄 거예요!` }
    : base;
  const save = async () => {
    const r = await shareCardImage(card, { file: spec.file, mode: 'save' });
    if (r === 'saved' || r === 'shared') { toast(gifting ? '선물 부적을 저장했어요. 친구에게 보내 보세요' : '부적을 저장했어요. 배경화면으로 써 보세요'); reward(spec); }
  };
  const give = async () => {
    const r = await shareCardImage(card, { file: spec.file, text: spec.text, mode: 'share' });
    if (r === 'shared' || r === 'saved') { reward(spec); if (r === 'saved') toast('부적 이미지를 저장했어요. 친구에게 보내 보세요'); }
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
      <FriendCompare route="Talisman" spec={base} />
      <Segmented<'mine' | 'gift'> options={[{ key: 'mine', label: '오늘 나의 부적' }, { key: 'gift', label: '부적 선물하기' }]} value={mode} onChange={setMode} />

      {gifting ? (
        <View style={s.form}>
          <Text style={s.formLabel}>어떤 마음을 담을까요?</Text>
          <View style={s.wishes}>
            {WISHES.map(w => {
              const on = w.key === wishKey;
              return (
                <PressableScale key={w.key} onPress={() => setWishKey(w.key)} scaleTo={0.95} style={[s.wish, on && { backgroundColor: w.theme.to, borderColor: w.theme.to }]} accessibilityRole="radio" accessibilityState={{ selected: on }} accessibilityLabel={`${w.label} 부적`}>
                  <Text style={[s.wishHanja, { color: on ? '#FFFFFF' : w.theme.deep }]}>{w.hanja}</Text>
                  <Text style={[s.wishText, on && { color: '#FFFFFF' }]}>{w.label}</Text>
                </PressableScale>
              );
            })}
          </View>
          <Text style={[s.formLabel, { marginTop: 16 }]}>누구에게 보낼까요?</Text>
          <TextField value={to} onChangeText={v => setTo(v.slice(0, 8))} placeholder="받는 사람 이름 (예: 지원이)" maxLength={8} returnKeyType="done" containerStyle={{ marginTop: 8 }} />
        </View>
      ) : null}

      <View style={{ alignItems: 'center', marginTop: 16 }}>
        <View style={[s.shadow, shadow.hero]}>
          <TalismanCard ref={card} c={charm} to={gifting ? toName : `${u.nickname}님`} from={gifting ? u.nickname : '운알이'} dateLabel={formatKoreanDate(today)} no={no} />
        </View>
        {gifting ? null : (
          <View style={s.valid}>
            <Text style={s.validText}>효력 <Text style={{ color: mine.theme.to }}>{'★'.repeat(power)}</Text><Text style={{ color: colors.lineStrong }}>{'★'.repeat(5 - power)}</Text>  ·  오늘 자정까지 약 {left}시간</Text>
          </View>
        )}
      </View>

      {gifting ? (
        <View style={{ gap: 8, marginTop: 16 }}>
          <PrimaryButton label={`${toName}에게 부적 보내기`} onPress={give} />
          <PrimaryButton label="이미지로 저장" variant="soft" onPress={save} />
          <Text style={[txt.caption, { textAlign: 'center', marginTop: 4 }]}>운알이가 받는 사람을 하루 동안 지켜 줄 거예요</Text>
        </View>
      ) : (
        <>
          <ShareActions spec={spec} />
          <PressableScale onPress={() => setMode('gift')} scaleTo={0.98} style={s.giftCta} accessibilityLabel="친구에게 부적 선물하기">
            <Mascot size={52} face="wink" prop="heart" shadow={false} />
            <View style={{ flex: 1 }}>
              <Text style={txt.bodyStrong}>친구에게 부적을 선물해 보세요</Text>
              <Text style={[txt.small, { marginTop: 2 }]}>합격 · 연애 · 건강… 마음을 담아 한 장 보내요</Text>
            </View>
            <Icon name="chevronRight" size={18} color={colors.inkMute} strokeWidth={2.2} />
          </PressableScale>
        </>
      )}

      {gifting ? null : (<>
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
      </>)}
    </Screen>
  );
}

const s = StyleSheet.create({
  shadow: { borderRadius: 24 },
  form: { marginTop: 16, padding: 16, borderRadius: radius.lg, backgroundColor: colors.lavenderSoft },
  formLabel: { ...txt.bodyStrong, fontWeight: '700' },
  wishes: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 10 },
  wish: { width: '23%', flexGrow: 1, alignItems: 'center', paddingVertical: 10, borderRadius: radius.md, backgroundColor: colors.card, borderWidth: 1.5, borderColor: colors.card },
  wishHanja: { fontFamily: fonts.serif, fontSize: 24, lineHeight: 30, fontWeight: '800' },
  wishText: { ...sansW('700'), fontSize: 13, color: colors.inkSub, marginTop: 2 },
  giftCta: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 12, padding: 16, borderRadius: radius.lg, backgroundColor: colors.lavenderSoft },
  valid: { marginTop: 14, paddingHorizontal: 14, paddingVertical: 7, borderRadius: radius.pill, backgroundColor: colors.lavenderSoft },
  validText: { ...sansW('700'), fontSize: 13, color: colors.inkSub },

  lucky: { flexDirection: 'row', gap: 8 },
  tile: { flex: 1, alignItems: 'center', paddingVertical: 16, paddingHorizontal: 6, borderRadius: radius.lg, backgroundColor: colors.lavenderSoft },
  swatch: { width: 36, height: 36, borderRadius: 18, borderWidth: 3, borderColor: colors.card },
  clock: { fontFamily: fonts.serif, fontSize: 24, lineHeight: 36, fontWeight: '800', color: INK },
  tileV: { ...sansW('800'), fontSize: 15, color: colors.ink, marginTop: 8 },
  tileK: { ...txt.micro, marginTop: 2 },
});
