/**
 * 네 관점 풀이 엔진 — 사주 · 점성술(서양·인도·태국) · MBTI · 혈액형을 같은 질문에 함께 답하게 한다.
 * 모든 탭(홈 종합운 · 분야 상세 · 주간/월간/연간 · 궁합)이 이 파일의 결과를 쓴다.
 *  - 각 관점은 '근거(그 체계의 지표)'와 '그래서 무엇을'을 한 문장에 담는다.
 *  - 네 관점의 방향(올림·유지·신중)을 세어 결론을 낸다. 한 관점만으로 단정하지 않는다.
 */
import { AnalysisResult, AstroSystem, BloodType, MBTI, PartnerInput, User } from '../../types';
import { SourceKey } from '../../theme/colors';
import { ELEMENT_INFO, Element, STEMS, TEN_GOD_TEXT, TenGodGroup } from '../../data/sajuData';
import { MBTI_INFO } from '../../data/mbtiData';
import { BLOOD_INFO } from '../../data/bloodData';
import { ELEMENT_KO, NAKSHATRAS, RASHI, SIGNS, TARAS } from '../../data/astroData';
import { THAI_DAYS, THAI_FRIENDS, WEEKDAY_TO_THAI } from '../../data/thaiData';
import { buildChart, dayPillar, relation } from './sajuService';
import { natalAstro, verdictKo } from './thaiAstrologyService';
import { ayanamsa, julianDay, jupiterLongitude, moonLongitude, nakshatraOf, signOf, sunLongitude } from '../../utils/astroCalc';
import { parseISO, toISODate, weekdayOf } from '../../utils/date';

export type Cat = 'love' | 'money' | 'work' | 'relationship';
export type Tone = 'up' | 'flat' | 'down';
export interface LensLine { source: SourceKey; label: string; basis: string; tone: Tone; text: string }
export interface Insight { lenses: LensLine[]; up: number; down: number; verdict: string; advice: string }

const CAT_KO: Record<Cat, string> = { love: '연애운', money: '재물운', work: '직장운', relationship: '관계운' };
const LABEL: Record<SourceKey, string> = { saju: '사주', thai: '점성술', mbti: 'MBTI', blood: '혈액형' };
/** 받침에 맞춘 조사 */
const josa = (w: string, a: string, b: string) => { const c = w.charCodeAt(w.length - 1) - 0xac00; return c >= 0 && c <= 11171 && c % 28 ? a : b; };

