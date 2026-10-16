import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import PressableScale from './PressableScale';
import { colors } from '../theme/colors';
import { radius, shadow } from '../theme/typography';

interface Props {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  variant?: 'elevated' | 'flat' | 'tinted';
  tint?: string;
  onPress?(): void;
  accessibilityLabel?: string;
}

/**
 * 기본 카드. 흰 바탕 · 반경 22 · 옅은 1px 선 · 거의 보이지 않는 그림자 · 안쪽 여백 20.
 * 히어로(26)·카드(22)·입력(14)·아이콘 칸(13) 반경 위계를 지킨다.
 */
export default function Card({ children, style, variant = 'elevated', tint, onPress, accessibilityLabel }: Props) {
  const base = [
    s.base,
    variant === 'elevated' && s.elevated,
    variant === 'flat' && s.flat,
    variant === 'tinted' && { backgroundColor: tint ?? colors.lavenderSoft },
    style,
  ];
  if (onPress) {
    return <PressableScale onPress={onPress} style={base} accessibilityLabel={accessibilityLabel}>{children}</PressableScale>;
  }
  return <View style={base}>{children}</View>;
}

const s = StyleSheet.create({
  base: { borderRadius: radius.lg, padding: 20, backgroundColor: colors.card },
  elevated: { ...shadow.card, borderWidth: 1, borderColor: colors.line },
  flat: { borderWidth: 1, borderColor: colors.line },
});
