import React, { useEffect, useState } from 'react';
import { Linking, StyleSheet, Text, View } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Screen from '../../components/Screen';
import { LinearGradient } from 'expo-linear-gradient';
import Mascot from '../../components/Mascot';
import Card from '../../components/Card';
import TextField from '../../components/TextField';
import PrimaryButton from '../../components/PrimaryButton';
import PressableScale from '../../components/PressableScale';
import Disclaimer from '../../components/Disclaimer';
import FriendCompare from '../../components/FriendCompare';
import ShareCta, { ShareIconButton } from '../../components/ShareCta';
import { ActRow, Coin, DarkChip, Hero, Para, SubHead, heroTxt } from '../../components/premium/Kit';
import { useApp } from '../../context/AppContext';
import { usePremium } from '../../context/PremiumContext';
import { RootStackParamList } from '../../navigation/types';
import { ITEMS, fmtP } from '../../services/premium/catalog';
import {
  CONSULT_CATS, CONSULT_CONFIG, CRISIS_LINES, ConsultCat, ConsultEntry, MODE_LABEL, catOf, consultAnswer, guessCat, isCrisis, loadConsults, saveConsult,
} from '../../services/content/consult';
import { consultSpec } from '../../services/share/shareSpecs';
import { colors, gradients } from '../../theme/colors';
import { fonts, radius, txt, sansW } from '../../theme/typography';

const EXAMPLES = [
  '헤어진 지 3개월, 아직도 연락할지 말지 매일 고민돼요',
  '회사가 너무 힘든데 지금 퇴사해도 괜찮을까요?',
  '썸 타는 사람이 있는데 먼저 고백해도 될까요?',
  '친한 친구에게 서운한 게 쌓였는데 말해야 할까요?',
];

/** 유료: 말 못 할 고민 상담 — 쓰기(목록) 화면과 답변 화면을 id로 나눈다 */
export default function ConsultScreen() {
  const { params } = useRoute<RouteProp<RootStackParamList, 'Consult'>>();
  return params?.id ? <Answer id={params.id} /> : <Compose />;
}