/* ================= 사주 — 십성 관계 × 분야 ================= */
const SAJU_CAT: Record<TenGodGroup, Record<Cat, string>> = {
  peer: {
    love: '내 주장이 강해지는 비겁의 기운이라, 고집 대결보다 같은 편이 되어 주는 말이 마음을 열어요.',
    money: '비겁은 재물을 나누는 기운이에요. 빌려주기·공동 결제는 오늘 한 번 더 생각해요.',
    work: '동료와 힘을 합치는 기운이 강해요. 혼자 끌어안기보다 나눠 맡으면 속도가 붙어요.',
    relationship: '친구·동료 운이 강한 날이에요. 모임에 얼굴을 비추면 든든한 편이 생겨요.',
  },
  resource: {
    love: '보살핌을 받는 인성의 기운이에요. 받는 다정함을 편하게 누리면 관계가 깊어져요.',
    money: '돈보다 배움이 남는 기운이에요. 공부·자격·건강에 쓰는 돈은 투자가 돼요.',
    work: '배우고 정리하는 힘이 좋아요. 문서·계약·검토 일을 오늘 끝내 두세요.',
    relationship: '윗사람·선배의 조언이 힘이 되는 날이에요. 먼저 물어보면 길이 보여요.',
  },
  output: {
    love: '표현의 기운인 식상이 들어와요. 마음을 말로 꺼내기에 가장 좋은 날이에요.',
    money: '재능이 돈으로 이어지는 흐름이에요. 팔 수 있는 아이디어를 적어 두세요.',
    work: '아이디어·발표·기획에 힘이 실려요. 생각을 밖으로 꺼낼수록 인정받아요.',
    relationship: '말이 많아지는 날이에요. 농담의 선만 지키면 분위기를 이끌어요.',
  },
  wealth: {
    love: '끌림이 현실적인 만남으로 이어지기 쉬운 재성의 날이에요. 구체적인 약속을 잡아 보세요.',
    money: '재물을 다루는 기운이 가장 강해요. 정산·협상·가격 비교에 유리해요.',
    work: '결과를 거두는 날이에요. 말보다 숫자로 성과를 보여 주세요.',
    relationship: '실속 있는 관계에 집중하는 날이에요. 도움을 주고받는 사람을 챙겨요.',
  },
  officer: {
    love: '책임의 기운인 관성이 들어와요. 가벼운 말보다 진지한 약속이 무게를 가져요.',
    money: '규칙을 지키면 손해가 없는 날이에요. 정해 둔 예산 밖 지출은 미뤄요.',
    work: '평가와 책임이 커지는 날이에요. 절차대로 처리하면 신뢰로 돌아와요.',
    relationship: '예의와 선이 관계를 지켜 주는 날이에요. 반 박자 신중하게 말해요.',
  },
};
const toneOf = (n: number): Tone => (n >= 3 ? 'up' : n <= -1 ? 'down' : 'flat');
const SAJU_BIAS: Record<TenGodGroup, Record<Cat, number>> = {
  peer: { love: 0, money: -2, work: 3, relationship: 6 },
  resource: { love: 2, money: 0, work: 5, relationship: 2 },
  output: { love: 7, money: 1, work: 2, relationship: 4 },
  wealth: { love: 3, money: 8, work: 3, relationship: -1 },
  officer: { love: -2, money: -1, work: 6, relationship: -2 },
};
const meElement = (u: { birthDate: string; birthTime: string | null }): Element => STEMS[buildChart(u.birthDate, u.birthTime).day.stem].element;

function sajuLine(u: User, date: string, cat: Cat): LensLine {
  const me = meElement(u);
  const rel = relation(me, STEMS[dayPillar(date).stem].element);
  return { source: 'saju', label: LABEL.saju, basis: `일진과 ${TEN_GOD_TEXT[rel].name}`, tone: toneOf(SAJU_BIAS[rel][cat]), text: SAJU_CAT[rel][cat] };
}

/* ================= 점성술 — 분야별로 가장 잘 맞는 갈래 ================= */
const ASTRO_FOR: Record<Cat, AstroSystem['key']> = { love: 'western', money: 'vedic', work: 'vedic', relationship: 'thai' };
const ASTRO_CAT: Record<Cat, Record<AstroSystem['verdict'], string>> = {
  love: { good: '감정의 흐름이 순해서 마음이 잘 전해져요.', neutral: '감정이 잔잔해요. 큰 고백보다 작은 표현이 어울려요.', care: '감정이 부딪히기 쉬워요. 서운한 말은 하루 묵혀요.' },
  money: { good: '얻고 쌓는 흐름이라 계획한 재정 일을 진행하기 좋아요.', neutral: '돈의 흐름이 평이해요. 고정비 점검 정도가 알맞아요.', care: '걸림돌이 생기기 쉬워요. 큰 결제와 계약은 미뤄요.' },
  work: { good: '노력이 결과로 이어지는 흐름이라 마무리에 힘이 실려요.', neutral: '평소 속도로 차근차근이 가장 좋아요.', care: '방해가 생기기 쉬워요. 중요한 보고는 한 번 더 확인해요.' },
  relationship: { good: '사람의 도움이 들어오기 쉬운 흐름이에요. 먼저 손을 내밀어 보세요.', neutral: '사람 사이가 무난해요. 먼저 안부를 건네면 좋아요.', care: '말 한마디가 크게 들릴 수 있는 날이에요. 부드럽게 돌려 말해요.' },
};
const ASTRO_TONE = { good: 'up', neutral: 'flat', care: 'down' } as const;

