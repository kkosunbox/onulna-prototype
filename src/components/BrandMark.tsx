import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { G, Rect, Text as SvgText } from 'react-native-svg';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';

/** 브랜드 — 화면 문구와 공유 문구가 모두 여기서 가져간다 (docs/BRAND.md) */
export const BRAND = { name: '운Pick', ko: '운픽', slogan: '오늘의 운, 하나만 Pick!', store: '운Pick - 오늘의 운, 하나만 Pick' };

/**
 * 로고 마크 — 명조 '운' + 느낌표. 느낌표의 점 자리는 붉은 낙관.
 * 오늘의 운을 하나 뽑았을 때의 "운!" 하는 감탄. 앱 아이콘(assets/icon.png)과 같은 도형.
 * fg: 글자 색(밝은 바탕엔 먹남색, 어두운 바탕엔 한지색)
 */
export function LogoMark({ size = 24, fg = colors.navy }: { size?: number; fg?: string }) {
  return (
    <Svg width={size * 1.2} height={size} viewBox="14 24 68 56" accessibilityLabel={BRAND.name}>
      <SvgText x={40} y={67} fontFamily={fonts.serif} fontWeight="800" fontSize={47} fill={fg} textAnchor="middle" letterSpacing={-1}>운</SvgText>
      <Rect x={68.5} y={29} width={7.4} height={28} rx={3.7} fill={fg} />
      <G rotation={-8} origin="72.2, 67.5">
        <Rect x={67.2} y={62.5} width={10} height={10} rx={1.2} fill={colors.seal} />
      </G>
    </Svg>
  );
}

/** 워드마크: 운Pick + 낙관 점 */
export default function BrandMark({ light = false, size = 20 }: { light?: boolean; size?: number }) {
  const fg = light ? '#F4EDDF' : colors.purple;
  return (
    <View style={s.row} accessibilityLabel={BRAND.name}>
      <Text style={[s.word, { fontSize: size, lineHeight: size * 1.25, color: fg }]}>{BRAND.name}</Text>
      <View style={[s.dot, { width: size * 0.26, height: size * 0.26, marginBottom: size * 0.2 }]} />
    </View>
  );
}

const s = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-end', gap: 2 },
  word: { fontFamily: fonts.serif, fontWeight: '800', letterSpacing: -0.4 },
  dot: { borderRadius: 1, backgroundColor: colors.seal, transform: [{ rotate: '-8deg' }] },
});