function Compose() {
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { user: u, today, fortune } = useApp();
  const { owned, openUnlock, points } = usePremium();
  const [cat, setCat] = useState<ConsultCat | null>(null);
  const [picked, setPicked] = useState(false);
  const [text, setText] = useState('');
  const [list, setList] = useState<ConsultEntry[]>([]);
  useEffect(() => { loadConsults().then(setList); }, []);
  if (!u) return null;

  // 직접 고르지 않았으면 글에서 주제를 추측해 미리 골라 둔다
  const onText = (t: string) => { setText(t); if (!picked) setCat(guessCat(t)); };
  const crisis = isCrisis(text);
  const len = text.trim().length;
  const ok = !!cat && len >= CONSULT_CONFIG.minLen && !crisis;

  const submit = () => {
    if (!ok || !cat) return;
    const id = Date.now().toString(36);
    const entry: ConsultEntry = { id, cat, text: text.trim(), at: today };
    const item = ITEMS.consult(id);
    const done = async () => { await saveConsult(entry); nav.replace('Consult', { id }); };
    if (owned(item.key)) done(); else openUnlock(item, done);
  };

  return (
    <Screen title="상담" back right={<View style={s.coin}><Coin size={16} /><Text style={s.coinText}>{points.toLocaleString('ko-KR')}</Text></View>}>
      {/* 오늘의 기운 */}
      <View style={s.mood}>
        <LinearGradient colors={gradients.hero} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={StyleSheet.absoluteFill} />
        <View><Mascot size={60} palette="mint" face="look" prop="clover" shadow={false} /></View>
        <View style={{ flex: 1 }}>
          <Text style={txt.bodyStrong}>오늘 {u.nickname}님의 기운</Text>
          <Text style={[txt.small, { color: colors.inkSub, marginTop: 2 }]}>{fortune?.combined.summary ?? '오늘의 흐름을 읽고 있어요.'}</Text>
        </View>
      </View>

      <TextField
        value={text} onChangeText={onText} multiline maxLength={CONSULT_CONFIG.maxLen}
        placeholder="지금 마음에 걸리는 일을 편하게 적어주세요."
        containerStyle={s.input}
        style={{ height: 150, fontSize: 15, lineHeight: 23 }}
        accessibilityLabel="고민 내용"
      />
      <View style={s.between}>
        <Text style={txt.small}>{!picked && cat ? `'${catOf(cat).label}' 고민으로 골랐어요` : '구체적일수록 답이 정확해져요'}</Text>
        <Text style={[txt.small, len >= CONSULT_CONFIG.maxLen && { color: colors.danger }]}>{len}/{CONSULT_CONFIG.maxLen}</Text>
      </View>

      <View style={s.chips}>
        {CONSULT_CATS.map(c => {
          const on = cat === c.key;
          return (
            <PressableScale key={c.key} onPress={() => { setCat(c.key); setPicked(true); }} style={[s.chip, on && s.chipOn]} scaleTo={0.95} accessibilityState={{ selected: on }}>
              <Text style={[s.chipT, on && { color: colors.white }]}>{on ? '✓ ' : ''}{c.label}</Text>
            </PressableScale>
          );
        })}
      </View>

      {crisis ? (
        <Card style={s.crisis}>
          <Text style={[txt.h3, { color: colors.love }]}>지금 많이 힘드시죠</Text>
          <Para>이런 마음은 운세보다 사람의 도움이 먼저 필요해요. 혼자 견디지 말고 지금 바로 이야기해 주세요. 24시간 언제든 연결돼요.</Para>
          <View style={{ gap: 8, marginTop: 12 }}>
            {CRISIS_LINES.map(([k, v]) => (
              <PressableScale key={k} onPress={() => Linking.openURL(`tel:${v.replace(/-/g, '')}`)} style={s.line} scaleTo={0.98} accessibilityLabel={`${k} ${v}에 전화하기`}>
                <Text style={{ fontSize: 15, color: colors.ink }}>{k}</Text><Text style={{ fontSize: 18, fontWeight: '700', color: colors.love }}>{v}</Text>
              </PressableScale>
            ))}
          </View>
        </Card>
      ) : null}

      <PrimaryButton
        label={owned(ITEMS.consult('x').key) ? '상담 결과 보기' : `${CONSULT_CONFIG.cost}P로 상담받기`}
        icon={<Coin size={18} />} onPress={submit} disabled={!ok} style={{ marginTop: 16 }}
      />
      <Text style={[txt.small, { textAlign: 'center', marginTop: 10 }]}>{CONSULT_CONFIG.minLen}자 이상 적으면 상담받을 수 있어요 · 보유 {fmtP(points)}</Text>

      <SubHead title="이런 고민도 괜찮아요" caption="눌러서 바로 적어 보세요" />
      <View style={{ gap: 8, alignItems: 'flex-start' }}>
        {EXAMPLES.map(e => (
          <PressableScale key={e} onPress={() => onText(e)} style={s.example} scaleTo={0.98} accessibilityLabel={`예시 고민: ${e}`}>
            <Text style={txt.bodyStrong}>{e}</Text>
          </PressableScale>
        ))}
      </View>
      <Text style={[txt.small, { textAlign: 'center', marginTop: 20 }]}>나만 볼 수 있어요. 공유 카드에는 고민 내용이 절대 들어가지 않아요.</Text>

      {list.length ? (
        <>
          <SubHead title="지난 상담" />
          <Card style={{ paddingVertical: 2, paddingHorizontal: 16 }}>
            {list.map((e, i) => (
              <PressableScale key={e.id} onPress={() => nav.push('Consult', { id: e.id })} style={[s.hist, i > 0 && s.histLine]} scaleTo={0.98}>
                <Text style={s.histH}>{catOf(e.cat).hanja}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 15, fontWeight: '600', color: colors.ink }} numberOfLines={1}>{e.text}</Text>
                  <Text style={txt.caption}>{catOf(e.cat).label} · {e.at.replace(/-/g, '.')}</Text>
                </View>
              </PressableScale>
            ))}
          </Card>
        </>
      ) : null}
      <Disclaimer compact />
    </Screen>
  );
}

