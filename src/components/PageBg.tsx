import React from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { gradients } from '../theme/colors';

/**
 * 화면 바탕. 기본은 깨끗한 흰 바탕(아무것도 그리지 않음).
 * sky: 홈 · 로그인 · 온보딩처럼 첫인상이 중요한 화면의 머리에 하늘색 그라데이션을 깐다.
 */
export default function PageBg({ sky = false, deep = false }: { sky?: boolean; deep?: boolean }) {
  if (!sky && !deep) return null;
  // deep: 흰 글자 로고가 또렷하도록 위쪽 절반을 진한 하늘색으로(로그인)
  const cols = deep ? (['#5BB5F6', '#8CCBFF', '#FFFFFF'] as const) : gradients.sky;
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <LinearGradient colors={cols} locations={deep ? [0, 0.5, 0.95] : [0, 0.55, 1]} start={{ x: 0.5, y: 0 }} end={{ x: 0.5, y: 1 }} style={s.top} />
    </View>
  );
}

const s = StyleSheet.create({
  top: { position: 'absolute', left: 0, right: 0, top: 0, height: '100%' },
});
