import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Crescent } from '../../components/BrandMark';
import PressableScale from '../../components/PressableScale';
import BottomSheet from '../../components/BottomSheet';
import Icon from '../../components/Icon';
import { SocialCircle } from '../../components/auth/AuthKit';
import { usePremium } from '../../context/PremiumContext';
import { SocialProvider } from '../../services/auth/authService';
import { colors } from '../../theme/colors';
import { fonts, radius, txt } from '../../theme/typography';

const PROVIDERS: SocialProvider[] = ['kakao', 'naver', 'apple', 'google'];

/** 첫 화면: 큰 문구 + 소셜 아이콘 한 줄. 이메일은 보조 동선으로 */
export default function LoginScreen() {
  const nav = useNavigation();
  const { toast } = usePremium();
  const [help, setHelp] = useState(false);

  const helpItem = (label: string, onPress: () => void) => (
    <PressableScale key={label} onPress={() => { setHelp(false); onPress(); }} style={s.helpRow} scaleTo={0.98}>
      <Text style={s.helpText}>{label}</Text>
      <Icon name="chevronRight" size={18} color={colors.inkMute} />
    </PressableScale>
  );

  return (
    <SafeAreaView style={s.root}>
      <View style={s.hero}>
        <Text style={s.headline}>매일 아침,{'\n'}나를 읽는 네 가지 관점</Text>
        <View style={s.logo}>
          <Crescent size={30} color={colors.purple} cut={colors.cream} />
          <Text style={s.logoText}>오늘나</Text>
          <View style={s.logoDot} />
        </View>
        <Text style={[txt.small, { marginTop: 14 }]}>사주 · 태국 점성술 · MBTI · 혈액형</Text>
      </View>

      <View style={s.bottom}>
        <Text style={s.caption}>SNS 계정으로 간편 가입하기</Text>
        <View style={s.circles}>
          {PROVIDERS.map(p => <SocialCircle key={p} provider={p} onPress={() => nav.navigate('SocialLogin', { provider: p })} />)}
        </View>
        <PressableScale onPress={() => nav.navigate('SignUp')} hitSlop={8} style={{ marginTop: 26 }}>
          <Text style={s.emailLink}>이메일로 시작하기</Text>
        </PressableScale>
        <PressableScale onPress={() => setHelp(true)} style={s.helpPill} scaleTo={0.96}>
          <Text style={s.helpPillText}>로그인에 어려움이 있나요?</Text>
        </PressableScale>
      </View>

      <BottomSheet visible={help} onClose={() => setHelp(false)}>
        <Text style={[txt.h2, { marginBottom: 6 }]}>무엇을 도와드릴까요?</Text>
        {helpItem('이메일로 로그인', () => nav.navigate('EmailLogin'))}
        {helpItem('비밀번호를 잊어버렸어요', () => nav.navigate('FindPassword'))}
        {helpItem('어떤 방법으로 가입했는지 모르겠어요', () => toast('가입할 때 쓴 SNS 아이콘을 차례로 눌러 보세요'))}
        {helpItem('고객센터에 문의하기', () => toast('고객센터는 준비 중이에요 (데모)'))}
      </BottomSheet>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.cream },
  hero: { flex: 1, justifyContent: 'center', paddingHorizontal: 32 },
  headline: { fontSize: 22, lineHeight: 32, fontWeight: '600', color: colors.ink, letterSpacing: -0.5 },
  logo: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 18 },
  logoText: { fontFamily: fonts.serif, fontSize: 40, fontWeight: '600', color: colors.purple, letterSpacing: -1.2 },
  logoDot: { width: 9, height: 9, borderRadius: 5, backgroundColor: colors.moon, marginTop: 22 },
  bottom: { alignItems: 'center', paddingBottom: 20, paddingHorizontal: 24 },
  caption: { fontSize: 13, color: colors.inkMute, fontWeight: '500' },
  circles: { flexDirection: 'row', gap: 16, marginTop: 16 },
  emailLink: { fontSize: 15, fontWeight: '600', color: colors.inkSub, textDecorationLine: 'underline' },
  helpPill: { marginTop: 28, paddingHorizontal: 16, paddingVertical: 9, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.lineStrong },
  helpPillText: { fontSize: 13, color: colors.inkMute, fontWeight: '500' },
  helpRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: colors.line },
  helpText: { fontSize: 15, color: colors.ink, fontWeight: '500' },
});