function astroLine(a: AnalysisResult, cat: Cat): LensLine | null {
  const sys = a.astro?.systems.find(x => x.key === ASTRO_FOR[cat]);
  if (!sys) return null;
  const ind = sys.key === 'western' ? sys.rows[3][1].split(' · ')[0] : sys.key === 'vedic' ? sys.rows[3][1].split(' → ')[1]?.split(' · ')[0] : sys.rows[3][1].split(' · ')[0];
  const short = sys.name.replace(' 점성술', '');
  const all = a.astro!.systems.map(x => `${x.name.replace(' 점성술', '')} ${verdictKo(x.verdict)}`).join(' · ');
  return { source: 'thai', label: LABEL.thai, basis: `${all} · ${short} ${ind}`, tone: ASTRO_TONE[sys.verdict], text: ASTRO_CAT[cat][sys.verdict] };
}

/* ================= MBTI — 분야별 성향 축 ================= */
function mbtiCatText(t: MBTI, cat: Cat) {
  const [ei, ns, tf, jp] = t.split('');
  if (cat === 'love') return tf === 'F' ? '상대 감정을 먼저 알아채는 F의 강점이 빛나요. 내 마음도 같은 온도로 말해 주세요.' : '해결책을 찾는 T답게, 오늘은 조언보다 "그랬구나" 한마디가 더 통해요.';
  if (cat === 'money') return jp === 'J' ? '계획형 J라 예산을 세우면 지키는 힘이 커요. 오늘 쓸 돈을 미리 정해 두세요.' : '즉흥형 P는 기회를 잘 잡지만 지출도 즉흥적이에요. 결제 전 하루 장바구니에 두기.';
  if (cat === 'work') return ns === 'N' ? `큰 그림을 보는 N의 직관이 기획에 힘을 줘요. 세부는 체크리스트로 보완해요.` : `현실 감각이 좋은 S라 실행과 마무리에 강해요. 오늘은 눈앞의 일을 끝내는 데 집중해요.`;
  return ei === 'E' ? '사람에게서 힘을 얻는 E라 약속을 잡을수록 기운이 올라요.' : '혼자 충전하는 I라 넓은 모임보다 가까운 한 사람과의 대화가 깊게 남아요.';
}
function mbtiLine(u: User, a: AnalysisResult, cat: Cat): LensLine {
  const aligned = !a.headline.startsWith('익숙하지 않은');
  const axis = { love: 'T/F', money: 'J/P', work: 'N/S', relationship: 'E/I' }[cat];
  return { source: 'mbti', label: LABEL.mbti, basis: `${u.mbti} · ${axis} 축`, tone: aligned ? 'up' : 'flat', text: mbtiCatText(u.mbti, cat) };
}

/* ================= 혈액형 — 기질 × 분야 ================= */
const BLOOD_CAT: Record<BloodType, Record<Cat, string>> = {
  A: { love: '배려가 깊은 만큼 속마음을 숨기기 쉬워요. 바라는 걸 한 문장으로 말해 보세요.', money: '꼼꼼함이 재정에 강점이에요. 가계부·구독 정리가 바로 효과를 내요.', work: '계획대로 해내는 힘이 커요. 완벽보다 완료를 목표로.', relationship: '분위기를 살피는 섬세함이 장점이에요. 부탁 하나쯤은 해도 괜찮아요.' },
  B: { love: '솔직한 표현이 매력이에요. 말투만 한 스푼 부드럽게.', money: '꽂히면 과감해지는 편이라 충동 지출을 조심해요.', work: '몰입력이 좋아요. 좋아하는 일부터 손대면 속도가 붙어요.', relationship: '자유로운 리듬을 존중해 주는 사람과 잘 맞아요.' },
  O: { love: '먼저 다가가는 대범함이 통해요. 리드하되 상대 속도도 맞춰요.', money: '큰 목표를 세우면 돈도 따라와요. 세부 관리는 미루지 말기.', work: '판을 까는 리더십이 빛나요. 먼저 제안해 보세요.', relationship: '사람을 끄는 힘이 커요. 챙겨주던 사람에게 오늘은 챙김 받기.' },
  AB: { love: '거리감이 매력이지만 오해도 생겨요. 관심은 행동으로 보여 주세요.', money: '합리적 판단이 강점이에요. 비교해 보고 사면 손해가 없어요.', work: '남다른 관점이 무기예요. 아이디어를 정리해 공유해요.', relationship: '혼자만의 시간이 필요해요. 거리를 두던 사람에게 한 발만 다가가기.' },
};
function bloodLine(u: User, cat: Cat): LensLine {
  const b = BLOOD_INFO[u.bloodType].bias[cat];
  return { source: 'blood', label: LABEL.blood, basis: `${u.bloodType}형 · ${BLOOD_INFO[u.bloodType].trait}`, tone: b >= 3 ? 'up' : b <= 0 ? 'down' : 'flat', text: BLOOD_CAT[u.bloodType][cat] };
}

