import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import Screen from '../components/Screen';
import SectionHeader from '../components/SectionHeader';
import Disclaimer from '../components/Disclaimer';
import { AlmanacHero, Figure, Ledger, Quote } from '../components/Almanac';
import { useApp } from '../context/AppContext';
import { RootStackParamList } from '../navigation/types';
import { analysisTheme, colors } from '../theme/colors';
import { fonts, radius } from '../theme/typography';
import { KEYWORDS } from '../data/keywords';
import { LockCard } from '../components/premium/Kit';
import { ITEMS } from '../services/premium/catalog';
import { BRANCHES, ELEMENT_INFO, Element, STEMS } from '../data/sajuData';
import { THAI_DAYS, ThaiDay, WEEKDAY_TO_THAI } from '../data/thaiData';
import { buildChart, dayPillar, elementCounts } from '../services/fortune/sajuService';
import { birthThaiDay, verdictKo } from '../services/fortune/thaiAstrologyService';
import Ico from '../components/Ico';
import { AXES } from '../services/fortune/mbtiService';
import { MBTI_INFO } from '../data/mbtiData';
import { AstroReport, BloodType, User } from '../types';
import { weekdayOf } from '../utils/date';

const KICKER = { saju: 'SAJU · 사주', thai: 'ASTROLOGY · 점성술', mbti: 'MBTI · 성향', blood: 'BLOOD · 혈액형' } as const;
const HERO_MASCOT = {
  saju: { palette: 'peach', face: 'look', prop: 'sparkle' },
  thai: { palette: 'classic', face: 'curious', prop: 'sparkle' },
  mbti: { palette: 'lavender', face: 'sleepy', prop: 'music' },
  blood: { palette: 'pink', face: 'happy', prop: 'heart' },
} as const;
const NOTE: Record<string, string> = {
  saju: '양력 기준 근사 만세력으로 계산해요. 정밀 계산은 업데이트 예정이에요.',
  thai: '세 점성술을 각자 계산해 나란히 놓은 참고 지표예요. 해·달 위치는 천문 근사식(오차 약 0.3°)으로 계산하고, 태어난 장소가 필요한 상승궁·하우스는 넣지 않았어요.',
  mbti: 'MBTI는 예측이 아닌 성향 분석이에요.',
  blood: '혈액형 성격론은 재미를 위한 콘텐츠예요.',
};

/** 4가지 관점 상세 — 책력 한 장 + 관점별 도해 + 풀이 + 장부형 분석 */
export default function AnalysisDetailScreen() {
  const { params } = useRoute<RouteProp<RootStackParamList, 'AnalysisDetail'>>();
  const { fortune, user, today } = useApp();
  const nav = useNavigation();
  if (!fortune || !user) return null;
  const a = fortune.analyses[params.source];
  const t = analysisTheme[params.source];

  return (
    <Screen title={t.label} back>
      <AlmanacHero mascot={HERO_MASCOT[a.source]} tone={t} kicker={KICKER[a.source]} seal={t.emoji} eyebrow={t.sub} title={a.headline} today={today} tags={a.tags.map(tag => KEYWORDS[tag].label)}>
        <Quote label="오늘의 풀이" text={a.description} tone={t.color} />
      </AlmanacHero>

      {a.source === 'saju' ? <SajuFigure u={user} today={today} tone={t.color} /> : null}
      {a.source === 'thai' && a.astro ? <AstroFigure report={a.astro} u={user} today={today} tone={t.color} /> : null}
      {a.source === 'mbti' ? <MbtiFigure u={user} focus={a.details[2]?.value ?? ''} tone={t.color} /> : null}
      {a.source === 'blood' ? <BloodFigure b={user.bloodType} tone={t.color} /> : null}

      {a.astro ? null : (
        <>
          <SectionHeader title="분석 내용" />
          <Ledger rows={a.details.map(d => [d.label, d.value] as [string, string])} tone={t.color} />
        </>
      )}

      {a.source === 'saju' ? (
        <LockCard mt={12} title="상세 사주 해석 보기" desc="원국표 · 오행 분포 · 나의 본성 · 올해와 이달의 흐름" item={ITEMS.sajuDeep()} onPress={() => nav.navigate('SajuDeep')} />
      ) : null}
      <Text style={s.note}>{NOTE[a.source]}</Text>
      <Disclaimer compact />
    </Screen>
  );
}

