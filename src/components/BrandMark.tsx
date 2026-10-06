import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import Svg, { G, Path, Rect, Text as SvgText } from 'react-native-svg';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';

/**
 * 브랜드 — 화면 문구와 공유 문구가 모두 여기서 가져간다.
 * 한글 표기 '후엠아이'는 같은 이름의 다른 앱이 있어 쓰지 않는다(docs/BRAND.md).
 */
export const BRAND = { name: 'WHO AM I?', word: 'WHO AM I', slogan: '나는 어떤 사람일까', store: 'WHO AM I? - 사주로 읽는 나' };

/** 낙관 속 한자 我 — 웹은 명조 폴백, 네이티브는 시스템 한자 글꼴 */
const SEAL_FONT = Platform.select({ web: "Hahmlet, AppleMyungjo, 'Noto Serif KR', serif", default: undefined });

/**
 * 로고 마크 — 직접 그린 물음표, 점 자리에 붉은 낙관(我, 나 아).
 * "나는 누구인가?"라는 질문에 사주가 도장을 찍어 답한다는 뜻. 앱 아이콘(assets/icon.png)과 같은 도형.
 * fg: 물음표 색(밝은 바탕엔 먹남색, 어두운 바탕엔 한지색)
 */
export function LogoMark({ size = 24, fg = colors.navy }: { size?: number; fg?: string }) {
  return (
    <Svg width={size * 0.72} height={size} viewBox="26 10 52 84" accessibilityLabel={BRAND.name}>
      <Path d="M33 37 C33 23 42 15 52 15 C63 15 71 22 71 33 C71 42 65 46 59 50 C54 53 51 56 51 62 V64" fill="none" stroke={fg} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />
      <G rotation={-6} origin="51, 81">
        <Rect x={41} y={71} width={20} height={20} rx={2} fill={colors.seal} />
        <Rect x={43} y={73} width={16} height={16} rx={1} fill="none" stroke="#F4EDDF" strokeOpacity={0.7} strokeWidth={0.7} />
        <SvgText x={51} y={86.3} fontFamily={SEAL_FONT} fontWeight="700" fontSize={12.5} fill="#F4EDDF" textAnchor="middle">我</SvgText>
      </G>
    </Svg>
  );
}

/** 워드마크: WHO AM I + 물음표 마크 */
export default function BrandMark({ light = false, size = 20 }: { light?: boolean; size?: number }) {
  const fg = light ? '#F4EDDF' : colors.purple;
  return (
    <View style={s.row} accessibilityLabel={BRAND.name}>
      <Text style={[s.word, { fontSize: size * 0.82, color: fg }]}>{BRAND.word}</Text>
      <LogoMark size={size * 1.05} fg={light ? '#F4EDDF' : colors.navy} />
    </View>
  );
}

const s = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-end', gap: 1 },
  word: { fontFamily: fonts.serif, fontWeight: '800', letterSpacing: 0.6 },
});
