import React, { useEffect, useRef } from 'react';
import { Animated, Platform, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import PressableScale from './PressableScale';
import ScoreBar from './ScoreBar';
import AnimatedNumber from './AnimatedNumber';
import Ico from './Ico';
import Icon from './Icon';
import { CombinedFortune } from '../types';
import { CategoryKey, categoryTheme, colors, gradients } from '../theme/colors';
import { radius, sansW, shadow } from '../theme/typography';
import { BRANCHES, STEMS } from '../data/sajuData';
import { dayPillar } from '../services/fortune/sajuService';
import { parseISO, weekdayOf } from '../utils/date';
import { useReducedMotion } from '../utils/motion';

const CATS: CategoryKey[] = ['love', 'money', 'work', 'relationship'];
const WEEK = ['일', '월', '화', '수', '목', '금', '토'];
const KEEP = (Platform.OS === 'web' ? { wordBreak: 'keep-all' } : {}) as object;

/** 점수 → 오늘의 결. 낮은 날도 나쁜 말 대신 '지키는 날' */
function grade(n: number) {
  if (n >= 85) return '크게 좋은 날';
  if (n >= 70) return '좋은 날';
  if (n >= 55) return '무난한 날';
  return '지키는 날';
}

interface Props { fortune: CombinedFortune; today: string; onOpenStory(): void; onOpenCategory(c: CategoryKey): void }

/**
 * 홈의 얼굴 — 오늘의 종합운.
 * 위: 파스텔 그라데이션 위 코랄 눈썹 · 날짜 · 큰 점수와 오늘의 결 · 한 줄 요약 · 키워드 알약.
 * 아래: 흰 바탕에 분야별 파스텔 아이콘 칸 4개 · 행운(색 · 숫자 · 시간) · 일진과 '종합 풀이'.
 */
export default function TodayHero({ fortune: f, today, onOpenStory, onOpenCategory }: Props) {
  const reduced = useReducedMotion();
  const { m, d } = parseISO(today);
  const dp = dayPillar(today);
  const stem = STEMS[dp.stem], branch = BRANCHES[dp.branch];

  const n = useRef(new Animated.Value(reduced ? f.totalScore : 0)).current;
  useEffect(() => {
    if (reduced) { n.setValue(f.totalScore); return; }
    Animated.timing(n, { toValue: f.totalScore, duration: 900, delay: 250, useNativeDriver: false }).start();
  }, [f.totalScore, reduced]);

  return (
    <View style={[s.card, shadow.hero]}>
      <PressableScale onPress={onOpenStory} scaleTo={0.985} accessibilityLabel={`오늘의 종합운 ${f.totalScore}점, ${grade(f.totalScore)}. ${f.summary} 종합 풀이 보기`}>
        <LinearGradient colors={gradients.hero} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.top}>
          <View style={s.mast}>
            <View style={s.dots}>
              {CATS.map(c => <View key={c} style={[s.dot, { backgroundColor: categoryTheme[c].color }]} />)}
            </View>
            <View style={s.datePill}><Text style={s.dateText}>{m}월 {d}일 {WEEK[weekdayOf(today)]}요일</Text></View>
          </View>
          <Text style={s.eyebrow}>TODAY'S PICK</Text>

          <View style={s.scoreRow}>
            <AnimatedNumber value={n} initial={reduced ? f.totalScore : 0} style={s.score} />
            <Text style={s.unit}>점</Text>
            <View style={s.gradePill}><Text style={s.gradeText}>{grade(f.totalScore)}</Text></View>
          </View>
          <Text style={[s.summary, KEEP]} numberOfLines={3}>{f.summary}</Text>
          <View style={s.tags}>
            {f.keywords.slice(0, 3).map(k => (
              <View key={k} style={s.tag}><Text style={s.tagText}>#{k}</Text></View>
            ))}
          </View>
        </LinearGradient>
      </PressableScale>

      <View style={s.body}>
        <View style={s.cats}>
          {CATS.map((c, i) => {
            const t = categoryTheme[c];
            return (
              <PressableScale key={c} style={s.cat} onPress={() => onOpenCategory(c)} scaleTo={0.94} accessibilityLabel={`${t.label} ${f[c]}점`}>
                <Ico ch={t.emoji} size={34} color={t.color} />
                <Text style={s.catLabel}>{t.short}</Text>
                <Text style={s.catScore}>{f[c]}</Text>
                <View style={{ alignSelf: 'stretch' }}>
                  <ScoreBar value={f[c]} color={t.color} track={colors.line} height={4} delay={500 + i * 80} />
                </View>
              </PressableScale>
            );
          })}
        </View>

        <View style={s.lucky}>
          <View style={s.luck}>
            <View style={[s.swatch, { backgroundColor: f.luckyColorHex }]} />
            <View style={{ flexShrink: 1 }}><Text style={s.luckK}>행운의 색</Text><Text style={s.luckV} numberOfLines={1}>{f.luckyColor}</Text></View>
          </View>
          <View style={s.luckLine} />
          <View style={s.luck}>
            <View><Text style={s.luckK}>행운의 숫자</Text><Text style={s.luckV}>{f.luckyNumber}</Text></View>
          </View>
          <View style={s.luckLine} />
          <View style={[s.luck, { flex: 1.4 }]}>
            <View><Text style={s.luckK}>행운의 시간</Text><Text style={s.luckV} numberOfLines={1}>{f.luckyTime.replace('~', '–')}</Text></View>
          </View>
        </View>

        <PressableScale onPress={onOpenStory} scaleTo={0.97} style={s.foot} accessibilityLabel="종합 풀이 보기">
          <Text style={s.footL}>오늘의 일진 {stem.ko}{branch.ko}({stem.hanja}{branch.hanja}) · {branch.animal}의 날</Text>
          <View style={s.footR}>
            <Text style={s.footMore}>종합 풀이 보기</Text>
            <Icon name="chevronRight" size={14} color={colors.seal} strokeWidth={2.4} />
          </View>
        </PressableScale>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  card: { borderRadius: radius.xl, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.line, overflow: 'hidden' },
  top: { paddingHorizontal: 22, paddingTop: 20, paddingBottom: 22 },
  mast: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  dots: { flexDirection: 'row', gap: 6 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  datePill: { paddingHorizontal: 11, paddingVertical: 5, borderRadius: radius.pill, backgroundColor: colors.card + 'B3' },
  dateText: { ...sansW('600'), fontSize: 12, color: colors.inkSub },
  eyebrow: { ...sansW('700'), fontSize: 12, letterSpacing: 2.2, color: colors.seal, marginTop: 18 },

  scoreRow: { flexDirection: 'row', alignItems: 'flex-end', marginTop: 6 },
  score: { ...sansW('800'), fontSize: 48, lineHeight: 54, letterSpacing: -1.8, color: colors.ink, fontVariant: ['tabular-nums'] },
  unit: { ...sansW('700'), fontSize: 17, color: colors.ink, marginLeft: 2, marginBottom: 8 },
  gradePill: { marginLeft: 10, marginBottom: 10, paddingHorizontal: 11, paddingVertical: 5, borderRadius: radius.pill, backgroundColor: colors.seal },
  gradeText: { ...sansW('700'), fontSize: 13, color: colors.white },
  summary: { ...sansW('700'), fontSize: 19, lineHeight: 27, letterSpacing: -0.5, color: colors.ink, marginTop: 6 },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 14 },
  tag: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: radius.pill, backgroundColor: colors.card + 'BF' },
  tagText: { ...sansW('600'), fontSize: 13, color: colors.inkSub },

  body: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 4 },
  cats: { flexDirection: 'row', gap: 8 },
  cat: { flex: 1, alignItems: 'center', gap: 5, paddingTop: 12, paddingBottom: 12, paddingHorizontal: 9, borderRadius: radius.md, backgroundColor: colors.lavenderSoft },
  catLabel: { ...sansW('600'), fontSize: 13, color: colors.inkSub, marginTop: 2 },
  catScore: { ...sansW('700'), fontSize: 19, lineHeight: 23, color: colors.ink, letterSpacing: -0.5, fontVariant: ['tabular-nums'], marginBottom: 2 },

  lucky: { flexDirection: 'row', alignItems: 'center', marginTop: 10, paddingVertical: 13, paddingHorizontal: 14, borderRadius: radius.md, borderWidth: 1, borderColor: colors.line },
  luck: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8 },
  luckLine: { width: 1, height: 28, backgroundColor: colors.line, marginHorizontal: 8 },
  swatch: { width: 18, height: 18, borderRadius: 9, borderWidth: 1, borderColor: colors.line },
  luckK: { ...sansW('500'), fontSize: 12, color: colors.inkMute },
  luckV: { ...sansW('700'), fontSize: 15, color: colors.ink, marginTop: 1, fontVariant: ['tabular-nums'] },

  foot: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14, paddingHorizontal: 4, gap: 8 },
  footL: { ...sansW('500'), fontSize: 12, color: colors.inkMute, flexShrink: 1 },
  footR: { flexDirection: 'row', alignItems: 'center', gap: 1 },
  footMore: { ...sansW('700'), fontSize: 14, color: colors.seal },
});
