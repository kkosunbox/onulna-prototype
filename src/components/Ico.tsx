import React from 'react';
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';

/** 파스텔 아이콘 칸 — 반경 13 · 글자색을 옅게 깐 바탕 · 굵은 한자 */
/** 글자색(#RRGGBB)을 옅게 깐 파스텔 바탕 */
const tint = (c: string) => (/^#[0-9A-Fa-f]{6}$/.test(c) ? c + '1F' : colors.lavenderSoft);

/** 색을 정하지 않으면 글자마다 파스텔 다섯 색 중 하나로 (화면마다 칸 색이 고르게 섞이게) */
const PALETTE = [colors.love, colors.work, colors.money, colors.saju, colors.relation];

export default function Ico({ ch, size = 36, color: c, style }: { ch: string; size?: number; color?: string; style?: StyleProp<ViewStyle> }) {
  const color = c ?? PALETTE[(ch.codePointAt(0) ?? 0) % PALETTE.length];
  return (
    <View style={[s.box, { width: size, height: size, borderRadius: Math.min(13, size / 3), backgroundColor: tint(color) }, style]}>
      <Text style={{ fontFamily: fonts.serif, fontSize: Math.round(size * 0.42), fontWeight: '700', color }}>{ch}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  box: { alignItems: 'center', justifyContent: 'center' },
});