/* ================= 결론 ================= */
function conclude(lenses: LensLine[], topic: string, when = '오늘은'): Insight {
  const up = lenses.filter(l => l.tone === 'up').length;
  const down = lenses.filter(l => l.tone === 'down').length;
  const n = lenses.length;
  const verdict = up >= 3 ? `네 관점 중 ${up}곳이 ${topic}${josa(topic, '을', '를')} 밀어줘요. ${when} 한 걸음 먼저 움직여도 좋아요.`
    : down >= 2 ? `${down}곳이 신중하라고 해요. ${when} 지키는 쪽이 이득이에요.`
    : up > down ? `${n}곳 중 ${up}곳이 힘을 실어 줘요${down ? `, ${down}곳은 속도를 늦추라고 해요` : ''}. 좋은 쪽을 살리되 서두르지만 않으면 돼요.`
    : `관점마다 신호가 엇갈려요. 무리하지 않고 평소 리듬을 지키는 게 가장 좋아요.`;
  const lead = [...lenses].sort((a, b) => (a.tone === b.tone ? 0 : a.tone === 'up' ? -1 : b.tone === 'up' ? 1 : a.tone === 'flat' ? -1 : 1))[0];
  return { lenses, up, down, verdict, advice: lead.text };
}

/** 오늘 · 분야 하나를 네 관점으로 */
export function dayInsight(u: User, date: string, analyses: Record<SourceKey, AnalysisResult>, cat: Cat): Insight {
  // 방향(올림·유지·신중)은 실제 점수에 들어간 값(scoreBias)으로 정해 '관점별 영향' 막대와 어긋나지 않게 한다
  const toneBy = (src: SourceKey): Tone => { const v = analyses[src].scoreBias[cat]; return v >= 3 ? 'up' : v < 0 ? 'down' : 'flat'; };
  const astro = astroLine(analyses.thai, cat);
  if (astro) astro.text = ASTRO_CAT[cat][({ up: 'good', flat: 'neutral', down: 'care' } as const)[toneBy('thai')]];
  const lenses = [sajuLine(u, date, cat), astro, mbtiLine(u, analyses.mbti, cat), bloodLine(u, cat)]
    .filter(Boolean).map(l => ({ ...(l as LensLine), tone: toneBy((l as LensLine).source) }));
  return conclude(lenses, CAT_KO[cat]);
}

/** 오늘의 종합 이야기 — 네 관점의 근거를 한 단락씩, 마지막에 결론 */
export function dayStory(u: User, date: string, analyses: Record<SourceKey, AnalysisResult>, scores: Record<Cat, number>, common: string[]): string {
  const { saju, thai, mbti, blood } = analyses;
  const rel = relation(meElement(u), STEMS[dayPillar(date).stem].element);
  const astro = thai.astro;
  const cats: Cat[] = ['love', 'money', 'work', 'relationship'];
  const best = cats.reduce((a, b) => (scores[a] >= scores[b] ? a : b));
  const worst = cats.reduce((a, b) => (scores[a] <= scores[b] ? a : b));
  const bi = dayInsight(u, date, analyses, best);
  const paras = [
    `사주로 보면 오늘 일진은 나에게 ${TEN_GOD_TEXT[rel].name}이에요. ${saju.description}`,
    astro ? `점성술은 세 갈래 중 좋음 ${astro.goodCount}곳, 주의 ${astro.careCount}곳이라 '${thai.headline}'으로 읽어요. ${astro.systems.map(x => `${x.name.replace(' 점성술', '')}(${verdictKo(x.verdict)})는 ${x.reading}`).join(' ')}` : `점성술로는 '${thai.headline}'이라는 흐름이에요.`,
    `MBTI로는 ${u.mbti}(${MBTI_INFO[u.mbti].nickname})의 하루예요. ${mbti.description}`,
    `혈액형으로는 ${u.bloodType}형의 ${BLOOD_INFO[u.bloodType].trait} 기질이 오늘의 열쇠예요. ${blood.headline}`,
    (common.length ? `네 관점에서 공통으로 '${common.join("', '")}'${josa(common[common.length - 1], '이', '가')} 겹쳐요. ` : '') +
      `그래서 오늘은 ${CAT_KO[best]}이 가장 강해요(네 관점 중 ${bi.up}곳이 밀어줌). ${bi.advice} 반대로 ${CAT_KO[worst]}은 한 박자 쉬어 가면 좋아요.`,
  ];
  return paras.join('\n\n');
}

