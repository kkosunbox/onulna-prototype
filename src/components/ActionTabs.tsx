import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import Segmented from './Segmented';
import PressableScale from './PressableScale';
import ScoreBar from './ScoreBar';
import Mascot from './Mascot';
import Icon from './Icon';
import { colors } from '../theme/colors';
import { radius, sansW, txt } from '../theme/typography';
import { ACTION_NOTE } from '../data/keywords';
import { useApp } from '../context/AppContext';

const SLOTS = ['아침', '오후', '저녁'];
const key = (date: string) => `onulna:actions:${date}`;

/**
 * 오늘의 행동 — 읽고 끝나는 목록이 아니라 '해 보고 체크하는' 카드.
 * 하면 좋은 것: 아침 · 오후 · 저녁에 하나씩, 누르면 '해봤어요'(날짜별로 이 기기에 저장) · 셋 다 하면 운알이 칭찬.
 * 피하면 좋은 것: 하루 종일 기억해 둘 것.
 */
export default function ActionTabs({ good, avoid }: { good: string[]; avoid: string[] }) {
  const { today } = useApp();
  const [tab, setTab] = useState<'good' | 'avoid'>('good');
  const [done, setDone] = useState<string[]>([]);
  useEffect(() => { AsyncStorage.getItem(key(today)).then(v => setDone(v ? JSON.parse(v) : [])).catch(() => {}); }, [today]);

  // 연달아 눌러도 앞의 체크가 사라지지 않도록 직전 상태를 기준으로 바꾼다
  const toggle = (item: string) => {
    setDone(prev => {
      const adding = !prev.includes(item);
      const next = adding ? [...prev, item] : prev.filter(d => d !== item);
      AsyncStorage.setItem(key(today), JSON.stringify(next)).catch(() => {});
      if (adding) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      return next;
    });
  };
  const count = good.filter(g => done.includes(g)).length;
  const all = count === good.length && good.length > 0;

  return (
    <View style={s.card}>
      <View style={s.head}>
        <Text style={txt.h3}>오늘의 행동</Text>
        <Text style={s.progressText}><Text style={{ color: colors.seal }}>{count}</Text>/{good.length} 해봤어요</Text>
      </View>
      <View style={{ marginTop: 8, marginBottom: 14 }}>
        <ScoreBar value={good.length ? (count / good.length) * 100 : 0} color={colors.seal} track={colors.card} height={6} delay={0} />
      </View>

      <Segmented<'good' | 'avoid'> options={[{ key: 'good', label: '하면 좋은 것' }, { key: 'avoid', label: '피하면 좋은 것' }]} value={tab} onChange={setTab} />

      {tab === 'good' && all ? (
        <View style={s.cheer}>
          <Mascot size={52} face="happy" prop="sparkle" shadow={false} />
          <View style={{ flex: 1 }}>
            <Text style={txt.bodyStrong}>오늘의 행동을 다 해냈어요!</Text>
            <Text style={[txt.small, { marginTop: 2 }]}>작은 실천이 쌓여 내일의 운이 돼요.</Text>
          </View>
        </View>
      ) : null}

      <View style={{ gap: 8, marginTop: 12 }}>
        {(tab === 'good' ? good : avoid).map((item, i) => {
          const isGood = tab === 'good';
          const on = isGood && done.includes(item);
          return (
            <PressableScale
              key={item} disabled={!isGood} onPress={() => toggle(item)} scaleTo={0.98}
              style={[s.item, on && s.itemOn]}
              accessibilityRole={isGood ? 'checkbox' : undefined} accessibilityState={isGood ? { checked: on } : undefined}
              accessibilityLabel={isGood ? `${SLOTS[i] ?? ''} ${item}${on ? ', 해봤어요' : ''}` : `피하기: ${item}`}
            >
              {isGood ? (
                <View style={[s.check, on && s.checkOn]}>{on ? <Icon name="check" size={15} color={colors.white} strokeWidth={3} /> : null}</View>
              ) : (
                <View style={[s.check, s.avoidMark]}><Icon name="close" size={13} color={colors.danger} strokeWidth={3} /></View>
              )}
              <View style={{ flex: 1 }}>
                <View style={s.itemHead}>
                  <Text style={[s.title, on && { color: colors.inkSub }]} numberOfLines={2}>{item}</Text>
                  <View style={[s.slot, { backgroundColor: isGood ? colors.accentBg : colors.loveBg }]}>
                    <Text style={[s.slotText, { color: isGood ? colors.seal : colors.danger }]}>{isGood ? SLOTS[i] ?? '오늘' : '하루 종일'}</Text>
                  </View>
                </View>
                {ACTION_NOTE[item] ? <Text style={s.note}>{ACTION_NOTE[item]}</Text> : null}
                {on ? <Text style={s.doneText}>해봤어요 · 잘했어요</Text> : null}
              </View>
            </PressableScale>
          );
        })}
      </View>
      {tab === 'good' && !all ? <Text style={s.hint}>해 본 행동은 동그라미를 눌러 체크해 보세요</Text> : null}
    </View>
  );
}

const s = StyleSheet.create({
  card: { padding: 20, borderRadius: radius.lg, backgroundColor: colors.lavenderSoft },
  head: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  progressText: { ...sansW('700'), fontSize: 13, color: colors.inkSub },
  cheer: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 12, padding: 12, borderRadius: radius.md, backgroundColor: colors.card },
  item: { flexDirection: 'row', gap: 12, padding: 14, borderRadius: radius.md, backgroundColor: colors.card },
  itemOn: { backgroundColor: colors.accentBg },
  check: { width: 26, height: 26, borderRadius: 13, borderWidth: 2, borderColor: colors.lineStrong, alignItems: 'center', justifyContent: 'center', marginTop: 1 },
  checkOn: { backgroundColor: colors.seal, borderColor: colors.seal },
  avoidMark: { borderWidth: 0, backgroundColor: colors.loveBg },
  itemHead: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  title: { ...txt.bodyStrong, fontWeight: '700', flex: 1 },
  slot: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: radius.pill, marginTop: 1 },
  slotText: { ...sansW('700'), fontSize: 11 },
  note: { ...txt.small, color: colors.inkSub, marginTop: 4 },
  doneText: { ...sansW('700'), fontSize: 11, color: colors.seal, marginTop: 6 },
  hint: { ...txt.micro, textAlign: 'center', marginTop: 12 },
});
