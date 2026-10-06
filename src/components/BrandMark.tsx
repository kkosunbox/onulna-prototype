import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Line, Path, Rect, Text as SvgText } from 'react-native-svg';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';

/** 브랜드 이름 · 슬로건 — 화면 문구와 공유 문구가 모두 여기서 가져간다 */
export const BRAND = { name: '한장', en: 'HANJANG', slogan: '매일 한 장, 나를 읽다' };

/**
 * 한장 로고 마크 — 매일 한 장씩 넘기는 일력(日曆).
 * 붉은 철끈 띠와 구멍 · 뜯는 점선 · 명조 "한" · 살짝 들린 아래 모서리 · 뒤에 겹친 다음 장.
 * 앱 아이콘(assets/icon.png)과 같은 도형이다.
 */
export function LogoMark({ size = 24 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="18 12 68 82" accessibilityLabel={BRAND.name}>
      <Rect x={25.5} y={19.5} width={56} height={70} rx={2.5} fill="#C9BCA2" />
      <Path d="M22 16 H78 V75 L67 86 H22 Z" fill="#F4EDDF" />
      <Path d="M78 75 L67 86 V78 Q67 75 70 75 Z" fill="#E4D9C3" />
      <Path d="M22 16 H78 V30 H22 Z" fill={colors.seal} />
      <Circle cx={38} cy={23} r={2.2} fill={colors.navy} />
      <Circle cx={62} cy={23} r={2.2} fill={colors.navy} />
      <Line x1={24} y1={33} x2={76} y2={33} stroke="#857C6E" strokeWidth={0.6} strokeDasharray="1.6 1.4" />
      <SvgText x={50} y={72} fontFamily={fonts.serif} fontWeight="800" fontSize={34} fill={colors.navy} textAnchor="middle">한</SvgText>
    </Svg>
  );
}

/** 마크 + 워드마크 */
export default function BrandMark({ light = false, size = 22 }: { light?: boolean; size?: number }) {
  return (
    <View style={s.row} accessibilityLabel={BRAND.name}>
      <LogoMark size={size} />
      <Text style={[s.word, { fontSize: size * 0.9 }, light && { color: colors.white }]}>{BRAND.name}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  word: { fontFamily: fonts.serif, fontWeight: '700', letterSpacing: -0.5, color: colors.purple },
});
