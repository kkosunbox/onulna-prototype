import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Screen from '../components/Screen';
import Segmented from '../components/Segmented';
import Card from '../components/Card';
import ScoreRing from '../components/ScoreRing';
import CategoryRow from '../components/CategoryRow';
import SectionHeader from '../components/SectionHeader';
import Disclaimer from '../components/Disclaimer';
import { LinearGradient } from 'expo-linear-gradient';
import Mascot from '../components/Mascot';
import Icon from '../components/Icon';
import { PromoCard } from '../components/HeroCard';
import { usePremium } from '../context/PremiumContext';
import { ITEMS } from '../services/premium/catalog';
import { parseISO, toISODate } from '../utils/date';
import { fortuneOf } from '../services/premium/engine';
import { Clouds, Floating } from '../components/Stage';
import { useApp } from '../context/AppContext';
import { getPeriodFortune } from '../services/fortune/periodFortuneService';
import { dayLenses, lensVerdict, periodLenses } from '../services/fortune/insightService';
import LensList from '../components/LensList';
import { Period } from '../types';
import { CategoryKey, categoryTheme, colors, gradients } from '../theme/colors';
import { IconName } from '../components/Icon';
import { radius, sansW, shadow, txt } from '../theme/typography';
import { motion, useReducedMotion } from '../utils/motion';
import { COPY } from '../content/copy';

const TABS: { key: Period; label: string }[] = [
  { key: 'daily', label: '오늘' }, { key: 'weekly', label: '주간' }, { key: 'monthly', label: '월간' }, { key: 'yearly', label: '연간' },
];
const CHART_H = 120;
const CAT_ICON: Record<CategoryKey, IconName> = { love: 'heart', money: 'coin', work: 'briefcase', relationship: 'people' };
const gradeOf = (n: number) => (n >= 85 ? '아주 좋음' : n >= 72 ? '좋음' : n >= 60 ? '보통' : '쉬어 가기');
/** 추천 카드마다 운알이 모습 */
const PROMO_CH: Record<string, string> = { consult: '談', spouse: '緣', crush: '心', 'theme-love': '緣' };
const CATS: CategoryKey[] = ['love', 'money', 'work', 'relationship'];
/** 목록에 가격만 보여주기 위한 대표 상품 */
const CONSULT_ITEM = { ...ITEMS.consult('preview'), title: '고민 상담 1회' };
const CRUSH_ITEM = { ...ITEMS.crush('', ''), key: 'crush-preview', title: '그 사람의 속마음' };

function FlowBar({ label, score, best, index }: { label: string; score: number; best: boolean; index: number }) {
  const reduced = useReducedMotion();
  const h = useRef(new Animated.Value(0)).current;
  const target = Math.max(10, ((score - 50) / 50) * CHART_H);
  useEffect(() => {
    if (reduced) { h.setValue(target); return; }
    h.setValue(0);
    Animated.timing(h, { toValue: target, duration: 700, delay: index * 45, easing: motion.easeOut, useNativeDriver: false }).start();
  }, [target, reduced]);
  return (
    <View style={s.col}>
      <Text style={[s.colScore, best && { color: colors.seal }]}>{score}</Text>
      <Animated.View style={[s.colBar, { height: h, backgroundColor: best ? colors.seal : colors.accentBg }]} />
      <Text style={[s.colLabel, best && { color: colors.seal, fontWeight: '700' }]}>{label}</Text>
    </View>
  );
}

