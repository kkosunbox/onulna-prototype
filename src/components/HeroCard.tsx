import React from 'react';
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import PressableScale from './PressableScale';
import Mascot, { MascotFace, MascotPalette, MascotProp } from './Mascot';
import { colors, gradients } from '../theme/colors';
import { radius, shadow, txt } from '../theme/typography';

/**
 * 모든 화면의 '맨 위 카드'와 '홍보 카드'는 이 파일의 부품만 쓴다.
 * 같은 그라데이션 · 반경 26 · 안쪽 여백 22 · 옅은 선 · 은은한 그림자 → 화면마다 따로 만든 느낌이 나지 않게.
 */

/** 히어로 바탕(그라데이션) — 캡처용 View 안에 첫 자식으로 깔 때 */
export function HeroBg({ tone }: { tone?: string }) {
  return (
    <LinearGradient
      pointerEvents="none"
      colors={tone ? [tone, colors.card] : gradients.hero}
      start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
      style={StyleSheet.absoluteFill}
    />
  );
}

/** 검정 결과 카드 겉모양(무료 콘텐츠 결과 · 공유용) — 위 글자는 흰색, 포인트는 lime */
export const darkSurface: ViewStyle = { borderRadius: radius.xl, padding: 22, overflow: 'hidden', backgroundColor: colors.heroBg };
export const onDark = { text: '#FFFFFF', sub: 'rgba(255,255,255,0.78)', mute: 'rgba(255,255,255,0.55)', accent: colors.lime };

/** 히어로 카드 겉모양 */
export const heroSurface: ViewStyle = {
  borderRadius: radius.xl, padding: 22, overflow: 'hidden', backgroundColor: colors.card,
  borderWidth: 1, borderColor: colors.line, ...shadow.hero,
};

export default function HeroCard({ children, style, tone }: { children: React.ReactNode; style?: StyleProp<ViewStyle>; tone?: string }) {
  return (
    <View style={[heroSurface, style]}>
      <HeroBg tone={tone} />
      {children}
    </View>
  );
}

/** 홍보 카드 — 검정 바탕 · 연두 제목 · 흰 설명 · 흰 알약 버튼 · 오른쪽 아래 운알이. 홈과 콘텐츠 탭이 같은 모양을 쓴다 */
const PROMO_MASCOT: Record<string, { palette: MascotPalette; face: MascotFace; prop: MascotProp }> = {
  談: { palette: 'classic', face: 'curious', prop: 'question' },
  緣: { palette: 'pink', face: 'happy', prop: 'heart' },
  心: { palette: 'peach', face: 'wink', prop: 'heart' },
};
export function PromoCard({ badges, title, desc, ch, onPress, style, cta }: {
  badges?: React.ReactNode; title: string; desc: string; ch: string; color?: string; onPress(): void; style?: StyleProp<ViewStyle>; cta?: string;
}) {
  const m = PROMO_MASCOT[ch] ?? { palette: 'classic', face: 'open', prop: 'sparkle' };
  return (
    <PressableScale onPress={onPress} style={[s.promo, style]} scaleTo={0.985} accessibilityLabel={title}>
      <View style={s.promoMascot} pointerEvents="none"><Mascot size={104} shadow={false} {...m} /></View>
      <View style={{ paddingRight: 84 }}>
        {badges ? <View style={s.badges}>{badges}</View> : null}
        <Text style={[s.promoTitle, { marginTop: badges ? 10 : 0 }]}>{title}</Text>
        <Text style={s.promoDesc}>{desc}</Text>
        {cta ? <View style={s.cta}><Text style={s.ctaText}>{cta} →</Text></View> : null}
      </View>
    </PressableScale>
  );
}

/** NEW 배지 — 검정 카드 위 연두 테두리 */
export function NewBadge() {
  return <View style={s.newTag}><Text style={s.newText}>NEW</Text></View>;
}

const s = StyleSheet.create({
  newTag: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6, borderWidth: 1, borderColor: colors.lime },
  newText: { ...txt.micro, color: colors.lime, fontWeight: '700' },
  promo: { padding: 20, borderRadius: radius.lg, overflow: 'hidden', backgroundColor: colors.heroBg },
  promoMascot: { position: 'absolute', right: -10, bottom: -18, opacity: 0.95 },
  promoTitle: { ...txt.h3, color: colors.lime },
  promoDesc: { ...txt.small, color: 'rgba(255,255,255,0.78)', marginTop: 4 },
  cta: { alignSelf: 'flex-start', marginTop: 14, paddingHorizontal: 14, paddingVertical: 8, borderRadius: radius.pill, backgroundColor: colors.white },
  ctaText: { ...txt.small, color: '#1E2128', fontWeight: '700' },
  badges: { flexDirection: 'row', gap: 6 },
});
