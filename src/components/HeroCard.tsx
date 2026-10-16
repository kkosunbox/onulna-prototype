import React from 'react';
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import PressableScale from './PressableScale';
import Ico from './Ico';
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

/** 홍보 카드 — 배지 줄 · 소제목 · 보조 설명 · 오른쪽 아이콘 칸. 홈과 콘텐츠 탭이 같은 모양을 쓴다 */
export function PromoCard({ badges, title, desc, ch, color, onPress, style }: {
  badges?: React.ReactNode; title: string; desc: string; ch: string; color: string; onPress(): void; style?: StyleProp<ViewStyle>;
}) {
  return (
    <PressableScale onPress={onPress} style={[s.promo, style]} scaleTo={0.985} accessibilityLabel={title}>
      <HeroBg />
      <View style={{ flex: 1 }}>
        {badges ? <View style={s.badges}>{badges}</View> : null}
        <Text style={[txt.h3, { marginTop: badges ? 10 : 0 }]}>{title}</Text>
        <Text style={[txt.small, { marginTop: 4, color: colors.inkSub }]}>{desc}</Text>
      </View>
      <Ico ch={ch} size={52} color={color} style={{ backgroundColor: colors.card }} />
    </PressableScale>
  );
}

/** NEW 배지 */
export function NewBadge() {
  return <View style={s.newTag}><Text style={s.newText}>NEW</Text></View>;
}

const s = StyleSheet.create({
  newTag: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: radius.pill, backgroundColor: colors.seal },
  newText: { ...txt.micro, color: colors.white, fontWeight: '700' },
  promo: { flexDirection: 'row', alignItems: 'center', gap: 16, padding: 20, borderRadius: radius.lg, overflow: 'hidden', backgroundColor: colors.card, borderWidth: 1, borderColor: colors.line },
  badges: { flexDirection: 'row', gap: 6 },
});
