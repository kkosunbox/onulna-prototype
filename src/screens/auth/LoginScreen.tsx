import React, { useCallback, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import BrandMark, { Crescent } from '../../components/BrandMark';
import TextField from '../../components/TextField';
import PrimaryButton from '../../components/PrimaryButton';
import PressableScale from '../../components/PressableScale';
import { FieldError, OrDivider, SocialButton } from '../../components/auth/AuthKit';
import { useApp } from '../../context/AppContext';
import { AuthError, isEmail } from '../../services/auth/authService';
import { colors } from '../../theme/colors';
import { txt } from '../../theme/typography';

export default function LoginScreen() {
  const nav = useNavigation();
  const { signIn } = useApp();
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const can = isEmail(email) && pw.length > 0 && !busy;

  // 다른 화면(비밀번호 찾기 등)에서 돌아오면 비밀번호와 오류를 비운다
  useFocusEffect(useCallback(() => { setPw(''); setErr(null); }, []));

  const submit = async () => {
    if (!can) return;
    setBusy(true); setErr(null);
    try { await signIn(email, pw); }
    catch (e) { setErr(e instanceof AuthError ? e.message : '로그인하지 못했어요. 잠시 후 다시 시도해 주세요.'); }
    finally { setBusy(false); }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.cream }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={s.wrap} keyboardShouldPersistTaps="handled">
          <View style={s.head}>
            <BrandMark />
            <View style={s.moon}><Crescent size={56} color={colors.moon} cut={colors.cream} /></View>
            <Text style={[txt.title, { marginTop: 18 }]}>나를 읽는{'\n'}하루의 시작</Text>
            <Text style={[txt.body, { marginTop: 6 }]}>로그인하고 매일 아침 나만의 운세를 받아보세요.</Text>
          </View>

          <View style={{ gap: 8 }}>
            <SocialButton provider="kakao" onPress={() => nav.navigate('SocialLogin', { provider: 'kakao' })} />
            <SocialButton provider="naver" onPress={() => nav.navigate('SocialLogin', { provider: 'naver' })} />
          </View>

          <OrDivider label="또는 이메일로 로그인" />

          <View style={{ gap: 8 }}>
            <TextField value={email} onChangeText={t => { setEmail(t); setErr(null); }} placeholder="이메일" keyboardType="email-address" autoCapitalize="none" autoComplete="email" textContentType="emailAddress" />
            <TextField value={pw} onChangeText={t => { setPw(t); setErr(null); }} placeholder="비밀번호" secureTextEntry autoComplete="password" textContentType="password" returnKeyType="go" onSubmitEditing={submit} invalid={!!err} />
            <FieldError>{err}</FieldError>
          </View>
          <PrimaryButton label={busy ? '로그인 중…' : '로그인'} onPress={submit} disabled={!can} style={{ marginTop: 16 }} />

          <View style={s.links}>
            <PressableScale onPress={() => nav.navigate('FindPassword')} hitSlop={8}><Text style={s.link}>비밀번호 찾기</Text></PressableScale>
            <View style={s.sep} />
            <PressableScale onPress={() => nav.navigate('SignUp')} hitSlop={8}><Text style={[s.link, { color: colors.purple, fontWeight: '700' }]}>이메일로 회원가입</Text></PressableScale>
          </View>
          <Text style={[txt.caption, { textAlign: 'center', marginTop: 24 }]}>로그인하면 이용약관 및 개인정보 처리방침에 동의하게 돼요.</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  wrap: { paddingHorizontal: 24, paddingTop: 12, paddingBottom: 32 },
  head: { marginBottom: 28 },
  moon: { marginTop: 36 },
  links: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 14, marginTop: 20 },
  link: { fontSize: 14, color: colors.inkSub, fontWeight: '500' },
  sep: { width: 1, height: 12, backgroundColor: colors.lineStrong },
});
