/** 로그인·회원가입 공용 UI — 소셜 버튼, 체크박스 행, 오류 문구, 구분선 */
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import PressableScale from '../PressableScale';
import Icon from '../Icon';
import { colors } from '../../theme/colors';
import { radius, txt } from '../../theme/typography';

/** 카카오 말풍선 심볼 */
function KakaoMark({ size = 18 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M12 3.5c-5.25 0-9.5 3.33-9.5 7.44 0 2.66 1.78 5 4.46 6.31l-.98 3.6c-.09.32.27.58.55.39l4.27-2.84c.4.04.79.06 1.2.06 5.25 0 9.5-3.33 9.5-7.52S17.25 3.5 12 3.5z" fill="#191919" />
    </Svg>
  );
}

/** 네이버 N 심볼 */
function NaverMark({ size = 15 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20">
      <Path d="M13.56 10.7 6.17 0H0v20h6.44V9.3L13.83 20H20V0h-6.44z" fill="#FFFFFF" />
    </Svg>
  );
}

/** 카카오·네이버 브랜드 가이드 색의 로그인 버튼 */
export function SocialButton({ provider, onPress, label }: { provider: 'kakao' | 'naver'; onPress(): void; label?: string }) {
  const kakao = provider === 'kakao';
  return (
    <PressableScale onPress={onPress} style={[s.social, { backgroundColor: kakao ? '#FEE500' : '#03C75A' }]} accessibilityRole="button" accessibilityLabel={label ?? (kakao ? '카카오로 시작하기' : '네이버로 시작하기')}>
      <View style={s.socialIco}>{kakao ? <KakaoMark /> : <NaverMark />}</View>
      <Text style={[s.socialText, { color: kakao ? 'rgba(0,0,0,0.85)' : '#FFFFFF' }]}>{label ?? (kakao ? '카카오로 시작하기' : '네이버로 시작하기')}</Text>
    </PressableScale>
  );
}

export function OrDivider({ label }: { label: string }) {
  return (
    <View style={s.or}>
      <View style={s.orLine} />
      <Text style={txt.caption}>{label}</Text>
      <View style={s.orLine} />
    </View>
  );
}

/** 체크박스 + 문구 (+ 오른쪽 "보기") */
export function CheckRow({ checked, onPress, label, strong, onView }: { checked: boolean; onPress(): void; label: string; strong?: boolean; onView?(): void }) {
  return (
    <View style={s.checkRow}>
      <PressableScale onPress={onPress} style={s.checkHit} scaleTo={0.98} accessibilityRole="checkbox" accessibilityState={{ checked }} accessibilityLabel={label}>
        <View style={[s.box, checked && s.boxOn]}>{checked ? <Icon name="check" size={14} color={colors.white} strokeWidth={3} /> : null}</View>
        <Text style={[s.checkText, strong && { fontWeight: '700', color: colors.ink }]}>{label}</Text>
      </PressableScale>
      {onView ? <PressableScale onPress={onView} hitSlop={8}><Text style={s.view}>보기</Text></PressableScale> : null}
    </View>
  );
}

export function FieldError({ children }: { children?: string | null }) {
  if (!children) return null;
  return <Text style={s.err} accessibilityLiveRegion="polite">{children}</Text>;
}

export function FieldLabel({ children }: { children: string }) {
  return <Text style={s.label}>{children}</Text>;
}

/** 데모 안내 상자 */
export function DemoNote({ children }: { children: React.ReactNode }) {
  return (
    <View style={s.demo}>
      <Text style={s.demoTag}>데모</Text>
      <Text style={s.demoText}>{children}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  social: { height: 52, borderRadius: radius.md, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  socialIco: { position: 'absolute', left: 18 },
  socialText: { fontSize: 15, fontWeight: '600', letterSpacing: -0.2 },
  or: { flexDirection: 'row', alignItems: 'center', gap: 10, marginVertical: 22 },
  orLine: { flex: 1, height: 1, backgroundColor: colors.line },
  checkRow: { flexDirection: 'row', alignItems: 'center', minHeight: 40 },
  checkHit: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 6 },
  box: { width: 22, height: 22, borderRadius: 6, borderWidth: 1.5, borderColor: colors.lineStrong, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center' },
  boxOn: { backgroundColor: colors.navy, borderColor: colors.navy },
  checkText: { flex: 1, fontSize: 14, color: colors.inkSub, fontWeight: '500' },
  view: { fontSize: 13, color: colors.inkMute, textDecorationLine: 'underline' },
  err: { color: colors.danger, fontSize: 12, marginTop: 6 },
  label: { fontSize: 13, fontWeight: '600', color: colors.inkSub, marginBottom: 8 },
  demo: { flexDirection: 'row', gap: 8, alignItems: 'flex-start', backgroundColor: colors.lavenderSoft, borderRadius: radius.md, padding: 12, borderLeftWidth: 3, borderLeftColor: colors.seal },
  demoTag: { fontSize: 11, fontWeight: '700', color: colors.seal, marginTop: 1 },
  demoText: { flex: 1, fontSize: 13, lineHeight: 19, color: colors.inkSub },
});