/* ---------- 사주: 원국표 + 오행 분포 ---------- */
const EL_ORDER: Element[] = ['wood', 'fire', 'earth', 'metal', 'water'];
function SajuFigure({ u, today, tone }: { u: User; today: string; tone: string }) {
  const ch = buildChart(u.birthDate, u.birthTime);
  const cols: [string, typeof ch.day | null][] = [['시', ch.hour], ['일', ch.day], ['월', ch.month], ['년', ch.year]];
  const cnt = elementCounts(ch); const total = EL_ORDER.reduce((n, e) => n + cnt[e], 0) || 1;
  const td = dayPillar(today);
  return (
    <Figure title="나의 사주 원국" caption={`오늘의 일진 ${STEMS[td.stem].hanja}${BRANCHES[td.branch].hanja}`}>
      <View style={s.pillars}>
        {cols.map(([l, p]) => (
          <View key={l} style={[s.pillar, l === '일' && { borderColor: tone, backgroundColor: tone + '12' }]}>
            <Text style={[s.pLabel, l === '일' && { color: tone }]}>{l}주{l === '일' ? ' · 나' : ''}</Text>
            {p ? (
              <>
                <Text style={[s.pHan, { color: ELEMENT_INFO[STEMS[p.stem].element].hex }]}>{STEMS[p.stem].hanja}</Text>
                <Text style={[s.pHan, { color: ELEMENT_INFO[BRANCHES[p.branch].element].hex }]}>{BRANCHES[p.branch].hanja}</Text>
              </>
            ) : <Text style={s.pUnknown}>미상</Text>}
          </View>
        ))}
      </View>
      <Text style={s.subTitle}>오행 분포</Text>
      <View style={s.elBar}>
        {EL_ORDER.filter(e => cnt[e] > 0).map(e => <View key={e} style={{ flex: cnt[e] / total, backgroundColor: ELEMENT_INFO[e].hex }} />)}
      </View>
      <View style={s.elLegend}>
        {EL_ORDER.map(e => (
          <View key={e} style={s.elItem}>
            <Text style={[s.elHan, { color: ELEMENT_INFO[e].hex }]}>{ELEMENT_INFO[e].hanja}</Text>
            <Text style={[s.elCnt, cnt[e] === 0 && { color: colors.danger }]}>{cnt[e]}</Text>
          </View>
        ))}
      </View>
    </Figure>
  );
}

/* ---------- 점성술: 세 갈래 지표 + 일치도 ---------- */
const WEEK = ['일', '월', '화', '수', '목', '금', '토'];
const V_COLOR = { good: colors.success, neutral: colors.inkMute, care: colors.danger } as const;
const V_BG = { good: colors.okBg, neutral: colors.lavenderSoft, care: colors.loveBg } as const;
const SYS_CH = { western: '西', vedic: '印', thai: '泰' } as const;

