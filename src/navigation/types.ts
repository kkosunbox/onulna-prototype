import { NavigatorScreenParams } from '@react-navigation/native';
import { AnalysisResult } from '../types';
import { CategoryKey } from '../theme/colors';
import { ThemeKind } from '../services/premium/catalog';

export type TabParamList = {
  Home: undefined;
  Fortune: undefined;
  Compatibility: undefined;
  MyPage: undefined;
};

export type RootStackParamList = {
  Onboarding: undefined;
  Login: undefined;
  SignUp: undefined;
  FindPassword: undefined;
  SocialLogin: { provider: 'kakao' | 'naver' };
  ProfileSetup: undefined;
  Tabs: NavigatorScreenParams<TabParamList>;
  CategoryDetail: { category: CategoryKey };
  AnalysisDetail: { source: AnalysisResult['source'] };
  CombinedAnalysis: undefined;
  Share: undefined;
  PremiumHub: undefined;
  Wallet: undefined;
  SajuDeep: undefined;
  Life: undefined;
  NewYear: { year?: number } | undefined;
  Monthly: { y: number; m: number } | undefined;
  Theme: { kind: ThemeKind };
  Lucky: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
