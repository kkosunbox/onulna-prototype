/**
 * 포인트 상품 카탈로그 — 1,000원 = 100P, 항목별 열람.
 * 키는 열람 권한(unlocks)의 키와 같다. 기간이 있는 상품은 until(YYYY-MM-DD)까지 볼 수 있다.
 */
import { PURPOSE } from './data';
import { PurposeKey, addDays } from './engine';

export interface Item {
  key: string; title: string; cost: number; scope: string; desc: string;
  until?: string; orig?: number; includes?: string[];
}

export type ThemeKind = 'love' | 'money' | 'career';
export const THEME_T: Record<ThemeKind, string> = { love: '연애·결혼 운세', money: '재물 운세', career: '직업·적성 운세' };

export const ITEMS = {
  sajuDeep: (): Item => ({ key: 'saju', title: '상세 사주 해석', cost: 300, scope: '한 번 열면 계속 볼 수 있어요', desc: '12개 섹션 평생 종합 풀이 · 약 1만 자 · 본질 · 성격 · 연애 · 재물 · 직업 · 건강 · 대운 · 개운법 + 사주 원국 상세 데이터' }),
  life: (): Item => ({ key: 'life', title: '평생운 · 10년 대운', cost: 500, scope: '한 번 열면 계속 볼 수 있어요', desc: '10개 섹션 · 약 8천 자 · 초년·중년·말년 · 10년 대운 8개 · 황금기와 위기 · 앞으로 10년 + 인생 그래프' }),
  newyear: (y: number): Item => ({ key: 'ny-' + y, title: y + '년 신년운세', cost: 300, scope: y + '년 운세를 계속 볼 수 있어요', desc: '14개 섹션 · 약 1만 자 · 총운 · 상·하반기 · 분야별 6대 운세 · 12개월 하나하나 · 개운법 · 편지' }),
  monthly: (y: number, m: number): Item => ({ key: `m-${y}-${m}`, title: `${y}년 ${m}월 상세운세`, cost: 100, scope: '그달의 운세를 계속 볼 수 있어요', desc: '11개 섹션 · 약 9천 자 · 총운 · 주차별 흐름 · 분야별 운세 · 좋은 날 활용법 + 날짜별 운세 한 달 전체' }),
  theme: (k: ThemeKind): Item => ({
    key: 'theme-' + k, title: THEME_T[k], cost: 200, scope: '한 번 열면 계속 볼 수 있어요',
    desc: {
      love: '8개 섹션 · 연애 DNA · 배우자 자리 · 잘 맞는 사람 · 연애 패턴 · 결혼 흐름 · 관계를 지키는 법',
      money: '8개 섹션 · 재물 DNA · 버는 방식 · 쓰는 습관 · 모으는 법 · 재물이 모이는 시기 · 5년 흐름',
      career: '8개 섹션 · 직업 DNA · 맞는 분야 · 리더십 · 조직형·독립형 · 커리어 상승기 · 이직 타이밍',
    }[k],
  }),
  lucky: (pk: PurposeKey, today: string): Item => {
    const P = PURPOSE.find(p => p[0] === pk)!;
    return { key: 'lucky-' + pk, title: P[2] + ' 길일 TOP 5', cost: 50, scope: '7일 동안 볼 수 있어요', until: addDays(today, 7), desc: 'TOP 5 상세 이유 · 귀인일 · 피해야 할 날 · 당일 팁' };
  },
  spouse: (): Item => ({ key: 'spouse', title: '미래 배우자 리포트', cost: 300, scope: '한 번 열면 계속 볼 수 있어요', desc: '배우자의 성격 · 외모 분위기 · 찰떡 MBTI와 띠 · 만나는 시기와 장소 · 첫 만남 · 인연을 끌어오는 법' }),
  crush: (name: string, birthDate: string): Item => ({ key: 'crush-' + name + '-' + birthDate, title: name + '님의 속마음', cost: 150, scope: '이 상대의 속마음은 계속 볼 수 있어요', desc: '나를 향한 마음 온도 · 나를 어떤 사람으로 느끼는지 · 3개월 관계 흐름 · 연락하기 좋은 날 · 다가가는 법' }),
  compat: (name: string, birthDate: string): Item => ({
    key: 'compat-' + name + '-' + birthDate, title: name + '님과 심층 궁합', cost: 150, scope: '이 상대와의 궁합은 계속 볼 수 있어요',
    desc: '11개 섹션 궁합 리포트 · 끌림 · 성격 · 대화 · 연애 · 결혼 · 금전 · 갈등과 화해 · 서로에게 보내는 편지',
  }),
};

export const BUNDLE: Item = {
  key: 'bundle-life', title: '인생 패키지', cost: 1100, orig: 1400, scope: '포함된 콘텐츠를 모두 계속 볼 수 있어요',
  desc: '상세 사주 해석 · 평생운 · 테마 운세 3종', includes: ['saju', 'life', 'theme-love', 'theme-money', 'theme-career'],
};

export const PRICE_TABLE: [string, string][] = [
  ['오늘의 운세 · 4가지 분석 · 종합', '무료'], ['주간 운세 · 기본 궁합', '무료'], ['찰떡 MBTI · 사주 캐릭터 · 오늘의 부적', '무료'], ['월별 상세운세', '100P / 월'], ['신년운세', '300P / 해'],
  ['상세 사주 해석', '300P · 소장'], ['평생운 · 10년 대운', '500P · 소장'], ['테마 운세 (연애 · 재물 · 직업)', '각 200P · 소장'],
  ['심층 궁합', '150P / 상대 1명'], ['그 사람의 속마음', '150P / 상대 1명'], ['미래 배우자 리포트', '300P · 소장'], ['길일 찾기', '50P / 목적별 7일'], ['인생 패키지', '1,100P (1,400P → 21% 할인)'],
];

export const fmtP = (n: number) => n.toLocaleString('ko-KR') + 'P';