function AstroFigure({ report, u, today, tone }: { report: AstroReport; u: User; today: string; tone: string }) {
  const neutral = 3 - report.goodCount - report.careCount;
  return (
    <>
      <Figure title="세 점성술 일치도" caption={`좋음 ${report.goodCount} · 보통 ${neutral} · 주의 ${report.careCount}`}>
        <View style={s.agree}>
          {report.systems.map(x => (
            <View key={x.key} style={[s.agreeCell, { backgroundColor: V_BG[x.verdict] }]}>
              <Text style={s.agreeName}>{x.name.replace(' 점성술', '')}</Text>
              <Text style={[s.agreeV, { color: V_COLOR[x.verdict] }]}>{verdictKo(x.verdict)}</Text>
            </View>
          ))}
        </View>
        <Text style={[s.figNote, { borderLeftColor: tone }]}>
          {report.goodCount >= 2 ? '두 곳 이상이 같은 방향을 가리키면 그날의 흐름으로 봐도 좋아요.' : report.careCount >= 2 ? '주의 신호가 겹친 날이에요. 큰 결정은 하루 미뤄도 괜찮아요.' : '신호가 엇갈리는 날은 한쪽에 기대기보다 균형을 잡는 게 좋아요.'}
        </Text>
      </Figure>

      {report.systems.map(x => (
        <Figure key={x.key} title={x.name} caption={x.basis}>
          <View style={s.sysHead}>
            <Ico ch={SYS_CH[x.key]} size={40} color={tone} />
            <Text style={[s.sysReading, { flex: 1 }]}>{x.reading}</Text>
            <View style={[s.vPill, { backgroundColor: V_BG[x.verdict] }]}><Text style={[s.vText, { color: V_COLOR[x.verdict] }]}>{verdictKo(x.verdict)}</Text></View>
          </View>
          <View style={s.sysRows}>
            {x.rows.map(([k, v]) => (
              <View key={k} style={s.sysRow}>
                <Text style={s.sysK}>{k}</Text>
                <Text style={s.sysV}>{v}</Text>
              </View>
            ))}
          </View>
          {x.key === 'thai' ? <ThaiWeek u={u} today={today} tone={tone} /> : null}
        </Figure>
      ))}
      {report.approx ? <Text style={s.approxNote}>출생 시각을 몰라 정오 기준으로 계산했어요. 달은 하루에 약 13° 움직여서 탄생 낙샤트라와 달 라시가 한 칸 달라질 수 있어요. 마이에서 출생 시각을 넣으면 더 정확해져요.</Text> : null}
    </>
  );
}

/** 태국: 일곱 요일의 행성 띠 */
function ThaiWeek({ u, today, tone }: { u: User; today: string; tone: string }) {
  const mine = birthThaiDay(u.birthDate, u.birthTime);
  const mineIdx = WEEKDAY_TO_THAI.indexOf(mine === 'wedNight' ? 'wedDay' : mine);
  const todayIdx = weekdayOf(today);
  return (
    <View style={[s.week, { marginTop: 16 }]}>
      {WEEKDAY_TO_THAI.map((k: ThaiDay, i) => {
        const d = THAI_DAYS[k]; const isMine = i === mineIdx; const isToday = i === todayIdx;
        return (
          <View key={k} style={s.day}>
            <View style={[s.dot, { backgroundColor: isMine ? d.hex : 'transparent', borderColor: d.hex }, isToday && s.todayRing]} />
            <Text style={[s.dayL, (isMine || isToday) && { color: colors.ink, fontWeight: '700' }]}>{WEEK[i]}</Text>
            <Text style={s.planet}>{d.planetKo}</Text>
            {isToday ? <View style={[s.todayMark, { backgroundColor: tone }]} /> : <View style={s.todayMark} />}
          </View>
        );
      })}
    </View>
  );
}

/* ---------- MBTI: 4개 축 ---------- */
function MbtiFigure({ u, focus, tone }: { u: User; focus: string; tone: string }) {
  return (
    <Figure title={`${u.mbti} · ${MBTI_INFO[u.mbti].nickname}${u.mbtiUnknown ? ' (추정)' : ''}`} caption="오늘 강조되는 축 ●">
      <View style={{ gap: 14 }}>
        {AXES.map(([l, r, name], i) => {
          const left = u.mbti[i] === l; const hot = focus.startsWith(name);
          return (
            <View key={name}>
              <View style={s.axisHead}>
                <Text style={[s.axisName, hot && { color: tone }]}>{hot ? '● ' : ''}{name}</Text>
              </View>
              <View style={s.axis}>
                <Text style={[s.axisL, left && { color: tone }]}>{l}</Text>
                <View style={s.axisTrack}>
                  <View style={[s.axisFill, { backgroundColor: tone, [left ? 'left' : 'right']: 0 } as object]} />
                </View>
                <Text style={[s.axisL, !left && { color: tone }]}>{r}</Text>
              </View>
            </View>
          );
        })}
      </View>
    </Figure>
  );
}

/* ---------- 혈액형 ---------- */
function BloodFigure({ b, tone }: { b: BloodType; tone: string }) {
  return (
    <Figure title="나의 혈액형">
      <View style={s.bloodRow}>
        {(['A', 'B', 'O', 'AB'] as BloodType[]).map(x => (
          <View key={x} style={[s.blood, x === b ? { backgroundColor: tone, borderColor: tone } : null]}>
            <Text style={[s.bloodT, x === b && { color: colors.white }]}>{x}</Text>
            <Text style={[s.bloodS, x === b && { color: 'rgba(251,244,232,0.8)' }]}>형</Text>
          </View>
        ))}
      </View>
    </Figure>
  );
}

