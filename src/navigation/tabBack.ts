import { useCallback } from 'react';
import { useNavigation, useNavigationState } from '@react-navigation/native';

/**
 * 하단 탭 화면의 뒤로 가기.
 * 탭 네비게이터는 backBehavior="history" 라서 goBack 이 직전에 보던 탭으로 간다.
 * 돌아갈 탭이 없으면 홈으로.
 */
export function useTabBack() {
  const nav = useNavigation<any>();
  return useCallback(() => {
    if (nav.canGoBack()) nav.goBack();
    else nav.navigate('Home');
  }, [nav]);
}

/** 홈 탭에서 돌아갈 이전 탭이 있는지 (탭 이동 기록 기준) */
export function useHasTabHistory() {
  return useNavigationState(s => ((s as any)?.history?.length ?? 0) > 1);
}
