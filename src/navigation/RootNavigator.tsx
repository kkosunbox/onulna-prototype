import React, { useRef } from 'react';
import { View } from 'react-native';
import { LogoMark } from '../components/BrandMark';
import { NavigationContainer, DefaultTheme, createNavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { RootStackParamList, TabParamList } from './types';
import { useApp } from '../context/AppContext';
import { colors } from '../theme/colors';
import BottomNavigation from '../components/BottomNavigation';
import OnboardingScreen from '../screens/OnboardingScreen';
import ProfileSetupScreen from '../screens/ProfileSetupScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import SignUpScreen from '../screens/auth/SignUpScreen';
import EmailLoginScreen from '../screens/auth/EmailLoginScreen';
import FindPasswordScreen from '../screens/auth/FindPasswordScreen';
import SocialLoginScreen from '../screens/auth/SocialLoginScreen';
import HomeScreen from '../screens/HomeScreen';
import FortuneScreen from '../screens/FortuneScreen';
import CompatibilityScreen from '../screens/CompatibilityScreen';
import MyPageScreen from '../screens/MyPageScreen';
import CategoryDetailScreen from '../screens/CategoryDetailScreen';
import AnalysisDetailScreen from '../screens/AnalysisDetailScreen';
import CombinedAnalysisScreen from '../screens/CombinedAnalysisScreen';
import ShareScreen from '../screens/ShareScreen';
import LegalScreen from '../screens/LegalScreen';
import ConsultScreen from '../screens/content/ConsultScreen';
import PastLifeScreen from '../screens/content/PastLifeScreen';
import ContentScreen from '../screens/content/ContentScreen';
import MbtiMatchScreen from '../screens/content/MbtiMatchScreen';
import CharacterScreen from '../screens/content/CharacterScreen';
import TalismanScreen from '../screens/content/TalismanScreen';
import SpouseScreen from '../screens/content/SpouseScreen';
import WalletScreen from '../screens/premium/WalletScreen';
import SajuDeepScreen from '../screens/premium/SajuDeepScreen';
import LifeScreen from '../screens/premium/LifeScreen';
import NewYearScreen from '../screens/premium/NewYearScreen';
import MonthlyScreen from '../screens/premium/MonthlyScreen';
import ThemeScreen from '../screens/premium/ThemeScreen';
import LuckyScreen from '../screens/premium/LuckyScreen';
import { usePremium } from '../context/PremiumContext';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

function MainTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }} tabBar={p => <BottomNavigation {...p} />}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Fortune" component={FortuneScreen} />
      <Tab.Screen name="Content" component={ContentScreen} />
      <Tab.Screen name="Compatibility" component={CompatibilityScreen} />
      <Tab.Screen name="MyPage" component={MyPageScreen} />
    </Tab.Navigator>
  );
}

export const navRef = createNavigationContainerRef<RootStackParamList>();

const theme = { ...DefaultTheme, colors: { ...DefaultTheme.colors, background: colors.cream, primary: colors.purple } };

export default function RootNavigator() {
  const { booting, onboarded, account, user } = useApp();
  const { setGoWallet } = usePremium();
  const wired = useRef(false);
  if (!wired.current) {
    // 열람 시트의 "포인트 충전하러 가기"
    setGoWallet(() => { if (navRef.isReady()) navRef.navigate('Wallet'); });
    wired.current = true;
  }
  if (booting) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.cream }}>
        <LogoMark size={52} />
      </View>
    );
  }
  return (
    <NavigationContainer ref={navRef} theme={theme}>
      <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right', contentStyle: { backgroundColor: colors.cream } }}>
        {!onboarded ? (
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        ) : !account ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="EmailLogin" component={EmailLoginScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
            <Stack.Screen name="FindPassword" component={FindPasswordScreen} />
            <Stack.Screen name="SocialLogin" component={SocialLoginScreen} options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
            <Stack.Screen name="Legal" component={LegalScreen} />
          </>
        ) : !user ? (
          <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
        ) : (
          <>
            <Stack.Screen name="Tabs" component={MainTabs} />
            <Stack.Screen name="CategoryDetail" component={CategoryDetailScreen} />
            <Stack.Screen name="AnalysisDetail" component={AnalysisDetailScreen} />
            <Stack.Screen name="CombinedAnalysis" component={CombinedAnalysisScreen} />
            <Stack.Screen name="Share" component={ShareScreen} options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
            <Stack.Screen name="MbtiMatch" component={MbtiMatchScreen} />
            <Stack.Screen name="Character" component={CharacterScreen} />
            <Stack.Screen name="Talisman" component={TalismanScreen} />
            <Stack.Screen name="Spouse" component={SpouseScreen} />
            <Stack.Screen name="Consult" component={ConsultScreen} />
            <Stack.Screen name="PastLife" component={PastLifeScreen} />
            <Stack.Screen name="Legal" component={LegalScreen} />
            <Stack.Screen name="Wallet" component={WalletScreen} />
            <Stack.Screen name="SajuDeep" component={SajuDeepScreen} />
            <Stack.Screen name="Life" component={LifeScreen} />
            <Stack.Screen name="NewYear" component={NewYearScreen} />
            <Stack.Screen name="Monthly" component={MonthlyScreen} />
            <Stack.Screen name="Theme" component={ThemeScreen} />
            <Stack.Screen name="Lucky" component={LuckyScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
