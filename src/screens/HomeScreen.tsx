import React from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useApp } from '../context/AppContext';
import { RootStackParamList } from '../navigation/types';
import TodayHero from '../components/TodayHero';
import LuckyStrip from '../components/LuckyStrip';
import AnalysisTile from '../components/AnalysisTile';
import ActionTabs from '../components/ActionTabs';
import SectionHeader from '../components/SectionHeader';
import PressableScale from '../components/PressableScale';
import BrandMark from '../components/BrandMark';
import Icon from '../components/Icon';
import Reveal from '../components/Reveal';
import HomeSkeleton from '../components/Skeleton';
import Disclaimer from '../components/Disclaimer';
import { Coin, PriceTag, Seal } from '../components/premium/Kit';
import { usePremium } from '../context/PremiumContext';
import { PremiumKey, defaultItem, openPremium } from '../navigation/premium';
import { ITEMS } from '../services/premium/catalog';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, gradients } from '../theme/colors';
import { radius, SCREEN_PX, shadow, txt } from '../theme/typography';
import { formatKoreanDate } from '../utils/date';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const PREMIUM_TILES = (today: string) => {
  const ny = Number(today.slice(0, 4)) + 1;
  return ([
    ['life', '圖', '평생운', '초년 · 중년 · 말년'],
    ['newyear', '年', '신년운세', `${ny}년 미리보기`],
    ['monthly', '月', '월별 상세운세', '달력과 좋은 날'],
    ['lucky', '日', '길일 찾기', '이사 · 계약 · 고백'],
  ] as [Exclude<PremiumKey, 'lounge'>, string, string, string][]).map(([key, ch, title, desc]) => ({
    key, ch, title, desc, item: key === 'newyear' ? ITEMS.newyear(ny) : defaultItem(key, today),
  }));
};

