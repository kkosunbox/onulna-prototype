import React from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../theme/colors';

/**
 * 화면 바탕 — 흰 바탕 위로 왼쪽 위 살구, 오른쪽 위 하늘, 아래 분홍이 번지는 빛.
 * 화면 뒤에 고정으로 깔리고 내용은 그 위로 스크롤된다.
 */
export default function PageBg() {
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <LinearGradient colors={[colors.glowA, colors.cream, colors.glowB]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={s.top} />
      {/* 아래로 갈수록 바탕색에 녹아들게 */}
      <LinearGradient colors={[colors.cream + '00', colors.cream]} locations={[0.25, 1]} start={{ x: 0.5, y: 0 }} end={{ x: 0.5, y: 1 }} style={s.top} />
      <LinearGradient colors={[colors.glowC + '00', colors.glowC]} start={{ x: 0.5, y: 0 }} end={{ x: 0.5, y: 1 }} style={s.bottom} />
    </View>
  );
}

const s = StyleSheet.create({
  top: { position: 'absolute', left: 0, right: 0, top: 0, height: 520 },
  bottom: { position: 'absolute', left: 0, right: 0, bottom: 0, height: 380, opacity: 0.8 },
});
