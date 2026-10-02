import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Screen from '../../components/Screen';
import TextField from '../../components/TextField';
import PrimaryButton from '../../components/PrimaryButton';
import Card from '../../components/Card';
import { CheckRow, FieldError, FieldLabel } from '../../components/auth/AuthKit';
import { useApp } from '../../context/AppContext';
import { usePremium } from '../../context/PremiumContext';
import { AuthError, isEmail, isStrongPassword } from '../../services/auth/authService';
import { colors } from '../../theme/colors';
import { txt } from '../../theme/typography';

type AgreeKey = 'age' | 'terms' | 'privacy' | 'marketing';
const AGREES: { k: AgreeKey; label: string; required: boolean }[] = [
  { k: 'age', label: '[필수] 만 14세 이상이에요', required: true },
  { k: 'terms', label: '[필수] 서비스 이용약관 동의', required: true },
  { k: 'privacy', label: '[필수] 개인정보 수집·이용 동의', required: true },
  { k: 'marketing', label: '[선택] 아침 운세·이벤트 소식 받기', required: false },
];
const DOC: Record<string, string> = {
  terms: '오늘나 서비스 이용약관(예시)\n· 운세 콘텐츠는 재미와 참고를 위한 것이며 중요한 결정의 근거가 될 수 없어요.\n· 포인트는 콘텐츠 열람에만 쓸 수 있어요.',
  privacy: '개인정보 수집·이용(예시)\n· 항목: 이메일, 닉네임, 생년월일·출생시간, 성별, MBTI, 혈액형\n· 목적: 맞춤 운세 제공\n· 보관: 회원 탈퇴 시까지',
};

export default function SignUpScreen() {
  const { signUp } = useApp();
  const { toast } = usePremium();
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [pw2, setPw2] = useState('');
  const [agree, setAgree] = useState<Record<AgreeKey, boolean>>({ age: false, terms: false, privacy: false, marketing: false });
  const [doc, setDoc] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const emailBad = email.length > 0 && !isEmail(email);
  const pwBad = pw.length > 0 && !isStrongPassword(pw);
  const pw2Bad = pw2.length > 0 && pw2 !== pw;
  const allAgree = AGREES.every(a => agree[a.k]);
  const requiredOk = AGREES.filter(a => a.required).every(a => agree[a.k]);
  const can = isEmail(email) && isStrongPassword(pw) && pw === pw2 && requiredOk && !busy;

  const submit = async () => {
    if (!can) return;
    setBusy(true); setErr(null);
    try {
      await signUp({ email, password: pw, marketing: agree.marketing });
      toast('가입을 환영해요! 운세 프로필을 만들어 볼까요');
    } catch (e) {
      setErr(e instanceof AuthError ? e.message : '가입하지 못했어요. 잠시 후 다시 시도해 주세요.');
      setBusy(false);
    }
  };

  return (
    <Screen title="회원가입" back footer={<PrimaryButton label={busy ? '가입 중…' : '가입하기'} onPress={submit} disabled={!can} />}>
      <Text style={[txt.title, { marginTop: 8 }]}>이메일로 시작하기</Text>
      <Text style={[txt.small, { marginTop: 6 }]}>가입 후 생년월일과 성향을 입력하면 운세가 준비돼요.</Text>

      <View style={{ marginTop: 28, gap: 20 }}>
        <View>
          <FieldLabel>이메일</FieldLabel>
          <TextField value={email} onChangeText={t => { setEmail(t); setErr(null); }} placeholder="example@onulna.app" keyboardType="email-address" autoCapitalize="none" autoComplete="email" textContentType="emailAddress" invalid={emailBad || !!err} />
          <FieldError>{emailBad ? '이메일 형식을 확인해 주세요.' : err}</FieldError>
        </View>
        <View>
          <FieldLabel>비밀번호</FieldLabel>
          <TextField value={pw} onChangeText={setPw} placeholder="영문·숫자 포함 8자 이상" secureTextEntry autoComplete="new-password" textContentType="newPassword" invalid={pwBad} />
          {pwBad ? <FieldError>영문과 숫자를 섞어 8자 이상으로 만들어 주세요.</FieldError> : <Text style={[txt.caption, { marginTop: 6 }]}>영문과 숫자를 섞어 8자 이상</Text>}
        </View>
        <View>
          <FieldLabel>비밀번호 확인</FieldLabel>
          <TextField value={pw2} onChangeText={setPw2} placeholder="비밀번호를 한 번 더 입력해 주세요" secureTextEntry autoComplete="new-password" textContentType="newPassword" invalid={pw2Bad} />
          <FieldError>{pw2Bad ? '비밀번호가 서로 달라요.' : null}</FieldError>
        </View>
      </View>

      <Card style={{ marginTop: 28, paddingVertical: 10 }}>
        <CheckRow strong checked={allAgree} label="전체 동의" onPress={() => { const v = !allAgree; setAgree({ age: v, terms: v, privacy: v, marketing: v }); }} />
        <View style={s.hr} />
        {AGREES.map(a => (
          <CheckRow key={a.k} checked={agree[a.k]} label={a.label} onPress={() => setAgree(x => ({ ...x, [a.k]: !x[a.k] }))} onView={DOC[a.k] ? () => setDoc(d => (d === a.k ? null : a.k)) : undefined} />
        ))}
        {doc ? <Text style={s.doc}>{DOC[doc]}</Text> : null}
      </Card>
    </Screen>
  );
}

const s = StyleSheet.create({
  hr: { height: 1, backgroundColor: colors.line, marginVertical: 6 },
  doc: { marginTop: 8, padding: 12, borderRadius: 10, backgroundColor: colors.cream, fontSize: 12, lineHeight: 18, color: colors.inkSub },
});