function Answer({ id }: { id: string }) {
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { user: u } = useApp();
  const [e, setE] = useState<ConsultEntry | null | undefined>(undefined);
  const [showQ, setShowQ] = useState(false);
  useEffect(() => { loadConsults().then(l => setE(l.find(x => x.id === id) ?? null)); }, [id]);
  if (!u || e === undefined) return <Screen title="고민 상담" back>{null}</Screen>;
  if (!e) return <Screen title="고민 상담" back><Text style={txt.body}>상담 기록을 찾을 수 없어요.</Text></Screen>;
  const A = consultAnswer(u, e.text, e.cat, e.at); const C = catOf(e.cat);
  const spec = consultSpec(u, e);
  const mx = Math.max(...A.flow.map(f => f.v));

  return (
    <Screen title="고민 상담" back right={<ShareIconButton spec={spec} />}>
      <FriendCompare route="Consult" spec={spec} />
      <PressableScale onPress={() => setShowQ(!showQ)} style={s.q} scaleTo={0.99}>
        <Text style={txt.caption}>나의 고민 · {C.label} · 나만 볼 수 있어요</Text>
        <Text style={[txt.body, { fontSize: 15, marginTop: 4 }]} numberOfLines={showQ ? undefined : 2}>{e.text}</Text>
      </PressableScale>

      <Hero>
        <Text style={heroTxt.eyebrow}>{C.hanja} {C.label} 고민에 대한 답</Text>
        <Text style={[heroTxt.summ, { fontSize: 18, lineHeight: 26 }]}>{A.headline}</Text>
        <View style={{ flexDirection: 'row', gap: 6, marginTop: 14 }}>
          <DarkChip gold>{MODE_LABEL[A.mode]}</DarkChip>
          <DarkChip>풀리는 달 {A.bestMonth}</DarkChip>
        </View>
      </Hero>

      <Card style={s.direct}>
        <Text style={s.directK}>결론부터</Text>
        <Text style={s.directV}>{A.direct}</Text>
      </Card>

      <SubHead title="01 · 마음 읽기" />
      <Card><Para mt={0}>{A.empathy}</Para></Card>

      <SubHead title="02 · 사주로 본 나" />
      <Card>
        <Para mt={0}>{A.me}</Para>
        <Para mt={10}>{A.star}</Para>
      </Card>

      <SubHead title="03 · 지금의 흐름" caption={`앞으로 3개월 · ${C.label} 운`} />
      <Card>
        <Para mt={0}>{A.now}</Para>
        <View style={s.bars}>
          {A.flow.map(f => (
            <View key={f.label} style={s.barCol}>
              <Text style={[s.barV, f.v === mx && { color: colors.love }]}>{f.v}</Text>
              <View style={[s.bar, { height: Math.max(10, (f.v - 50) * 1.8), backgroundColor: f.v === mx ? colors.love : colors.loveBg }]} />
              <Text style={txt.caption}>{f.label}</Text>
            </View>
          ))}
        </View>
      </Card>

      <SubHead title="04 · 이렇게 해 보세요" />
      <Card style={{ gap: 10 }}>{A.dos.map(t => <ActRow key={t}>{t}</ActRow>)}</Card>

      <SubHead title="05 · 이것만은 피하세요" />
      <Card style={{ gap: 10 }}>{A.avoid.map(t => <ActRow key={t} ok={false}>{t}</ActRow>)}</Card>

      <SubHead title="06 · 행동하기 좋은 날" caption="앞으로 30일 중 이 고민에 힘이 실리는 날" />
      <View style={{ flexDirection: 'row', gap: 8 }}>
        {A.days.map(d => <View key={d.iso} style={s.day}><Text style={{ fontSize: 15, fontWeight: '700', color: colors.love }}>{d.label}</Text></View>)}
      </View>

      <Card style={s.closing}>
        <Text style={s.idiom}>{A.idiom[1]}</Text>
        <Text style={[txt.caption, { textAlign: 'center' }]}>{A.idiom[0]} · {A.idiom[2]}</Text>
        <Text style={s.closeText}>{A.closing}</Text>
      </Card>

      <ShareCta spec={spec} />
      <PrimaryButton label="다른 고민 상담하기" variant="soft" onPress={() => nav.navigate('Consult')} style={{ marginTop: 12 }} />
      <Text style={[txt.caption, { textAlign: 'center', marginTop: 12 }]}>재미와 참고를 위한 상담이에요. 마음이 많이 힘들 땐 전문가와 이야기해 주세요 (109 · 1577-0199).</Text>
    </Screen>
  );
}