/* ================= 기간(주·월·년) ================= */
/** 그해 목성이 머무는 별자리 — 상반기(2월)와 하반기(10월)가 다르면 둘 다 */
function yearJupiter(y: number): number[] {
  const a = signOf(jupiterLongitude(julianDay(`${y}-02-15`, '12:00')));
  const b = signOf(jupiterLongitude(julianDay(`${y}-10-15`, '12:00')));
  return a === b ? [a] : [a, b];
}
const SOLAR_HOUSE = ['나 자신과 새 출발', '돈과 가치', '배움·소통·이동', '집과 가족', '연애·즐거움·창작', '일상·건강·업무', '관계와 파트너', '깊은 유대와 공동 재정', '여행·공부·확장', '커리어와 명예', '친구·모임·희망', '휴식과 내면 정리'];
const addDays = (iso: string, n: number) => { const { y, m, d } = parseISO(iso); return toISODate(new Date(y, m - 1, d + n)); };
const REL_PERIOD: Record<TenGodGroup, string> = {
  peer: '함께할 사람과 경쟁자가 같이 늘어나는 흐름', resource: '배우고 채우며 기반을 다지는 흐름', output: '표현하고 드러내 성과를 만드는 흐름',
  wealth: '결과와 재물을 거두는 흐름', officer: '책임과 평가가 커지는 흐름',
};

