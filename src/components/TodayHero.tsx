import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, Easing, Platform, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, Path } from 'react-native-svg';
import PressableScale from './PressableScale';
import ScoreRing from './ScoreRing';
import Mascot, { MascotFace } from './Mascot';
import Icon, { IconName } from './Icon';
import { CombinedFortune } from '../types';
import { CategoryKey, analysisTheme, categoryTheme, colors, isDark } from '../theme/colors';
import { dayLenses } from '../services/fortune/insightService';
import { radius, sansW, shadow, txt } from '../theme/typography';
import { useApp } from '../context/AppContext';
import { fortuneOf } from '../services/premium/engine';
import { parseISO, toISODate } from '../utils/date';
import { useReducedMotion } from '../utils/motion';

const CATS: { k: CategoryKey; icon: IconName; label: string }[] = [
  { k: 'love', icon: 'heart', label: '연애' },
  { k: 'money', icon: 'coin', label: '재물' },
  { k: 'work', icon: 'briefcase', label: '직장' },
  { k: 'relationship', icon: 'people', label: '관계' },
];
const KEEP = (Platform.OS === 'web' ? { wordBreak: 'keep-all' } : {}) as object;

/** 점수 → 등급 · 운알이 표정 */
const gradeOf = (n: number) => (n >= 85 ? '크게 좋은 날' : n >= 72 ? '좋은 날' : n >= 60 ? '무난한 날' : '쉬어 가는 날');
const faceOf = (n: number): MascotFace => (n >= 85 ? 'happy' : n >= 72 ? 'look' : n >= 60 ? 'open' : 'curious');

interface Props { fortune: CombinedFortune; today: string; onOpenStory(): void; onOpenCategory(c: CategoryKey): void }

/**
 * 홈의 얼굴 — 하늘 무대 위 운알이가 오늘의 운을 말해 준다.
 *  ① 무대: 말풍선(오늘의 종합운 · 점수/100 · 등급 · 한 줄) → 구름 위에서 둥실 떠 있는 운알이 · 반짝임
 *  ② 분야 카드 4개: 원형 게이지 · 아이콘 · 어제 대비 변화 · '최고' 배지
 *  ③ 오늘의 운세: 한 줄 요약 · 잘 풀리는 일 / 조심할 일 · 행운의 컬러 · 시간 · 숫자
 */
