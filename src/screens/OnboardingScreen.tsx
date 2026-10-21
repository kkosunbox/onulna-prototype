import { LinearGradient } from 'expo-linear-gradient';
import PageBg from '../components/PageBg';
import React, { useRef, useState } from 'react';
import { Animated, FlatList, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../context/AppContext';
import PrimaryButton from '../components/PrimaryButton';
import PressableScale from '../components/PressableScale';
import BrandMark, { LogoMark } from '../components/BrandMark';
import { analysisTheme, colors, gradients } from '../theme/colors';
import { fonts, radius, txt } from '../theme/typography';
import { COPY } from '../content/copy';

const PAGES = [
  { title: '오늘, 어떤 운을\nPICK하시겠어요?', body: COPY.pickMe, art: 'sheet' },
  { title: '네 가지 관점으로\n나를 읽어요', body: '사주 · 점성술(서양·인도·태국) · MBTI · 혈액형을 겹쳐 읽어요.', art: 'four' },
  { title: '뽑은 결과는\n친구와 나눠요', body: '친구 결과와 나란히 비교하고, 스토리에도 올려 보세요.', art: 'story' },
] as const;

type Art = (typeof PAGES)[number]['art'];
const SOURCES = ['saju', 'thai', 'mbti', 'blood'] as const;

function Illustration({ kind }: { kind: Art }) {
  if (kind === 'sheet') {
    return (
      <View style={a.stage}>
        <LinearGradient pointerEvents="none" colors={gradients.hero} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
        <LogoMark size={150} />
      </View>
    );
  }
  if (kind === 'story') {
    return (
      <View style={a.stage}>
        <LinearGradient pointerEvents="none" colors={gradients.hero} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
        <View style={a.paper}>
          <View style={a.paperIn}>
            <Text style={a.paperKind}>전생 테스트</Text>
            <Text style={a.paperHead}>발해의{'\n'}서당 훈장</Text>
            <View style={a.paperSeal}><Text style={a.paperSealText}>前</Text></View>
            <View style={{ flex: 1 }} />
            <View style={a.paperBars}>{[44, 28, 60, 20].map((w, i) => <View key={i} style={[a.paperBar, { width: w }]} />)}</View>
            <Text style={a.paperHook}>너는 전생에 누구였을까?</Text>
          </View>
        </View>
      </View>
    );
  }
  const r = 78;
  return (
    <View style={a.stage}>
        <LinearGradient pointerEvents="none" colors={gradients.hero} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
      <View style={a.center}><LogoMark size={30} fg={colors.white} /></View>
      {SOURCES.map((k, i) => {
        const ang = (i / 4) * Math.PI * 2 - Math.PI / 4;
        const t = analysisTheme[k];
        return (
          <View key={k} style={[a.orb, { backgroundColor: t.bg, transform: [{ translateX: Math.cos(ang) * r }, { translateY: Math.sin(ang) * r }] }]}>
            <Text style={{ fontFamily: fonts.serif, fontSize: 24, fontWeight: '800', color: t.color }}>{t.emoji}</Text>
            <Text style={[a.orbLabel, { color: t.color }]}>{t.label}</Text>
          </View>
        );
      })}
    </View>
  );
}

export default function OnboardingScreen() {
  const { completeOnboarding } = useApp();
  // 웹에서는 앱이 휴대폰 폭으로 가운데 놓이므로 창 폭이 아니라 실제 영역 폭으로 넘긴다
  const win = useWindowDimensions().width;
  const [w, setW] = useState(0);
  const width = w || win;
  const [page, setPage] = useState(0);
  const list = useRef<FlatList<(typeof PAGES)[number]>>(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const last = page === PAGES.length - 1;

  const next = () => {
    if (last) return completeOnboarding();
    list.current?.scrollToOffset({ offset: (page + 1) * width, animated: true });
    setPage(page + 1);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.cream }}>
      <PageBg sky />
      <View style={s.top}>
        <BrandMark size={30} ink />
        {!last ? (
          <PressableScale onPress={completeOnboarding} hitSlop={12} scaleTo={0.94}><Text style={s.skip}>건너뛰기</Text></PressableScale>
        ) : null}
      </View>
      <Animated.FlatList
        ref={list}
        onLayout={e => setW(e.nativeEvent.layout.width)}
        style={{ flex: 1 }}
        data={PAGES}
        horizontal
        pagingEnabled
        bounces={false}
        showsHorizontalScrollIndicator={false}
        keyExtractor={p => p.title}
        getItemLayout={(_, i) => ({ length: width, offset: width * i, index: i })}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], { useNativeDriver: false })}
        scrollEventThrottle={16}
        onMomentumScrollEnd={e => setPage(Math.round(e.nativeEvent.contentOffset.x / width))}
        renderItem={({ item }) => (
          <View style={{ width, paddingHorizontal: 24 }}>
            <Illustration kind={item.art} />
            <Text style={[txt.title, { fontSize: 24, lineHeight: 32, marginTop: 32 }]}>{item.title}</Text>
            <Text style={[txt.body, { marginTop: 10 }]}>{item.body}</Text>
          </View>
        )}
      />
      <View style={s.bottom}>
        <View style={s.dots}>
          {PAGES.map((_, i) => {
            const w = scrollX.interpolate({ inputRange: [(i - 1) * width, i * width, (i + 1) * width], outputRange: [6, 22, 6], extrapolate: 'clamp' });
            const bg = scrollX.interpolate({ inputRange: [(i - 1) * width, i * width, (i + 1) * width], outputRange: [colors.lineStrong, colors.seal, colors.lineStrong], extrapolate: 'clamp' });
            return <Animated.View key={i} style={[s.dot, { width: w, backgroundColor: bg }]} />;
          })}
        </View>
        <PrimaryButton label={last ? '시작하기' : '다음'} onPress={next} />
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  top: { height: 52, paddingHorizontal: 24, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  skip: { fontSize: 15, color: colors.inkMute, fontWeight: '600' },
  bottom: { paddingHorizontal: 24, paddingBottom: 12, gap: 20 },
  dots: { flexDirection: 'row', gap: 6 },
  dot: { height: 6, borderRadius: 3 },
});