export function periodLenses(u: User, today: string, period: 'weekly' | 'monthly' | 'yearly'): LensLine[] {
  const me = meElement(u);
  const nat = natalAstro(u);
  const { y, m } = parseISO(today);
  const monday = addDays(today, -((weekdayOf(today) + 6) % 7));
  const days = period === 'weekly' ? Array.from({ length: 7 }, (_, i) => addDays(monday, i))
    : period === 'monthly' ? Array.from({ length: new Date(y, m, 0).getDate() }, (_, i) => toISODate(new Date(y, m - 1, i + 1)))
    : [];
  const unit = period === 'weekly' ? '이번 주' : period === 'monthly' ? '이달' : '올해';

  // 사주: 주·월은 일진 관계의 분포, 연은 세운(그해 천간)
  let saju: LensLine;
  if (period === 'yearly') {
    const ys = STEMS[((y - 4) % 10 + 10) % 10];
    const rel = relation(me, ys.element);
    saju = { source: 'saju', label: LABEL.saju, basis: `세운 ${ys.ko}${ELEMENT_INFO[ys.element].ko} · ${TEN_GOD_TEXT[rel].name}`, tone: rel === 'officer' ? 'flat' : 'up', text: `${y}년은 나에게 ${TEN_GOD_TEXT[rel].name}의 해, ${REL_PERIOD[rel]}이에요.` };
  } else {
    const cnt: Record<string, number> = {};
    days.forEach(d => { const r = relation(me, STEMS[dayPillar(d).stem].element); cnt[r] = (cnt[r] ?? 0) + 1; });
    const top = (Object.keys(cnt) as TenGodGroup[]).sort((a, b) => cnt[b] - cnt[a])[0];
    const mp = period === 'monthly' ? buildChart(toISODate(new Date(y, m - 1, 15)), null).month : null;
    const mrel = mp ? relation(me, STEMS[mp.stem].element) : null;
    saju = {
      source: 'saju', label: LABEL.saju,
      basis: mrel ? `월건 ${STEMS[mp!.stem].ko}${ELEMENT_INFO[STEMS[mp!.stem].element].ko} · ${TEN_GOD_TEXT[mrel].name}` : `일진 ${days.length}일 중 ${TEN_GOD_TEXT[top].name} ${cnt[top]}일`,
      tone: (mrel ?? top) === 'officer' ? 'flat' : 'up',
      text: mrel ? `이달의 기운(월건)은 나에게 ${TEN_GOD_TEXT[mrel].name}, ${REL_PERIOD[mrel]}이에요. 일진으로는 ${TEN_GOD_TEXT[top].name}의 날이 ${cnt[top]}일로 가장 많아요.`
        : `${unit} 일진 7일 중 ${TEN_GOD_TEXT[top].name}의 날이 ${cnt[top]}일이에요. ${REL_PERIOD[top]}이 주를 이끌어요.`,
    };
  }

  // 점성술: 주·월은 태양이 지나는 영역(서양 솔라 하우스) + 좋은 타라 날(인도) + 우호 요일(태국), 연은 목성
  let astro: LensLine;
  if (period === 'yearly') {
    const J = yearJupiter(y);
    const houses = J.map(j => (j - nat.west + 12) % 12);
    const jdM = julianDay(`${y}-07-01`, '12:00');
    const vh = ((signOf(jupiterLongitude(jdM) - ayanamsa(jdM)) - nat.moonRashi + 12) % 12) + 1;
    const goodGuru = [2, 5, 7, 9, 11].includes(vh);
    const west = J.length === 1
      ? `확장의 별 목성이 올해 ${SIGNS[J[0]].ko}에 머물며 내 별자리(${SIGNS[nat.west].ko})의 ${houses[0] + 1}번째 영역 '${SOLAR_HOUSE[houses[0]]}'을 넓혀 줘요.`
      : `확장의 별 목성이 상반기엔 ${SIGNS[J[0]].ko}(${houses[0] + 1}번째 영역 '${SOLAR_HOUSE[houses[0]]}'), 하반기엔 ${SIGNS[J[1]].ko}(${houses[1] + 1}번째 영역 '${SOLAR_HOUSE[houses[1]]}')를 지나며 관심사가 옮겨 가요.`;
    astro = { source: 'thai', label: LABEL.thai, basis: `목성 ${J.map(j => SIGNS[j].ko).join(' → ')}`, tone: goodGuru ? 'up' : 'flat',
      text: `서양: ${west} 인도: 목성이 달 라시(${RASHI[nat.moonRashi].ko})에서 ${vh}번째 집이라 ${goodGuru ? '도움을 받는 해(길한 자리)' : '스스로 쌓아 가는 해'}예요.` };
  } else {
    const mid = days[Math.floor(days.length / 2)];
    const sunNow = signOf(sunLongitude(julianDay(mid, '12:00')));
    const house = (sunNow - nat.west + 12) % 12;
    const goodTara = days.filter(d => { const jd = julianDay(d, '12:00'); const nt = nakshatraOf(moonLongitude(jd) - ayanamsa(jd)); return TARAS[((nt - nat.nakshatra + 27) % 27) % 9].verdict === 'good'; });
    const friend = days.filter(d => THAI_FRIENDS[nat.thai].includes(WEEKDAY_TO_THAI[weekdayOf(d)]));
    const fmt = (d: string) => period === 'weekly' ? `${['일', '월', '화', '수', '목', '금', '토'][weekdayOf(d)]}` : `${parseISO(d).d}일`;
    astro = { source: 'thai', label: LABEL.thai, basis: `태양 ${SIGNS[sunNow].ko} · 좋은 타라 ${goodTara.length}일`, tone: goodTara.length / days.length >= 0.5 ? 'up' : 'flat',
      text: `서양: 태양이 내 별자리에서 ${house + 1}번째 영역 '${SOLAR_HOUSE[house]}'을 비춰 ${unit}의 관심사가 돼요. 인도: 좋은 타라의 날이 ${days.length}일 중 ${goodTara.length}일(${goodTara.slice(0, 4).map(fmt).join('·')}${goodTara.length > 4 ? ' 등' : ''}). 태국: 수호 행성 ${THAI_DAYS[nat.thai].planetKo}과 사이좋은 요일은 ${[...new Set(friend.map(d => ['일', '월', '화', '수', '목', '금', '토'][weekdayOf(d)]))].join('·') || '없음'}요일이에요.` };
  }

  // MBTI: 기간마다 강조되는 축 → 내 성향과의 만남
  const info = MBTI_INFO[u.mbti];
  const mbti: LensLine = { source: 'mbti', label: LABEL.mbti, basis: `${u.mbti} · ${info.nickname}`, tone: 'up',
    text: period === 'weekly' ? `${info.strength}${josa(info.strength, '이', '가')} 주 중반에 가장 빛나요. 주말엔 '${info.watch}'를 돌아보며 다음 주를 정리해요.`
      : period === 'monthly' ? `이달은 ${info.strength}${josa(info.strength, '으로', '로')} 한 가지 목표를 끝까지 밀어 보세요. '${info.watch}'만 조심하면 성과로 남아요.`
      : `올해의 성장 포인트는 '${info.watch}'를 다루는 법이에요. ${info.strength}${josa(info.strength, '은', '는')} 이미 충분하니 반대편 성향을 빌려 써 보세요.` };

  // 혈액형: 기간의 리듬
  const B = BLOOD_INFO[u.bloodType];
  const blood: LensLine = { source: 'blood', label: LABEL.blood, basis: `${u.bloodType}형 · ${B.trait}`, tone: 'flat',
    text: `${B.trait}답게 ${{ A: '계획을 먼저 세우면', B: '꽂히는 일에 몰입하면', O: '사람들을 먼저 모으면', AB: '혼자 정리할 시간을 두면' }[u.bloodType]} ${unit}의 흐름을 내 것으로 만들 수 있어요. ${{ A: '중간 점검 날짜를 미리 정해 두면 마음이 편해요.', B: '흥미가 식기 전에 결과물 하나를 남겨 두세요.', O: '혼자 다 짊어지지 말고 역할을 나눠요.', AB: '정리한 생각을 한 번은 밖으로 공유해요.' }[u.bloodType]}` };

  return [saju, astro, mbti, blood];
}

