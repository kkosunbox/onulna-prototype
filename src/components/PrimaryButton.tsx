import React from 'react';
import { StyleSheet, Text, ViewStyle, StyleProp, View } from 'react-native';
import PressableScale from './PressableScale';
import { colors, isDark } from '../theme/colors';
import { radius, shadow } from '../theme/typography';

interface Props { label: string; onPress(): void; disabled?: boolean; variant?: 'solid' | 'soft' | 'text'; style?: StyleProp<ViewStyle>; icon?: React.ReactNode }

/** 검정 알약 버튼 · soft 는 옅은 회색 알약 · text 는 글자만 */
export default function PrimaryButton({ label, onPress, disabled, variant = 'solid', style, icon }: Props) {
  const solid = variant === 'solid';
  return (
    <PressableScale onPress={onPress} disabled={disabled} haptic={solid} style={[s.wrap, style]} accessibilityState={{ disabled }}>
      <View style={[s.inner, solid ? [{ backgroundColor: disabled ? colors.lineStrong : colors.navy }, !disabled && shadow.card] : variant === 'soft' ? { backgroundColor: colors.lavenderSoft } : null]}>
        {icon}<Text style={[s.label, !solid ? { color: colors.purple } : disabled ? { color: colors.inkMute } : null]}>{label}</Text>
      </View>
    </PressableScale>
  );
}

const s = StyleSheet.create({
  wrap: { borderRadius: radius.pill },
  inner: { height: 56, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8 },
  label: { color: colors.white, fontSize: 15, fontWeight: '700', letterSpacing: -0.2 },
});
