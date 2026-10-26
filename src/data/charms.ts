import { KeywordTag } from '../types';
import { CharmTheme } from '../components/TalismanCard';

/** 부적 테마 색 — 키워드마다 한 벌 (진한 그라데이션 + 한자 색) */
const T = (from: string, to: string, deep: string): CharmTheme => ({ from, to, deep });
export const CHARM_THEME: Record<KeywordTag, CharmTheme> = {
  opportunity: T('#F0614B', '#B8261E', '#B32A1C'),
  change: T('#8B6CFF', '#4B2FC9', '#4A2EC2'),
  newMeeting: T('#FF7FA0', '#D63C6A', '#C8335F'),
  money: T('#E6B23A', '#B97A10', '#9A6206'),
  rest: T('#45C2B1', '#1E7F82', '#17716F'),
  focus: T('#4A6CF0', '#1A2C8F', '#22359E'),
  expression: T('#FF9A4D', '#E0561B', '#C9480F'),
  caution: T('#5F7192', '#2B3550', '#2E3A57'),
  harmony: T('#4DB2FA', '#1B6FC4', '#1A64B3'),
  challenge: T('#E9506E', '#9E1F3E', '#9C1F3D'),
  intuition: T('#A274FF', '#5B2BB5', '#5A2CB0'),
  learning: T('#55C27A', '#23804A', '#1F7443'),
};

export const CHARM_EN: Record<KeywordTag, string> = {
  opportunity: 'OPPORTUNITY', change: 'CHANGE', newMeeting: 'NEW ENCOUNTER', money: 'FORTUNE', rest: 'RECHARGE', focus: 'FOCUS',
  expression: 'EXPRESSION', caution: 'PRUDENCE', harmony: 'HARMONY', challenge: 'CHALLENGE', intuition: 'INTUITION', learning: 'WISDOM',
};

/** 선물 부적 — 받는 사람에게 빌어 줄 소원 */
export type Wish = { key: string; label: string; hanja: string; name: string; en: string; mantra: string; theme: CharmTheme };
export const WISHES: Wish[] = [
  { key: 'luck', label: '행운', hanja: '福', name: '행운의 부적', en: 'GOOD LUCK', mantra: '오늘 하루 좋은 일만 줄줄이 생긴다', theme: T('#F0614B', '#B8261E', '#B32A1C') },
  { key: 'pass', label: '합격', hanja: '合', name: '합격 부적', en: 'PASS', mantra: '준비한 만큼, 아니 그 이상으로 붙는다', theme: T('#4A6CF0', '#1A2C8F', '#22359E') },
  { key: 'love', label: '연애', hanja: '緣', name: '인연 부적', en: 'LOVE', mantra: '좋은 인연이 먼저 알아보고 찾아온다', theme: T('#FF7FA0', '#D63C6A', '#C8335F') },
  { key: 'money', label: '재물', hanja: '財', name: '재물 부적', en: 'WEALTH', mantra: '들어올 돈은 들어오고 나갈 돈은 머문다', theme: T('#E6B23A', '#B97A10', '#9A6206') },
  { key: 'health', label: '건강', hanja: '康', name: '건강 부적', en: 'HEALTH', mantra: '아프지 말고 오늘도 씩씩하게', theme: T('#55C27A', '#23804A', '#1F7443') },
  { key: 'success', label: '성공', hanja: '成', name: '성공 부적', en: 'SUCCESS', mantra: '하는 일마다 술술 풀린다', theme: T('#8B6CFF', '#4B2FC9', '#4A2EC2') },
  { key: 'cheer', label: '응원', hanja: '力', name: '응원 부적', en: 'CHEER UP', mantra: '지금도 충분히 잘하고 있어', theme: T('#FF9A4D', '#E0561B', '#C9480F') },
  { key: 'peace', label: '평안', hanja: '安', name: '평안 부적', en: 'PEACE', mantra: '걱정은 내려놓고 마음은 편안하게', theme: T('#45C2B1', '#1E7F82', '#17716F') },
];