/* ================= 궁합 — 점성술 ================= */
const ELEMENT_FRIEND: Record<string, string[]> = { fire: ['fire', 'air'], air: ['air', 'fire'], earth: ['earth', 'water'], water: ['water', 'earth'] };
export function compatAstro(u: User, p: PartnerInput) {
  const a = natalAstro(u), b = natalAstro(p);
  const A = SIGNS[a.west], B = SIGNS[b.west];
  const west = ELEMENT_FRIEND[A.element].includes(B.element) ? 3 : 0;
  const d = ((b.moonRashi - a.moonRashi + 12) % 12) + 1; // 라시 쿠타: 달 라시 사이 거리
  const vedic = [2, 12, 6, 8].includes(d) ? -2 : 3;
  const thai = THAI_FRIENDS[a.thai].includes(b.thai) || THAI_FRIENDS[b.thai].includes(a.thai) ? 3 : a.thai === b.thai ? 2 : 0;
  const score = west + vedic + thai;
  const text = `서양: ${A.ko}(${ELEMENT_KO[A.element]})와 ${B.ko}(${ELEMENT_KO[B.element]})는 ${west ? '서로 북돋는 원소라 함께 있을 때 편해요' : '원소가 달라 서로에게 없는 면을 채워 줘요'}. ` +
    `인도: 달 라시가 ${d}번째 자리라 ${vedic > 0 ? '마음의 결이 잘 맞는 조합이에요' : '감정 표현 방식이 달라 대화로 맞춰 가야 해요'}. ` +
    `태국: ${THAI_DAYS[a.thai].planetKo}${josa(THAI_DAYS[a.thai].planetKo, '과', '와')} ${THAI_DAYS[b.thai].planetKo}${josa(THAI_DAYS[b.thai].planetKo, '은', '는')} ${thai >= 3 ? '우호 행성이에요' : thai ? '같은 행성이라 리듬이 비슷해요' : '중립이라 각자의 리듬을 존중하면 좋아요'}.`;
  return { score, title: `星 점성술 · ${A.ko} × ${B.ko}`, text, nak: [NAKSHATRAS[a.nakshatra].ko, NAKSHATRAS[b.nakshatra].ko] };
}

