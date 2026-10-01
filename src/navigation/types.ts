import { NavigatorScreenParams } from '@react-navigation/native';
import { AnalysisResult } from '../types';
import { CategoryKey } from '../theme/colors';

export type TabParamList = {
  Home: undefined;
  Fortune: undefined;
  Compatibility: undefined;
  MyPage: undefined;
};

export type RootStackParamList = {
  Onboarding: undefined;
  ProfileSetup: undefined;
  Tabs: NavigatorScreenParams<TabParamList>;
  CategoryDetail: { category: CategoryKey };
  AnalysisDetail: { source: AnalysisResult['source'] };
  CombinedAnalysis: undefined;
  Share: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