export default function FortuneScreen() {
  const { user, fortune, today } = useApp();
  const { owned } = usePremium();
  const nav = useNavigation();
  const [tab, setTab] = useState<Period>('daily');
  const [open, setOpen] = useState<CategoryKey | null>(null);
  const period = useMemo(() => (user && tab !== 'daily' ? getPeriodFortune(user, today, tab) : null), [user, today, tab]);
  if (!user || !fortune) return null;
  const f = fortune.combined;

  const score = tab === 'daily' ? f.totalScore : period?.score ?? 0;
  const label = tab === 'daily' ? '오늘' : period?.label ?? '';
  const summary = tab === 'daily' ? f.summary : period?.summary ?? '';
  const bestScore = period ? Math.max(...period.flow.map(x => x.score)) : 0;

  // 이 기간에 가장 약한 분야를 먼저 추천하고, 기간에 맞는 유료 콘텐츠를 덧붙인다
  const scoreOf = (k: CategoryKey) => (tab === 'daily' ? f[k] : period?.cats[k].score ?? 0);
  const weak = CATS.reduce((a, b) => (scoreOf(b) < scoreOf(a) ? b : a));
  const topCat = CATS.reduce((a, b) => (scoreOf(b) > scoreOf(a) ? b : a));
  const bestFlow = period ? period.flow.reduce((a, b) => (b.score > a.score ? b : a)).label + (tab === 'weekly' ? '요일' : tab === 'yearly' ? '월' : '') : '';
  // 오늘 탭: 어제 대비 변화
  const prev = tab === 'daily' ? fortuneOf(user, (() => { const { y, m, d } = parseISO(today); return toISODate(new Date(y, m - 1, d - 1)); })()) : null;
  const { y: ty, m: tm } = parseISO(today);
  const R = {
    love: { key: 'theme-love', title: `${label} 연애운이 아쉽다면`, desc: '연애·결혼 운세 · 잘 맞는 사람 · 인연이 오는 해', item: ITEMS.theme('love'), go: () => nav.navigate('Theme', { kind: 'love' }) },
    money: { key: 'theme-money', title: `${label} 재물운이 아쉽다면`, desc: '재물 운세 · 돈 버는 방식 · 재물이 모이는 시기', item: ITEMS.theme('money'), go: () => nav.navigate('Theme', { kind: 'money' }) },
    work: { key: 'theme-career', title: `${label} 직장운이 아쉽다면`, desc: '직업·적성 운세 · 커리어 상승기 · 이직 타이밍', item: ITEMS.theme('career'), go: () => nav.navigate('Theme', { kind: 'career' }) },
    relationship: { key: 'consult', title: '사람 때문에 고민이라면', desc: '말 못 할 고민 상담 · 사주가 익명으로 답해요', item: CONSULT_ITEM, go: () => nav.navigate('Consult') },
    consult: { key: 'consult', title: '말 못 할 고민 상담', desc: '200자로 털어놓으면 사주가 답해요 · 결론부터 · 행동하기 좋은 날', item: CONSULT_ITEM, go: () => nav.navigate('Consult') },
    lucky: { key: 'lucky', title: '길일 찾기', desc: '이사 · 계약 · 고백 · 면접하기 좋은 날 TOP 5', item: ITEMS.lucky('move', today), go: () => nav.navigate('Lucky') },
    crush: { key: 'crush', title: '그 사람의 속마음', desc: '마음 온도 · 연인 가능성 · 연락하기 좋은 날', item: CRUSH_ITEM, go: () => nav.navigate('Tabs', { screen: 'Compatibility' }) },
    monthly: { key: 'monthly', title: `${tm}월 상세운세`, desc: '운세 달력 · 주차별 흐름 · 좋은 날 활용법 · 이달의 미션', item: ITEMS.monthly(ty, tm), go: () => nav.navigate('Monthly') },
    newyear: { key: 'newyear', title: `${ty}년 신년운세`, desc: '올해의 사자성어 · 분야별 6대 운세 · 12개월 하나하나', item: ITEMS.newyear(ty), go: () => nav.navigate('NewYear') },
    life: { key: 'life', title: '평생운 · 10년 대운', desc: '인생 그래프 · 황금기와 위기 · 앞으로 10년', item: ITEMS.life(), go: () => nav.navigate('Life') },
    spouse: { key: 'spouse', title: '미래 배우자 리포트', desc: '어떤 사람을, 언제, 어디서 만나게 될까?', item: ITEMS.spouse(), go: () => nav.navigate('Spouse') },
  };
  const BY_TAB: Record<Period, (keyof typeof R)[]> = { daily: ['consult', 'spouse'], weekly: ['lucky', 'crush'], monthly: ['monthly', 'lucky'], yearly: ['newyear', 'life'] };
  const recs = [R[weak], ...BY_TAB[tab].map(k => R[k])].filter((r, i, a) => a.findIndex(x => x.key === r.key) === i).slice(0, 3);

  return (
    <Screen largeTitle="운세" subtitle={COPY.four}>
      <View style={{ marginTop: 6 }} /><Segmented<Period> options={TABS} value={tab} onChange={t => { setTab(t); setOpen(null); }} />

      {/* 하늘 무대 — 둥실 운알이 + 흐름 패널 */}
      <View style={s.hero}>
        <LinearGradient colors={gradients.sky} locations={[0, 0.55, 1]} start={{ x: 0.5, y: 0 }} end={{ x: 0.5, y: 1 }} style={StyleSheet.absoluteFill} />
        <Clouds />
        <View style={s.art}>
          {tab === 'weekly' ? (
            <Floating shadowWidth={120}>
              <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
                <Mascot size={96} palette="pink" face="happy" shadow={false} />
                <View style={{ marginLeft: -24 }}><Mascot size={96} face="open" shadow={false} /></View>
                <View style={s.heart}><Icon name="heart" size={22} color="#FF8FB1" filled fillOpacity={1} strokeWidth={0} /></View>
              </View>
            </Floating>
          ) : (
            <Floating>
              <Mascot size={120} palette={tab === 'monthly' ? 'mint' : tab === 'yearly' ? 'lavender' : 'classic'} face={score >= 80 ? 'happy' : 'look'} prop={tab === 'monthly' ? 'clover' : 'cloud'} shadow={false} />
            </Floating>
          )}
        </View>

        <View style={[s.panel, shadow.hero]}>
          <View style={s.heroRow}>
            <ScoreRing key={tab} score={score} size={76} stroke={6} color={colors.seal} track={colors.lavenderSoft} textColor={colors.ink} />
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Text style={txt.h3}>{tab === 'weekly' ? '이번 주의 흐름' : `${label}의 흐름`}</Text>
                <View style={s.grade}><Text style={s.gradeText}>{gradeOf(score)}</Text></View>
              </View>
              <Text style={[txt.small, { color: colors.inkSub, marginTop: 4 }]}>{summary}</Text>
            </View>
          </View>
          <View style={s.chips}>
            {period ? (
              <>
                <View style={s.chipBlue}><Text style={s.chipBlueText}>집중 테마 · {period.focus}</Text></View>
                <View style={s.chip}><Text style={s.chipText}>최고의 {tab === 'weekly' ? '요일' : tab === 'monthly' ? '주' : '달'} · {bestFlow}</Text></View>
              </>
            ) : f.keywords.slice(0, 3).map(k => <View key={k} style={s.chip}><Text style={s.chipText}>#{k}</Text></View>)}
          </View>
          <View style={s.duo}>
            {([['가장 좋은 분야', topCat], ['보완할 분야', weak]] as const).map(([k, c]) => {
              const t = categoryTheme[c];
              return (
                <View key={k} style={s.duoCell}>
                  <View style={[s.duoIco, { backgroundColor: t.bg }]}><Icon name={CAT_ICON[c]} size={18} color={t.color} filled fillOpacity={c === 'love' ? 1 : 0.35} strokeWidth={2} /></View>
                  <View style={{ flex: 1 }}>
                    <Text style={txt.micro}>{k}</Text>
                    <Text style={s.duoV}>{t.label} <Text style={{ color: t.color }}>{scoreOf(c)}</Text></Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      </View>

      <SectionHeader title={`${tab === 'weekly' ? '이번 주' : label} 분야별 운세`} caption={tab === 'daily' ? '눌러서 자세히 보기' : '눌러서 풀이 펼치기'} />
      <View style={{ gap: 10 }}>
        {CATS.map((k, i) => {
          const c = tab === 'daily' ? { score: f[k], text: f.categoryTexts[k], best: '' } : period?.cats[k];
          if (!c) return null;
          return (
            <CategoryRow
              key={`${tab}-${k}`}
              category={k} score={c.score} text={c.text} delay={i * 80} expand={tab !== 'daily'} delta={prev ? c.score - prev[k] : undefined}
              badge={c.best ? `${c.best}${tab === 'weekly' ? '요일' : ''} 최고` : undefined}
              lines={tab !== 'daily' && open === k ? 4 : 1}
              onPress={() => (tab === 'daily' ? nav.navigate('CategoryDetail', { category: k }) : setOpen(open === k ? null : k))}
            />
          );
        })}
      </View>

      {period ? (
        <>
          <SectionHeader title={tab === 'weekly' ? '요일별 흐름' : tab === 'monthly' ? '주차별 흐름' : '월별 흐름'} />
          <Card style={s.chart}>
            {period.flow.map((x, i) => (
              <FlowBar key={`${tab}-${x.label}`} label={x.label} score={x.score} best={x.score === bestScore} index={i} />
            ))}
          </Card>
        </>
      ) : null}

      <SectionHeader title={`네 관점으로 본 ${label}`} caption="사주 · 점성술(서양·인도·태국) · MBTI · 혈액형" />
      {(() => {
        const lenses = tab === 'daily' ? dayLenses(user, today, fortune.analyses) : periodLenses(user, today, tab);
        return <LensList lenses={lenses} verdict={lensVerdict(lenses, `${label}의 흐름`, tab === 'daily' ? '오늘은' : tab === 'weekly' ? '이번 주는' : tab === 'monthly' ? '이달은' : '올해는')} />;
      })()}


      <SectionHeader title="더 깊이 보기" caption={`${label}의 흐름에 맞춰 골랐어요`} />
      {recs.map((r, i) => (
        <PromoCard key={r.key} style={{ marginTop: i === 0 ? 0 : 10 }} title={r.title} desc={r.desc} ch={PROMO_CH[r.key] ?? '命'}
          cta={owned(r.item.key) ? '보유 중 · 다시 보기' : `${r.item.cost}P · 시작하기`} onPress={r.go} />
      ))}
      <Disclaimer />
    </Screen>
  );
}

const s = StyleSheet.create({
  hero: { marginTop: 16, borderRadius: radius.xl, overflow: 'hidden', padding: 14 },
  art: { alignItems: 'center', paddingTop: 6, height: 150, justifyContent: 'flex-end' },
  heart: { position: 'absolute', top: -8, left: '44%' },
  panel: { marginTop: 6, padding: 16, borderRadius: 20, backgroundColor: colors.card },
  heroRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  grade: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: radius.pill, backgroundColor: colors.accentBg },
  gradeText: { ...sansW('700'), fontSize: 11, color: colors.seal },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 12 },
  chip: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: radius.pill, backgroundColor: colors.lavenderSoft },
  chipText: { ...sansW('600'), fontSize: 13, color: colors.inkSub },
  chipBlue: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: radius.pill, backgroundColor: colors.accentBg },
  chipBlueText: { ...sansW('700'), fontSize: 13, color: colors.seal },
  duo: { flexDirection: 'row', gap: 8, marginTop: 12 },
  duoCell: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8, padding: 10, borderRadius: radius.md, backgroundColor: colors.lavenderSoft },
  duoIco: { width: 32, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  duoV: { ...sansW('700'), fontSize: 13, color: colors.ink, marginTop: 1 },
  border: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.lineStrong },
  chart: { flexDirection: 'row', alignItems: 'flex-end', gap: 4, paddingTop: 22, height: CHART_H + 80 },
  col: { flex: 1, alignItems: 'center', justifyContent: 'flex-end', gap: 6, height: '100%' },
  colScore: { fontSize: 11, color: colors.inkMute, fontWeight: '700' },
  colBar: { width: '72%', maxWidth: 26, borderRadius: 6 },
  colLabel: { fontSize: 13, color: colors.inkSub },
});