/** 오늘 전체를 네 관점으로 — 운세 탭 '오늘' */
export function dayLenses(u: User, date: string, analyses: Record<SourceKey, AnalysisResult>): LensLine[] {
  const sum = (a: AnalysisResult) => Object.values(a.scoreBias).reduce((x, y) => x + y, 0);
  const tone = (a: AnalysisResult): Tone => (sum(a) >= 8 ? 'up' : sum(a) <= 0 ? 'down' : 'flat');
  const { saju, thai, mbti, blood } = analyses;
  const rel = relation(meElement(u), STEMS[dayPillar(date).stem].element);
  return [
    { source: 'saju', label: LABEL.saju, basis: `일진 ${saju.details[2]?.value.split(' · ')[0] ?? ''} · ${TEN_GOD_TEXT[rel].name}`, tone: tone(saju), text: `${saju.headline}. ${saju.description}` },
    { source: 'thai', label: LABEL.thai, basis: thai.astro ? `좋음 ${thai.astro.goodCount} · 주의 ${thai.astro.careCount} (서양·인도·태국)` : '태국', tone: tone(thai), text: `${thai.headline}. ${thai.astro ? thai.astro.systems.map(x => `${x.name.replace(' 점성술', '')}: ${x.reading}`).join(' ') : thai.description}` },
    { source: 'mbti', label: LABEL.mbti, basis: `${u.mbti} · ${mbti.details[2]?.value ?? ''}`, tone: tone(mbti), text: mbti.description },
    { source: 'blood', label: LABEL.blood, basis: `${u.bloodType}형 · ${BLOOD_INFO[u.bloodType].trait}`, tone: tone(blood), text: blood.description },
  ];
}

/** 네 줄의 방향을 세어 한 문장 결론 */
export function lensVerdict(lenses: LensLine[], topic: string, when?: string) {
  return conclude(lenses, topic, when).verdict;
}

/** 유료 테마(연애 · 재물 · 직업 · 신년)에 덧붙이는 서양 · 인도 점성 풀이 */
export function astroViews(u: { birthDate: string; birthTime: string | null }, year?: number) {
  const n = natalAstro(u);
  const W = SIGNS[n.west], MR = RASHI[n.moonRashi], N = NAKSHATRAS[n.nakshatra];
  const jdB = julianDay(u.birthDate, u.birthTime);
  const SR = RASHI[signOf(sunLongitude(jdB) - ayanamsa(jdB))];
  const friends = SIGNS.filter(x => ELEMENT_FRIEND[W.element].includes(x.element) && x.ko !== W.ko).map(x => x.ko).slice(0, 3).join(' · ');
  const seventh = RASHI[(n.moonRashi + 6) % 12];
  const second = SIGNS[(n.west + 1) % 12], tenth = SIGNS[(n.west + 9) % 12];
  let yearText = '';
  if (year) {
    const J = yearJupiter(year);
    yearText = `서양: 목성이 ${J.map((j, i) => `${J.length > 1 ? (i ? '하반기 ' : '상반기 ') : ''}${SIGNS[j].ko}(${((j - n.west + 12) % 12) + 1}번째 영역 '${SOLAR_HOUSE[(j - n.west + 12) % 12]}')`).join(', ')}에 머물며 그 분야를 넓혀 줘요.`;
  }
  return {
    love: `서양: ${W.ko}(${ELEMENT_KO[W.element]})는 ${friends}와 마음이 잘 통해요. 인도: 달 라시 ${MR.ko}의 7번째 자리 ${seventh.ko}(${seventh.meaning})가 인연의 자리예요.`,
    money: `서양: 재물의 2번째 영역이 ${second.ko}라 '${second.trait}'의 방식으로 모을 때 잘 맞아요. 인도: 탄생 낙샤트라 ${N.ko}의 '${N.gift}'가 재물을 만드는 힘이에요.`,
    career: `서양: 커리어의 10번째 영역이 ${tenth.ko}라 '${tenth.trait}'처럼 일할 때 인정받아요. 인도: 태양 라시 ${SR.ko}의 지배 행성 ${SR.lord}이 일의 결을 정해요.`,
    year: yearText,
  };
}
