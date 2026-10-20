/**
 * /fortune/astro (관점 키는 호환을 위해 'thai' 유지)
 * 점성술 세 갈래를 각자 계산해 '참고 지표'로 나란히 보여주고, 겹치는 신호로 오늘을 읽는다.
 *  - 서양: 생일의 태양 별자리(열대 황도대) × 오늘 달이 지나는 별자리 → 애스펙트
 *  - 인도(베딕): 항성 황도대의 태양 라시 · 태어난 달의 낙샤트라 × 오늘 달의 낙샤트라 → 타라 발라
 *  - 태국: 태어난 요일의 수호 행성 × 오늘 요일 행성 → 우호 · 행운색 · 주의색
 * 해·달 위치는 근사식(utils/astroCalc). 태국 우호표는 앱 자체 규칙이며 전문가 검수 데이터로 교체 예정.
 */
import { AnalysisResult, AstroReport, AstroSystem, KeywordTag, User } from '../../types';
import { THAI_DAYS, THAI_FRIENDS, ThaiDay, WEEKDAY_TO_THAI } from '../../data/thaiData';
import { ASPECTS, ELEMENT_KO, NAKSHATRAS, RASHI, SIGNS, TARAS } from '../../data/astroData';
import { ayanamsa, julianDay, moonLongitude, nakshatraOf, signOf, sunLongitude } from '../../utils/astroCalc';
import { weekdayOf } from '../../utils/date';

export function birthThaiDay(birthDate: string, birthTime: string | null): ThaiDay {
  const base = WEEKDAY_TO_THAI[weekdayOf(birthDate)];
  if (base === 'wedDay' && birthTime && Number(birthTime.split(':')[0]) >= 18) return 'wedNight';
  return base;
}

const VERDICT_KO = { good: '좋음', neutral: '보통', care: '주의' } as const;
export const verdictKo = (v: AstroSystem['verdict']) => VERDICT_KO[v];

/* ---------- 서양 ---------- */
function western(user: User, date: string): AstroSystem {
  const sun = signOf(sunLongitude(julianDay(user.birthDate, user.birthTime)));
  const moonToday = signOf(moonLongitude(julianDay(date, '12:00')));
  const dist = (moonToday - sun + 12) % 12;
  const asp = ASPECTS[Math.min(dist, 12 - dist)];
  const S = SIGNS[sun], M = SIGNS[moonToday];
  return {
    key: 'western', name: '서양 점성술', basis: '열대 황도대 · 태양과 달',
    verdict: asp.verdict,
    rows: [
      ['태양 별자리', `${S.ko} · ${S.trait}`],
      ['원소 · 성질', `${ELEMENT_KO[S.element]} · ${S.mode}궁 · 지배 행성 ${S.ruler}`],
      ['오늘의 달', `${M.ko}(${ELEMENT_KO[M.element]})`],
      ['오늘의 각', `${asp.ko} ${asp.deg} · ${VERDICT_KO[asp.verdict]}`],
    ],
    reading: asp.text,
  };
}

/* ---------- 인도(베딕) ---------- */
function vedic(user: User, date: string): AstroSystem {
  const jdB = julianDay(user.birthDate, user.birthTime);
  const jdT = julianDay(date, '12:00');
  const rashi = signOf(sunLongitude(jdB) - ayanamsa(jdB));
  const moonRashi = signOf(moonLongitude(jdB) - ayanamsa(jdB));
  const nb = nakshatraOf(moonLongitude(jdB) - ayanamsa(jdB));
  const nt = nakshatraOf(moonLongitude(jdT) - ayanamsa(jdT));
  const count = ((nt - nb + 27) % 27) + 1; // 태어난 낙샤트라를 1로 센다
  const tara = TARAS[(count - 1) % 9];
  const R = RASHI[rashi], MR = RASHI[moonRashi], B = NAKSHATRAS[nb], T = NAKSHATRAS[nt];
  return {
    key: 'vedic', name: '인도 점성술', basis: '항성 황도대 · 달의 집 27수',
    verdict: tara.verdict,
    rows: [
      ['태양 라시', `${R.ko}(${R.meaning}) · 지배 행성 ${R.lord}`],
      ['달 라시', `${MR.ko}(${MR.meaning}) · 마음의 바탕`],
      ['탄생 낙샤트라', `${B.ko} · ${B.gift} (지배 ${B.lord})`],
      ['오늘 달의 집', `${T.ko} · ${count}번째 → ${tara.ko}(${tara.meaning}) · ${VERDICT_KO[tara.verdict]}`],
    ],
    reading: tara.text,
  };
}