const s = StyleSheet.create({
  note: { fontSize: 13, color: colors.inkMute, textAlign: 'center', marginTop: 16 },
  pillars: { flexDirection: 'row', gap: 8 },
  pillar: { flex: 1, alignItems: 'center', paddingVertical: 10, borderRadius: radius.md, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.cream },
  pLabel: { fontSize: 13, fontWeight: '700', color: colors.inkMute },
  pHan: { fontFamily: fonts.serif, fontSize: 24, lineHeight: 32, fontWeight: '800', marginTop: 2 },
  pUnknown: { fontSize: 13, color: colors.inkMute, marginTop: 24, marginBottom: 20 },
  subTitle: { fontSize: 13, fontWeight: '700', color: colors.inkSub, marginTop: 18, marginBottom: 8 },
  elBar: { flexDirection: 'row', height: 10, borderRadius: 5, overflow: 'hidden', gap: 2 },
  elLegend: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  elItem: { alignItems: 'center', flex: 1 },
  elHan: { fontFamily: fonts.serif, fontSize: 18, fontWeight: '700' },
  elCnt: { fontSize: 13, fontWeight: '700', color: colors.inkSub, marginTop: 1 },
  week: { flexDirection: 'row', justifyContent: 'space-between' },
  day: { alignItems: 'center', flex: 1, gap: 5 },
  dot: { width: 22, height: 22, borderRadius: 11, borderWidth: 2 },
  todayRing: { shadowColor: '#000', shadowOpacity: 0, borderWidth: 3, transform: [{ scale: 1.12 }] },
  dayL: { fontSize: 13, fontWeight: '600', color: colors.inkSub },
  planet: { fontSize: 13, color: colors.inkMute },
  todayMark: { width: 14, height: 3, borderRadius: 2 },
  agree: { flexDirection: 'row', gap: 8 },
  agreeCell: { flex: 1, alignItems: 'center', paddingVertical: 14, borderRadius: radius.md, gap: 2 },
  agreeName: { fontSize: 13, fontWeight: '600', color: colors.inkSub },
  agreeV: { fontSize: 18, lineHeight: 26, fontWeight: '700' },
  sysHead: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  sysReading: { fontSize: 15, lineHeight: 23, color: colors.ink },
  vPill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: radius.pill },
  vText: { fontSize: 13, fontWeight: '700' },
  sysRows: { marginTop: 16, borderTopWidth: 1, borderTopColor: colors.line },
  sysRow: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.line },
  sysK: { fontSize: 13, fontWeight: '600', color: colors.inkMute },
  sysV: { fontSize: 15, lineHeight: 23, fontWeight: '600', color: colors.ink, marginTop: 2 },
  approxNote: { fontSize: 13, lineHeight: 19, color: colors.inkMute, marginTop: 12 },
  figNote: { marginTop: 16, paddingLeft: 10, borderLeftWidth: 2, fontSize: 13, lineHeight: 19, color: colors.inkSub },
  axisHead: { flexDirection: 'row', justifyContent: 'space-between' },
  axisName: { fontSize: 13, fontWeight: '700', color: colors.inkMute },
  axis: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 6 },
  axisL: { width: 16, textAlign: 'center', fontFamily: fonts.serif, fontSize: 18, fontWeight: '700', color: colors.inkMute },
  axisTrack: { flex: 1, height: 8, borderRadius: 4, backgroundColor: colors.line, overflow: 'hidden' },
  axisFill: { position: 'absolute', top: 0, bottom: 0, width: '58%', borderRadius: 4 },
  bloodRow: { flexDirection: 'row', gap: 8 },
  blood: { flex: 1, flexDirection: 'row', alignItems: 'baseline', justifyContent: 'center', paddingVertical: 16, borderRadius: radius.md, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.cream },
  bloodT: { fontFamily: fonts.serif, fontSize: 24, fontWeight: '800', color: colors.inkMute },
  bloodS: { fontSize: 13, fontWeight: '600', color: colors.inkMute, marginLeft: 2 },
});