const a = StyleSheet.create({
  paper: { width: 160, height: 250, backgroundColor: '#FFFFFF', borderRadius: 22, padding: 4, borderWidth: 1, borderColor: '#EEEAE9', shadowColor: '#E5707D', shadowOpacity: 0.16, shadowRadius: 20, shadowOffset: { width: 0, height: 10 }, elevation: 6 },
  paperIn: { flex: 1, padding: 12 },
  paperKind: { fontSize: 11, fontWeight: '700', color: '#E5707D', letterSpacing: 1.8 },
  paperHead: { fontFamily: fonts.display, fontSize: 18, lineHeight: 26, fontWeight: '700', color: '#1A1A1A', marginTop: 8, letterSpacing: -0.4 },
  paperSeal: { position: 'absolute', right: 12, top: 12, width: 30, height: 30, borderRadius: 10, backgroundColor: '#FDEEF0', alignItems: 'center', justifyContent: 'center' },
  paperSealText: { fontFamily: fonts.serif, fontSize: 15, fontWeight: '700', color: '#E5707D' },
  paperBars: { flexDirection: 'row', flexWrap: 'wrap', gap: 3, borderRadius: 10, backgroundColor: '#F1EEF9', padding: 7 },
  paperBar: { height: 5, borderRadius: 3, backgroundColor: '#5B4B94', opacity: 0.6 },
  paperHook: { fontFamily: fonts.display, fontSize: 11, fontWeight: '700', color: '#1A1A1A', marginTop: 8 },
  stage: { height: 300, marginTop: 12, borderRadius: radius.xl, alignItems: 'center', justifyContent: 'center', overflow: 'hidden', borderWidth: 1, borderColor: colors.line },
  halo: { position: 'absolute', width: 200, height: 200, borderRadius: 100, backgroundColor: colors.moon, opacity: 0.12 },
  moon: { width: 120, height: 120, borderRadius: 60, backgroundColor: colors.moon, overflow: 'hidden' },
  moonCut: { position: 'absolute', width: 120, height: 120, borderRadius: 60, backgroundColor: '#1A1E2B', left: 38, top: -16 },
  star: { position: 'absolute', borderRadius: 2, backgroundColor: '#fff', opacity: 0.8 },
  ring: { position: 'absolute', borderWidth: 1, borderColor: colors.lavender, borderStyle: 'dashed' },
  center: { width: 64, height: 64, borderRadius: 22, backgroundColor: colors.seal, alignItems: 'center', justifyContent: 'center' },
  orb: { position: 'absolute', width: 60, height: 60, borderRadius: 20, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.card },
  orbLabel: { position: 'absolute', bottom: -20, fontSize: 11, fontWeight: '700', width: 90, textAlign: 'center' },
  mini: { width: 200, paddingVertical: 24, borderRadius: radius.xl, alignItems: 'center' },
  miniLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 13 },
  miniScore: { fontFamily: fonts.serif, color: '#fff', fontSize: 40, fontWeight: '800', letterSpacing: -1.2 },
  miniChip: { marginTop: 12, backgroundColor: 'rgba(255,255,255,0.08)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.16)', borderRadius: 6, paddingHorizontal: 12, paddingVertical: 6 },
});