/* ---------- 태국 ---------- */
function thai(user: User, date: string): AstroSystem {
  const mine = birthThaiDay(user.birthDate, user.birthTime);
  const todayKey = WEEKDAY_TO_THAI[weekdayOf(date)];
  const me = THAI_DAYS[mine], today = THAI_DAYS[todayKey];
  const own = todayKey === mine || (mine === 'wedNight' && todayKey === 'wedDay');
  let verdict: AstroSystem['verdict'], rel: string, reading: string;
  if (own) { verdict = 'good'; rel = '나의 요일'; reading = `태어난 요일이라 ${me.planetKo}의 기운이 가장 밝아요. 평소 모습 그대로가 가장 매력적이에요.`; }
  else if (THAI_FRIENDS[mine].includes(todayKey)) { verdict = 'good'; rel = '우호'; reading = `오늘의 ${today.planetKo}이 나의 ${me.planetKo}과 사이가 좋아요. 뜻밖의 도움이 들어오기 쉬워요.`; }
  else if (today.color === me.cautionColor) { verdict = 'care'; rel = '주의색의 날'; reading = `오늘의 색 ${today.color}은 나에게 주의 색이에요. 한 박자 늦게 움직이면 흐름을 지킬 수 있어요.`; }
  else { verdict = 'neutral'; rel = '중립'; reading = `${today.planetKo}의 기운이 새 자극을 줘요. 익숙한 틀에서 조금 벗어나 보면 재미있는 전환점이 생겨요.`; }
  return {
    key: 'thai', name: '태국 점성술', basis: '태어난 요일 · 수호 행성',
    verdict,
    rows: [
      ['태어난 요일', `${me.label} · 수호 행성 ${me.planetKo}`],
      ['타고난 성향', me.trait],
      ['행운색 · 주의색', `${me.color} · ${me.cautionColor}`],
      ['오늘의 행성', `${today.planetKo}(${today.label}) · ${rel}`],
    ],
    reading,
  };
}

/** 판정별 분야 가중치 — 서양(달=감정)은 연애·관계, 인도(타라)는 재물·일, 태국(요일)은 관계·연애 */
const WEIGHT: Record<AstroSystem['key'], Record<'love' | 'money' | 'work' | 'relationship', number>> = {
  western: { love: 3, money: 1, work: 1, relationship: 2 },
  vedic: { love: 1, money: 3, work: 3, relationship: 1 },
  thai: { love: 2, money: 1, work: 1, relationship: 3 },
};
const SIGN = { good: 1, neutral: 0, care: -1 } as const;
const clamp = (n: number) => Math.max(-10, Math.min(10, n));

export function getAstroReport(user: User, date: string): AstroReport {
  const systems = [western(user, date), vedic(user, date), thai(user, date)];
  return {
    systems,
    goodCount: systems.filter(x => x.verdict === 'good').length,
    careCount: systems.filter(x => x.verdict === 'care').length,
    approx: !user.birthTime,
  };
}

export function getThaiAnalysis(user: User, date: string): AnalysisResult {
  const astro = getAstroReport(user, date);
  const [w, v, t] = astro.systems;
  const { goodCount: g, careCount: c } = astro;

  let headline: string, tags: KeywordTag[];
  if (g === 3) { headline = '세 점성술이 모두 좋은 신호를 보내는 날'; tags = ['opportunity', 'expression']; }
  else if (g === 2 && c === 0) { headline = '세 점성술 중 두 곳이 힘을 실어 주는 날'; tags = ['newMeeting', 'harmony']; }
  else if (g === 2) { headline = '좋은 신호가 더 많지만 한 곳은 신중하라는 날'; tags = ['opportunity', 'caution']; }
  else if (c >= 2) { headline = '세 점성술이 입을 모아 천천히 가라는 날'; tags = ['caution', 'rest']; }
  else if (g === 1 && c === 1) { headline = '신호가 엇갈려 균형이 중요한 날'; tags = ['change', 'intuition']; }
  else if (g === 1) { headline = '한 곳의 좋은 신호가 길을 열어 주는 날'; tags = ['change', 'opportunity']; }
  else if (c === 1) { headline = '작은 주의 신호만 챙기면 무난한 날'; tags = ['caution', 'intuition']; }
  else { headline = '큰 기복 없이 잔잔하게 흘러가는 날'; tags = ['rest', 'intuition']; }

  const bias = { love: 0, money: 0, work: 0, relationship: 0 };
  for (const x of astro.systems) for (const k of Object.keys(bias) as (keyof typeof bias)[]) bias[k] += SIGN[x.verdict] * WEIGHT[x.key][k];
  for (const k of Object.keys(bias) as (keyof typeof bias)[]) bias[k] = clamp(bias[k]);

  const sun = w.rows[0][1].split(' · ')[0];
  return {
    source: 'thai',
    title: '점성술',
    emoji: '星',
    headline,
    details: [
      { label: '서양 · 태양 별자리', value: `${sun} · 오늘의 달과 ${w.rows[3][1]}` },
      { label: '인도 · 탄생 낙샤트라', value: v.rows[2][1] },
      { label: '인도 · 오늘의 타라', value: v.rows[3][1].split(' → ')[1] },
      { label: '태국 · 태어난 요일', value: t.rows[0][1] },
      { label: '태국 · 오늘의 행성', value: t.rows[3][1] },
      { label: '세 점성술 일치도', value: `좋음 ${g} · 보통 ${3 - g - c} · 주의 ${c}` },
    ],
    description: `서양: ${w.reading}\n인도: ${v.reading}\n태국: ${t.reading}`,
    tags,
    scoreBias: bias,
    astro,
  };
}

/** 타고난 점성 지표(서양 태양 별자리 · 인도 달 라시 · 탄생 낙샤트라 · 태국 요일) */
export function natalAstro(u: { birthDate: string; birthTime: string | null }) {
  const jd = julianDay(u.birthDate, u.birthTime);
  const sid = (lon: number) => lon - ayanamsa(jd);
  return {
    west: signOf(sunLongitude(jd)),
    moonRashi: signOf(sid(moonLongitude(jd))),
    nakshatra: nakshatraOf(sid(moonLongitude(jd))),
    thai: birthThaiDay(u.birthDate, u.birthTime),
  };
}
