/**
 * 서양 · 인도(베딕) 점성술 기초 데이터.
 * - 서양: 열대 황도대(춘분점 기준) 12별자리 · 원소 · 성질 · 지배 행성
 * - 인도: 항성 황도대(라시) 12개 · 27 낙샤트라(달의 집)와 빔쇼타리 지배 행성 · 타라(9단계 날의 길흉)
 * 태국 점성술 데이터는 thaiData.ts.
 */

export type Element = 'fire' | 'earth' | 'air' | 'water';
export const ELEMENT_KO: Record<Element, string> = { fire: '불', earth: '흙', air: '공기', water: '물' };

/** 열대 황도대 12별자리 (0 = 양자리, 30°씩) */
export const SIGNS: { ko: string; en: string; element: Element; mode: '활동' | '고정' | '변통'; ruler: string; trait: string }[] = [
  { ko: '양자리', en: 'Aries', element: 'fire', mode: '활동', ruler: '화성', trait: '먼저 시작하는 개척자' },
  { ko: '황소자리', en: 'Taurus', element: 'earth', mode: '고정', ruler: '금성', trait: '안정과 감각을 아는 사람' },
  { ko: '쌍둥이자리', en: 'Gemini', element: 'air', mode: '변통', ruler: '수성', trait: '호기심 많은 이야기꾼' },
  { ko: '게자리', en: 'Cancer', element: 'water', mode: '활동', ruler: '달', trait: '곁을 지키는 보호자' },
  { ko: '사자자리', en: 'Leo', element: 'fire', mode: '고정', ruler: '태양', trait: '스스로 빛나는 주인공' },
  { ko: '처녀자리', en: 'Virgo', element: 'earth', mode: '변통', ruler: '수성', trait: '꼼꼼하게 완성하는 사람' },
  { ko: '천칭자리', en: 'Libra', element: 'air', mode: '활동', ruler: '금성', trait: '균형을 찾는 조율가' },
  { ko: '전갈자리', en: 'Scorpio', element: 'water', mode: '고정', ruler: '명왕성 · 화성', trait: '깊이 파고드는 탐구자' },
  { ko: '사수자리', en: 'Sagittarius', element: 'fire', mode: '변통', ruler: '목성', trait: '멀리 보는 모험가' },
  { ko: '염소자리', en: 'Capricorn', element: 'earth', mode: '활동', ruler: '토성', trait: '끝까지 쌓아 올리는 사람' },
  { ko: '물병자리', en: 'Aquarius', element: 'air', mode: '고정', ruler: '천왕성 · 토성', trait: '틀을 바꾸는 발명가' },
  { ko: '물고기자리', en: 'Pisces', element: 'water', mode: '변통', ruler: '해왕성 · 목성', trait: '마음을 읽는 몽상가' },
];

/** 인도 라시(항성 황도대) — 같은 순서, 베딕은 바깥 행성 없이 7행성만 지배 */
export const RASHI: { ko: string; meaning: string; lord: string }[] = [
  { ko: '메샤', meaning: '양', lord: '화성' },
  { ko: '브리샤바', meaning: '황소', lord: '금성' },
  { ko: '미투나', meaning: '쌍둥이', lord: '수성' },
  { ko: '카르카', meaning: '게', lord: '달' },
  { ko: '심하', meaning: '사자', lord: '태양' },
  { ko: '칸야', meaning: '처녀', lord: '수성' },
  { ko: '툴라', meaning: '저울', lord: '금성' },
  { ko: '브리슈치카', meaning: '전갈', lord: '화성' },
  { ko: '다누', meaning: '활', lord: '목성' },
  { ko: '마카라', meaning: '바다염소', lord: '토성' },
  { ko: '쿰바', meaning: '물병', lord: '토성' },
  { ko: '미나', meaning: '물고기', lord: '목성' },
];

