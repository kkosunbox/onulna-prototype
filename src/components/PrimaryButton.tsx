import React from 'react';
import { StyleSheet, Text, ViewStyle, StyleProp, View } from 'react-native';
import PressableScale from './PressableScale';
import { colors, isDark } from '../theme/colors';
import { radius, shadow } from '../theme/typography';

interface Props { label: string; onPress(): void; disabled?: boolean; variant?: 'solid' | 'soft' | 'text'; style?: StyleProp<ViewStyle>; icon?: React.ReactNode }

/** 검정 버튼(반경 12) · soft 는 흰 바탕+선 · text 는 글자만 */
export default function PrimaryButton({ label, onPress, disabled, variant = 'solid', style, icon }: Props) {
  const solid = variant === 'solid';
  return (
    <PressableScale onPress={onPress} disabled={disabled} haptic={solid} style={[s.wrap, style]} accessibilityState={{ disabled }}>
      <View style={[s.inner, solid ? [{ backgroundColor: disabled ? colors.lineStrong : colors.navy }, !disabled && shadow.card] : variant === 'soft' ? { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.lineStrong } : null]}>
        {icon}<Text style={[s.label, !solid ? { color: colors.purple } : disabled ? { color: colors.inkMute } : null]}>{label}</Text>
      </View>
    </PressableScale>
  );
}

const s = StyleSheet.create({
  wrap: { borderRadius: radius.md },
  inner: { height: 54, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8 },
  label: { color: colors.white, fontSize: 15, fontWeight: '700', letterSpacing: -0.2 },
});
