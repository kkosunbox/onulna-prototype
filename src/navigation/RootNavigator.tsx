import React from 'react';
import { View } from 'react-native';
import { Crescent } from '../components/BrandMark';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { RootStackParamList, TabParamList } from './types';
import { useApp } from '../context/AppContext';
import { colors } from '../theme/colors';
import BottomNavigation from '../components/BottomNavigation';
import OnboardingScreen from '../screens/OnboardingScreen';
import ProfileSetupScreen from '../screens/ProfileSetupScreen';
import HomeScreen from '../screens/HomeScreen';
import FortuneScreen from '../screens/FortuneScreen';
import CompatibilityScreen from '../screens/CompatibilityScreen';
import MyPageScreen from '../screens/MyPageScreen';
import CategoryDetailScreen from '../screens/CategoryDetailScreen';
import AnalysisDetailScreen from '../screens/AnalysisDetailScreen';
import CombinedAnalysisScreen from '../screens/CombinedAnalysisScreen';
import ShareScreen from '../screens/ShareScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

function MainTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }} tabBar={p => <BottomNavigation {...p} />}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Fortune" component={FortuneScreen} />
      <Tab.Screen name="Compatibility" component={CompatibilityScreen} />
      <Tab.Screen name="MyPage" component={MyPageScreen} />
    </Tab.Navigator>
  );
}

const theme = { ...DefaultTheme, colors: { ...DefaultTheme.colors, background: colors.cream, primary: colors.purple } };

export default function RootNavigator() {
  const { booting, onboarded, user } = useApp();
  if (booting) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.cream }}>
        <Crescent size={40} />
      </View>
    );
  }
  return (
    <NavigationContainer theme={theme}>
      <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right', contentStyle: { backgroundColor: colors.cream } }}>
        {!onboarded ? (
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        ) : !user ? (
          <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
        ) : (
          <>
            <Stack.Screen name="Tabs" component={MainTabs} />
            <Stack.Screen name="CategoryDetail" component={CategoryDetailScreen} />
            <Stack.Screen name="AnalysisDetail" component={AnalysisDetailScreen} />
            <Stack.Screen name="CombinedAnalysis" component={CombinedAnalysisScreen} />
            <Stack.Screen name="Share" component={ShareScreen} options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