/** 27 낙샤트라 (13°20′씩). 지배 행성은 빔쇼타리 순서(케투→금성→태양→달→화성→라후→목성→토성→수성) */
const LORDS = ['케투', '금성', '태양', '달', '화성', '라후', '목성', '토성', '수성'];
const NAK: [string, string][] = [
  ['아슈위니', '빠르게 시작하고 회복하는 힘'], ['바라니', '견디고 품어 내는 힘'], ['크리티카', '날카롭게 가려내는 결단'],
  ['로히니', '풍요와 끌어당기는 매력'], ['므리가쉬라', '찾아 나서는 호기심'], ['아르드라', '폭풍 뒤에 오는 새로움'],
  ['푸나르바수', '다시 돌아오는 회복력'], ['푸쉬야', '돌보고 키우는 힘'], ['아슐레샤', '속을 꿰뚫는 통찰'],
  ['마가', '뿌리와 품격'], ['푸르바 팔구니', '즐거움과 쉼'], ['우타라 팔구니', '약속을 지키는 협력'],
  ['하스타', '손끝의 실행력'], ['치트라', '만들고 꾸미는 감각'], ['스와티', '독립과 유연함'],
  ['비샤카', '목표를 향한 집중'], ['아누라다', '우정과 헌신'], ['졔슈타', '책임지는 리더십'],
  ['물라', '근본을 파고드는 힘'], ['푸르바 아샤다', '꺾이지 않는 기세'], ['우타라 아샤다', '끝내 이기는 끈기'],
  ['슈라바나', '듣고 배우는 힘'], ['다니슈타', '리듬과 풍요'], ['샤타비샤', '치유와 비밀'],
  ['푸르바 바드라파다', '뜨거운 변화'], ['우타라 바드라파다', '깊고 고요한 지혜'], ['레바티', '보살핌과 마무리'],
];
export const NAKSHATRAS = NAK.map(([ko, gift], i) => ({ ko, gift, lord: LORDS[i % 9] }));

/**
 * 타라 발라 — 태어난 낙샤트라에서 오늘 달의 낙샤트라까지 센 수를 9로 나눈 단계.
 * 인도 점성술에서 '오늘이 나에게 어떤 날인지' 볼 때 가장 먼저 보는 지표.
 */
export const TARAS: { ko: string; meaning: string; verdict: 'good' | 'neutral' | 'care'; text: string }[] = [
  { ko: '잔마', meaning: '나의 별', verdict: 'neutral', text: '달이 내가 태어난 자리로 돌아온 날이에요. 몸과 마음의 신호에 귀 기울이면 좋아요.' },
  { ko: '삼파트', meaning: '재물', verdict: 'good', text: '얻고 쌓기 좋은 날이에요. 미뤄 둔 계산이나 거래를 정리해 보세요.' },
  { ko: '비파트', meaning: '장애', verdict: 'care', text: '작은 걸림돌이 생기기 쉬운 날이에요. 중요한 결정은 한 번 더 확인해요.' },
  { ko: '크셰마', meaning: '안녕', verdict: 'good', text: '마음이 편안해지는 날이에요. 몸을 돌보고 생활을 정돈하기 좋아요.' },
  { ko: '프라티야크', meaning: '방해', verdict: 'care', text: '의견이 엇갈리기 쉬운 날이에요. 맞서기보다 돌아가는 길이 빨라요.' },
  { ko: '사다나', meaning: '성취', verdict: 'good', text: '노력이 결과로 이어지는 날이에요. 마무리하고 싶던 일을 끝내 보세요.' },
  { ko: '나이다나', meaning: '가장 조심', verdict: 'care', text: '무리하면 탈이 나기 쉬운 날이에요. 큰 시작보다 쉬어 가는 쪽을 골라요.' },
  { ko: '미트라', meaning: '친구', verdict: 'good', text: '사람의 도움이 들어오는 날이에요. 먼저 연락하면 반가운 답이 와요.' },
  { ko: '파라마 미트라', meaning: '가장 좋은 벗', verdict: 'good', text: '든든한 지원을 받는 날이에요. 부탁하기 어려웠던 일을 꺼내 보세요.' },
];

/** 서양: 태양 별자리와 오늘 달 별자리 사이의 각도(별자리 수 차이 → 애스펙트) */
export const ASPECTS: Record<number, { ko: string; deg: string; verdict: 'good' | 'neutral' | 'care'; text: string }> = {
  0: { ko: '합', deg: '0°', verdict: 'good', text: '달이 내 별자리를 지나요. 감정과 의지가 한 방향이라 나답게 움직이기 좋아요.' },
  1: { ko: '세미섹스타일', deg: '30°', verdict: 'neutral', text: '달이 바로 옆 별자리에 있어요. 큰 변화보다 작은 조정이 어울려요.' },
  2: { ko: '섹스타일', deg: '60°', verdict: 'good', text: '달이 부드러운 각을 이뤄요. 가볍게 던진 제안이 기회로 이어지기 쉬워요.' },
  3: { ko: '스퀘어', deg: '90°', verdict: 'care', text: '달이 긴장된 각을 이뤄요. 마찰이 생겨도 그만큼 성장할 힘이 생겨요.' },
  4: { ko: '트라인', deg: '120°', verdict: 'good', text: '달이 같은 원소 자리에서 흐름을 도와요. 애쓰지 않아도 일이 자연스럽게 풀려요.' },
  5: { ko: '퀸컹스', deg: '150°', verdict: 'neutral', text: '달과 결이 조금 어긋나요. 계획을 유연하게 고치면 편해져요.' },
  6: { ko: '오포지션', deg: '180°', verdict: 'care', text: '달이 맞은편에 있어요. 나와 다른 사람의 입장을 맞추는 데 마음을 써 보세요.' },
};