export default function TodayHero({ fortune: f, today, onOpenStory, onOpenCategory }: Props) {
  const { user } = useApp();
  const reduced = useReducedMotion();

  // 어제 대비 변화 (같은 규칙 엔진으로 어제 하루를 계산)
  const prev = useMemo(() => {
    if (!user) return null;
    const { y, m, d } = parseISO(today);
    return fortuneOf(user, toISODate(new Date(y, m - 1, d - 1)));
  }, [user?.id, today]);
  const { fortune: full } = useApp();
  const lenses = useMemo(() => (user && full ? dayLenses(user, today, full.analyses) : null), [user?.id, today, full]);
  const best = CATS.reduce((a, b) => (f[b.k] > f[a.k] ? b : a)).k;
  const worst = CATS.reduce((a, b) => (f[b.k] < f[a.k] ? b : a)).k;

  // 운알이가 구름 위에서 둥실 — 움직임 줄이기 설정이면 멈춘다
  const bob = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (reduced) return;
    const a = Animated.loop(Animated.sequence([
      Animated.timing(bob, { toValue: 1, duration: 1600, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      Animated.timing(bob, { toValue: 0, duration: 1600, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
    ]));
    a.start();
    return () => a.stop();
  }, [reduced]);
  const ty = bob.interpolate({ inputRange: [0, 1], outputRange: [3, -5] });
  const shadowScale = bob.interpolate({ inputRange: [0, 1], outputRange: [1, 0.82] });

  return (
    <View>
      {/* ① 무대 */}
      <View style={s.stage}>
        <LinearGradient colors={isDark ? ['#1B3550', '#171B21'] : ['#BFE3FF', '#E4F3FF', '#F6FBFF']} start={{ x: 0.5, y: 0 }} end={{ x: 0.5, y: 1 }} style={StyleSheet.absoluteFill} />
        <Clouds />

        <PressableScale onPress={onOpenStory} scaleTo={0.98} style={[s.bubble, shadow.hero]} accessibilityLabel={`오늘의 종합운 ${f.totalScore}점, ${gradeOf(f.totalScore)}. ${f.summary}`}>
          <View style={s.bubbleTop}>
            <Text style={s.eyebrow}>오늘의 종합운</Text>
            <View style={s.grade}><Text style={s.gradeText}>{gradeOf(f.totalScore)}</Text></View>
          </View>
          <View style={s.scoreRow}>
            <Text style={s.score}>{f.totalScore}</Text>
            <Text style={s.of}>/100</Text>
            <Text style={[s.summary, KEEP]} numberOfLines={2}>{f.summary}</Text>
          </View>
        </PressableScale>
        <View style={s.tail} />

        <View style={s.mascotWrap}>
          <Animated.View style={[s.groundShadow, { transform: [{ scaleX: shadowScale }] }]} />
          <Animated.View style={{ transform: [{ translateY: ty }] }}>
            <Mascot size={124} face={faceOf(f.totalScore)} prop={f.totalScore >= 72 ? 'sparkle' : 'none'} shadow={false} />
          </Animated.View>
        </View>
        <View style={s.keywords}>
          {f.keywords.slice(0, 3).map(k => <View key={k} style={s.kw}><Text style={s.kwText}>#{k}</Text></View>)}
        </View>
      </View>

      {/* ② 분야 카드 */}
      <View style={s.cats}>
        {CATS.map(({ k, icon, label }) => {
          const t = categoryTheme[k];
          const d = prev ? f[k] - prev[k] : 0;
          return (
            <PressableScale key={k} onPress={() => onOpenCategory(k)} scaleTo={0.95} style={s.cat} accessibilityLabel={`${t.label} ${f[k]}점, 어제보다 ${d >= 0 ? '+' : ''}${d}`}>
              {k === best ? <View style={[s.best, { backgroundColor: t.color }]}><Text style={s.bestText}>최고</Text></View> : null}
              <ScoreRing score={f[k]} size={60} stroke={5} color={t.color} track={colors.card} textColor={colors.ink} />
              <View style={s.catLabel}>
                <Icon name={icon} size={14} color={t.color} filled fillOpacity={k === 'love' ? 1 : 0.35} strokeWidth={2} />
                <Text style={s.catText}>{label}</Text>
              </View>
              <Text style={[s.delta, { color: d > 0 ? colors.success : d < 0 ? colors.danger : colors.inkMute }]}>
                {d > 0 ? `어제보다 ▲${d}` : d < 0 ? `어제보다 ▼${-d}` : '어제와 같아요'}
              </Text>
            </PressableScale>
          );
        })}
      </View>

      {/* ③ 오늘의 운세 */}
      <View style={s.card}>
        <PressableScale onPress={onOpenStory} scaleTo={0.98} style={s.cardHead} accessibilityLabel="종합풀이 보기">
          <Text style={txt.h3}>오늘의 운세</Text>
          <View style={s.more}><Text style={txt.small}>종합풀이</Text><Icon name="chevronRight" size={16} color={colors.inkMute} strokeWidth={2} /></View>
        </PressableScale>
        {lenses ? (
          <PressableScale onPress={onOpenStory} scaleTo={0.98} style={s.signals} accessibilityLabel="네 관점 신호 · 종합풀이 보기">
            <Text style={s.signalHead}>네 관점 신호 <Text style={s.signalSub}>· {lenses.filter(l => l.tone === 'up').length}곳이 밀어줘요</Text></Text>
            <View style={s.signalRow}>
              {lenses.map(l => {
                const t = analysisTheme[l.source];
                const on = l.tone === 'up', off = l.tone === 'down';
                return (
                  <View key={l.source} style={[s.signal, { backgroundColor: on ? t.bg : colors.card }]}>
                    <View style={[s.sigDot, { backgroundColor: on ? t.color : off ? colors.danger : colors.lineStrong }]} />
                    <Text style={[s.sigText, on && { color: t.color }]}>{l.label}</Text>
                  </View>
                );
              })}
            </View>
          </PressableScale>
        ) : null}

        <View style={s.points}>
          <Point tone="up" label={`잘 풀리는 일 · ${categoryTheme[best].label}`} text={f.categoryTexts[best]} color={categoryTheme[best].color} />
          {f[worst] < 72
            ? <Point tone="down" label={`조심할 일 · ${categoryTheme[worst].label}`} text={f.categoryTexts[worst]} color={categoryTheme[worst].color} />
            : <Point tone="flat" label={`평소대로 하면 되는 일 · ${categoryTheme[worst].label}`} text={f.categoryTexts[worst]} color={categoryTheme[worst].color} />}
        </View>

        <View style={s.lucky}>
          <View style={s.luck}>
            <View style={[s.swatch, { backgroundColor: f.luckyColorHex }]} />
            <Text style={s.luckK}>행운의 컬러</Text>
            <Text style={s.luckV}>{f.luckyColor}</Text>
          </View>
          <View style={s.luck}>
            <Icon name="clock" size={18} color={colors.seal} strokeWidth={2} />
            <Text style={s.luckK}>행운의 시간</Text>
            <Text style={s.luckV} numberOfLines={1}>{f.luckyTime.replace('~', '–')}</Text>
          </View>
          <View style={s.luck}>
            <Icon name="sparkle" size={18} color={colors.money} filled fillOpacity={1} strokeWidth={1.6} />
            <Text style={s.luckK}>행운의 숫자</Text>
            <Text style={s.luckV}>{f.luckyNumber}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

/** 잘 풀리는 일 / 조심할 일 한 줄 */
function Point({ tone, label, text, color }: { tone: 'up' | 'flat' | 'down'; label: string; text: string; color: string }) {
  const m = { up: { bg: colors.okBg, fg: colors.success, icon: 'check' as const }, flat: { bg: colors.lavender, fg: colors.inkSub, icon: 'chevronRight' as const }, down: { bg: colors.loveBg, fg: colors.danger, icon: 'close' as const } }[tone];
  return (
    <View style={s.point}>
      <View style={[s.pointMark, { backgroundColor: m.bg }]}>
        <Icon name={m.icon} size={13} color={m.fg} strokeWidth={2.8} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[s.pointLabel, { color }]}>{label}</Text>
        <Text style={[txt.small, { color: colors.inkSub, marginTop: 2 }, KEEP]}>{text}</Text>
      </View>
    </View>
  );
}

/** 무대 배경 — 흰 구름 두 무더기와 반짝이는 별 */
function Clouds() {
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <Svg width="100%" height="100%" viewBox="0 0 340 300" preserveAspectRatio="xMidYMax slice">
        {[[34, 262, 26], [64, 252, 32], [96, 264, 24], [16, 278, 20]].map(([x, y, r], i) => <Circle key={`l${i}`} cx={x} cy={y} r={r} fill="#FFFFFF" fillOpacity={0.85} />)}
        {[[262, 268, 24], [292, 254, 32], [324, 266, 26], [310, 284, 22]].map(([x, y, r], i) => <Circle key={`r${i}`} cx={x} cy={y} r={r} fill="#FFFFFF" fillOpacity={0.85} />)}
        <Path d="M60 150 L63 157 L70 160 L63 163 L60 170 L57 163 L50 160 L57 157 Z" fill="#FFD84D" />
        <Path d="M286 136 L288 141 L293 143 L288 145 L286 150 L284 145 L279 143 L284 141 Z" fill="#FFFFFF" />
        <Path d="M262 190 L264 195 L269 197 L264 199 L262 204 L260 199 L255 197 L260 195 Z" fill="#FFD84D" fillOpacity={0.9} />
        <Circle cx={88} cy={204} r={3} fill="#FFFFFF" />
      </Svg>
    </View>
  );
}

const s = StyleSheet.create({
  stage: { borderRadius: radius.xl, overflow: 'hidden', paddingTop: 16, paddingHorizontal: 16, paddingBottom: 16 },
  bubble: { paddingVertical: 14, paddingHorizontal: 18, borderRadius: 20, backgroundColor: colors.card },
  bubbleTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  eyebrow: { ...sansW('700'), fontSize: 13, color: colors.seal },
  grade: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: radius.pill, backgroundColor: colors.accentBg },
  gradeText: { ...sansW('700'), fontSize: 11, color: colors.seal },
  scoreRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  score: { ...sansW('800'), fontSize: 40, lineHeight: 46, letterSpacing: -1.2, color: colors.ink, fontVariant: ['tabular-nums'] },
  of: { ...sansW('600'), fontSize: 13, color: colors.inkMute, marginLeft: 2, marginTop: 14 },
  summary: { ...txt.bodyStrong, flex: 1, marginLeft: 14 },
  tail: { alignSelf: 'center', width: 0, height: 0, borderLeftWidth: 10, borderRightWidth: 10, borderTopWidth: 12, borderLeftColor: 'transparent', borderRightColor: 'transparent', borderTopColor: colors.card },
  mascotWrap: { alignItems: 'center', marginTop: 2 },
  keywords: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: 4 },
  kw: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: radius.pill, backgroundColor: colors.card, ...shadow.card },
  kwText: { ...sansW('700'), fontSize: 13, color: colors.inkSub },
  signals: { marginTop: 12 },
  signalHead: { ...sansW('700'), fontSize: 13, color: colors.ink },
  signalSub: { ...sansW('500'), fontSize: 13, color: colors.inkMute },
  signalRow: { flexDirection: 'row', gap: 6, marginTop: 8 },
  signal: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, paddingVertical: 8, borderRadius: radius.md },
  sigDot: { width: 7, height: 7, borderRadius: 4 },
  sigText: { ...sansW('700'), fontSize: 11, color: colors.inkSub },
  groundShadow: { position: 'absolute', bottom: 10, width: 74, height: 9, borderRadius: 999, backgroundColor: '#4C77A8', opacity: 0.12 },

  cats: { flexDirection: 'row', gap: 8, marginTop: 12 },
  cat: { flex: 1, alignItems: 'center', paddingTop: 14, paddingBottom: 12, borderRadius: radius.lg, backgroundColor: colors.lavenderSoft },
  best: { position: 'absolute', top: 6, right: 6, paddingHorizontal: 6, paddingVertical: 1, borderRadius: radius.pill, zIndex: 1 },
  bestText: { ...sansW('700'), fontSize: 11, color: colors.white },
  catLabel: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 8 },
  catText: { ...txt.bodyStrong, fontSize: 13 },
  delta: { ...sansW('600'), fontSize: 11, marginTop: 4 },

  card: { marginTop: 12, padding: 20, borderRadius: radius.lg, backgroundColor: colors.lavenderSoft },
  cardHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  more: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  lead: { ...sansW('700'), fontSize: 18, lineHeight: 26, letterSpacing: -0.4, color: colors.ink, marginTop: 10 },
  points: { marginTop: 12, padding: 14, borderRadius: radius.md, backgroundColor: colors.card, gap: 12 },
  point: { flexDirection: 'row', gap: 10 },
  pointMark: { width: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center', marginTop: 1 },
  pointLabel: { ...sansW('700'), fontSize: 13 },
  lucky: { flexDirection: 'row', gap: 8, marginTop: 10 },
  luck: { flex: 1, alignItems: 'center', gap: 4, paddingVertical: 12, borderRadius: radius.md, backgroundColor: colors.card },
  swatch: { width: 18, height: 18, borderRadius: 9 },
  num: { width: 18, height: 18, borderRadius: 9, backgroundColor: colors.accentBg, alignItems: 'center', justifyContent: 'center' },
  numText: { ...sansW('800'), fontSize: 11, color: colors.seal },
  luckK: { ...txt.micro },
  luckV: { ...sansW('700'), fontSize: 13, color: colors.ink },
});