const s = StyleSheet.create({
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 16 },
  chip: { paddingHorizontal: 16, paddingVertical: 9, borderRadius: radius.pill, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.lineStrong },
  chipOn: { backgroundColor: colors.navy, borderColor: colors.navy },
  coin: { flexDirection: 'row', alignItems: 'center', gap: 5, height: 32, paddingHorizontal: 12, borderRadius: radius.pill, backgroundColor: colors.lavenderSoft },
  coinText: { fontSize: 13, fontWeight: '700', color: colors.ink },
  mood: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: radius.lg, overflow: 'hidden', marginTop: 4 },
  input: { marginTop: 16, borderRadius: 14, borderWidth: 1.5, borderColor: colors.seal + 'AA' },
  example: { paddingHorizontal: 16, paddingVertical: 12, borderRadius: radius.lg, backgroundColor: colors.lavenderSoft },
  chipH: { fontFamily: fonts.serif, fontSize: 18, fontWeight: '700', color: colors.purple },
  chipT: { fontSize: 15, fontWeight: '600', color: colors.inkSub },
  between: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  crisis: { marginTop: 16, borderWidth: 1.5, borderColor: colors.love },
  line: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 12, borderRadius: radius.md, backgroundColor: colors.loveBg },
  hist: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14 },
  histLine: { borderTopWidth: 1, borderTopColor: colors.line },
  histH: { fontFamily: fonts.serif, fontSize: 24, fontWeight: '800', color: colors.seal, width: 28, textAlign: 'center' },
  direct: { marginTop: 12, borderLeftWidth: 3, borderLeftColor: colors.seal },
  directK: { fontSize: 13, fontWeight: '700', color: colors.seal, letterSpacing: 1 },
  directV: { ...sansW('600'), fontSize: 15, lineHeight: 23, color: colors.ink, marginTop: 6 },
  q: { padding: 20, borderRadius: radius.lg, backgroundColor: colors.lavenderSoft, marginBottom: 12 },
  bars: { flexDirection: 'row', alignItems: 'flex-end', gap: 14, height: 120, marginTop: 16 },
  barCol: { flex: 1, alignItems: 'center', justifyContent: 'flex-end', gap: 6 },
  barV: { fontFamily: fonts.serif, fontSize: 13, fontWeight: '600', color: colors.inkMute },
  bar: { width: '50%', borderRadius: 6 },
  day: { flex: 1, alignItems: 'center', paddingVertical: 14, borderRadius: radius.lg, backgroundColor: colors.loveBg },
  closing: { marginTop: 24, alignItems: 'center', paddingVertical: 24 },
  idiom: { fontFamily: fonts.serif, fontSize: 24, fontWeight: '800', color: colors.seal, letterSpacing: 4 },
  closeText: { ...sansW('600'), fontSize: 15, lineHeight: 23, color: colors.ink, textAlign: 'center', marginTop: 14 },
});