export default function HomeScreen() {
  const nav = useNavigation<Nav>();
  const { user, fortune, today, fortuneLoading, refreshFortune } = useApp();
  const { points } = usePremium();

  const top = (
    <View style={s.topBar}>
      <BrandMark />
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
        <PressableScale onPress={() => nav.navigate('Wallet')} style={s.ptPill} scaleTo={0.94} accessibilityLabel={`내 포인트 ${points}P`}>
          <Coin size={16} />
          <Text style={s.ptText}>{points.toLocaleString('ko-KR')}</Text>
        </PressableScale>
        <PressableScale onPress={() => fortune && nav.navigate('Share')} style={s.iconBtn} scaleTo={0.9} accessibilityLabel="오늘의 운세 공유하기" disabled={!fortune}>
          <Icon name="share" size={20} color={colors.purple} />
        </PressableScale>
      </View>
    </View>
  );

  if (!fortune || !user) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.cream }} edges={['top']}>
        {top}
        <HomeSkeleton />
      </SafeAreaView>
    );
  }
  const f = fortune.combined;
  const a = fortune.analyses;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.cream }} edges={['top']}>
      {top}
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: SCREEN_PX, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={fortuneLoading} onRefresh={() => refreshFortune()} tintColor={colors.purple} />}
      >
        {/* 첫 화면: 인사 → 히어로 한 장에 오늘의 모든 핵심 */}
        <Reveal>
          <Text style={txt.title}>{user.nickname}님의 오늘</Text>
          <Text style={[txt.small, { marginTop: 2, marginBottom: 16 }]}>{formatKoreanDate(today)}</Text>
        </Reveal>
        <Reveal delay={90}>
          <TodayHero
            fortune={f}
            onOpenStory={() => nav.navigate('CombinedAnalysis')}
            onOpenCategory={c => nav.navigate('CategoryDetail', { category: c })}
          />
        </Reveal>
        <Reveal delay={180} style={{ marginTop: 12 }}>
          <LuckyStrip f={f} />
        </Reveal>

        {/* 행동 조언 */}
        <SectionHeader title="오늘의 행동" />
        <ActionTabs good={f.goodActions} avoid={f.avoidActions} />

        {/* 4가지 관점 */}
        <SectionHeader title="4가지 관점" caption="오늘의 운세는 이렇게 만들어졌어요" action="종합 보기" onAction={() => nav.navigate('CombinedAnalysis')} />
        <View style={s.grid}>
          <View style={s.gridRow}>
            <AnalysisTile analysis={a.saju} onPress={() => nav.navigate('AnalysisDetail', { source: 'saju' })} />
            <AnalysisTile analysis={a.thai} onPress={() => nav.navigate('AnalysisDetail', { source: 'thai' })} />
          </View>
          <View style={s.gridRow}>
            <AnalysisTile analysis={a.mbti} onPress={() => nav.navigate('AnalysisDetail', { source: 'mbti' })} />
            <AnalysisTile analysis={a.blood} onPress={() => nav.navigate('AnalysisDetail', { source: 'blood' })} />
          </View>
        </View>

        <PressableScale onPress={() => nav.navigate('CombinedAnalysis')} style={s.story} accessibilityLabel="네 가지 결과를 엮은 이야기 보기">
          <View style={{ flex: 1 }}>
            <Text style={s.storyTitle}>네 가지 결과를 엮은 이야기</Text>
            <Text style={s.storySub}>공통 키워드 {f.commonKeywords.length || 1}개 · 오늘의 한 문단</Text>
          </View>
          <View style={s.storyArrow}><Icon name="chevronRight" size={18} color={colors.white} strokeWidth={2.2} /></View>
        </PressableScale>

        {/* 프리미엄 콘텐츠 — 앞부분은 무료 미리보기 */}
        <SectionHeader title="더 깊이 보기" caption="앞부분은 무료로 미리 볼 수 있어요" action="전체 보기" onAction={() => nav.navigate('PremiumHub')} />
        <PressableScale onPress={() => nav.navigate('PremiumHub')} style={[s.premiumWrap, shadow.hero]} scaleTo={0.985} accessibilityLabel="프리미엄 콘텐츠 보기">
          <LinearGradient colors={gradients.hero} start={{ x: 0, y: 0 }} end={{ x: 0.9, y: 1 }} style={s.premium}>
            <Text style={{ fontSize: 28, color: colors.moon, fontWeight: '700' }}>圖</Text>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 16, fontWeight: '700', color: colors.white }}>프리미엄 콘텐츠</Text>
              <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)' }}>평생운 · 신년운세 · 월별운세 · 테마 운세 · 길일</Text>
            </View>
            <Icon name="chevronRight" size={18} color={colors.white} strokeWidth={2.2} />
          </LinearGradient>
        </PressableScale>
        <View style={[s.grid, { marginTop: 12 }]}>
          {[0, 2].map(r => (
            <View key={r} style={s.gridRow}>
              {PREMIUM_TILES(today).slice(r, r + 2).map(t => (
                <PressableScale key={t.key} onPress={() => (t.key === 'newyear' ? nav.navigate('NewYear', { year: Number(today.slice(0, 4)) + 1 }) : openPremium(nav, t.key))} style={s.ptile} accessibilityLabel={t.title}>
                  <Seal ch={t.ch} size={40} />
                  <Text style={{ fontSize: 15, fontWeight: '700', color: colors.ink, marginTop: 12 }}>{t.title}</Text>
                  <Text style={[txt.small, { marginTop: 2 }]}>{t.desc}</Text>
                  <View style={{ position: 'absolute', top: 14, right: 14 }}><PriceTag item={t.item} /></View>
                </PressableScale>
              ))}
            </View>
          ))}
        </View>

        <Disclaimer />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  topBar: { height: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingLeft: SCREEN_PX, paddingRight: 10 },
  iconBtn: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  grid: { gap: 12 },
  gridRow: { flexDirection: 'row', gap: 12 },
  story: { marginTop: 12, flexDirection: 'row', alignItems: 'center', backgroundColor: colors.lavenderSoft, borderRadius: radius.lg, padding: 18, borderWidth: 1, borderColor: colors.lavender },
  storyTitle: { fontSize: 15, fontWeight: '700', color: colors.purple, letterSpacing: -0.3 },
  storySub: { fontSize: 12, color: colors.purpleSoft, marginTop: 3 },
  ptPill: { flexDirection: 'row', alignItems: 'center', gap: 5, height: 32, paddingHorizontal: 12, borderRadius: radius.pill, backgroundColor: colors.lavenderSoft },
  ptText: { fontSize: 13, fontWeight: '800', color: colors.purple },
  premiumWrap: { borderRadius: radius.xl, backgroundColor: colors.heroBg },
  premium: { borderRadius: radius.lg, padding: 18, flexDirection: 'row', alignItems: 'center', gap: 14 },
  ptile: { flex: 1, backgroundColor: colors.card, borderRadius: radius.lg, padding: 16, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.lineStrong, ...shadow.card },
  storyArrow: { width: 34, height: 34, borderRadius: 17, backgroundColor: colors.navy, alignItems: 'center', justifyContent: 'center' },
});
