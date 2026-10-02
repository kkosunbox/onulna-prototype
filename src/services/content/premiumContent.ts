/**
 * 신규 프리미엄 — 미래 배우자 리포트 · 그 사람의 속마음
 * 기존 사주 심화 엔진(배우자의 별 · 일지 · 대운 · 십성)과 궁합 엔진을 재사용한다.
 */
import { CompatibilityResult, User } from '../../types';
import { BRANCHES, ELEMENT_INFO, Element, STEMS } from '../../data/sajuData';
import { MBTI_INFO } from '../../data/mbtiData';
import {
  BRANCH_GOOD, WEEK, addDays, ageNow, daeun, fortuneOf, isoOf, mainStem, partnerUser, sajuFull, tenGod, tgGroup, themeLove,
} from '../premium/engine';
import { BRANCH_SEAT, STEM_PERSONA, TG, TG_REL } from '../premium/data';
import { mbtiMatches } from './freeContent';
import { parseISO, weekdayOf } from '../../utils/date';
import { clamp } from '../../utils/seed';

const PLACE: Record<Element, string[]> = {
  wood: ['서점·도서관', '공원 산책길', '배움의 자리(강의·스터디)'],
  fire: ['공연·전시장', 'SNS·모임', '친구의 생일 파티'],
  earth: ['지인 소개', '동네 단골 가게', '직장·학교'],
  metal: ['일로 만난 자리', '운동·동호회', '전문가 모임'],
  water: ['여행지', '카페·와인바', '온라인 커뮤니티'],
};
const LOOK: Record<Element, string> = {
  wood: '키가 크고 시원시원한 인상, 단정한 옷차림', fire: '밝은 표정과 생기 있는 눈빛, 말할 때 손짓이 많은 사람',
  earth: '편안하고 듬직한 인상, 웃을 때 눈이 휘는 사람', metal: '또렷한 이목구비와 깔끔한 스타일, 자기 관리가 철저한 사람',
  water: '부드러운 분위기와 차분한 목소리, 깊은 눈매를 가진 사람',
};

export function spouseReport(u: User, today: string) {
  const F = sajuFull(u);
  const spouseEl: Element = F.gE[F.spouseGrp];
  const seat = BRANCH_SEAT[F.ch.day.branch];
  const love = themeLove(u, today);
  const now = ageNow(u, today);
  const dae = daeun(u);
  const daeLove = dae.list.filter(d => d.age + 9 >= now && (tgGroup(tenGod(F.ds, d.p.stem)) === F.spouseGrp || tgGroup(tenGod(F.ds, mainStem(d.p.branch))) === F.spouseGrp)).slice(0, 2);
  const mb = mbtiMatches(u.mbti).best;
  const animals = BRANCH_GOOD(F.ch.year.branch).map(b => BRANCHES[b].animal);
  const ageGap = F.strength === '신강' ? '동갑이거나 연하' : F.strength === '신약' ? '듬직한 연상' : '나이보다 대화가 통하는';
  const spStem = STEMS.findIndex((s, i) => s.element === spouseEl && i % 2 !== F.ds % 2);
  return {
    headline: `${seat[1]}`,
    spouseEl,
    look: LOOK[spouseEl],
    personality: (() => { const sp = STEM_PERSONA[spStem >= 0 ? spStem : 0]; return [sp.core + '을 지녔어요', sp.str[0], sp.str[1]]; })(),
    mbti: mb.map(x => x.type),
    animals,
    ageGap,
    places: PLACE[spouseEl],
    years: love.yrs,
    months: love.ms,
    daeLove,
    first: `${ELEMENT_INFO[spouseEl].ko}(${ELEMENT_INFO[spouseEl].hanja})의 기운을 가진 사람이라, 처음엔 ${spouseEl === 'fire' || spouseEl === 'wood' ? '상대가 먼저 다가올' : '천천히 알아가는'} 가능성이 커요.`,
    advice: [`${MBTI_INFO[u.mbti].watch}만 조심하면 좋은 인연을 놓치지 않아요.`, `${ELEMENT_INFO[spouseEl].color} 계열 소품이 인연운을 끌어온다고 봐요.`, '인연이 강한 해에는 소개 자리를 마다하지 마세요.'],
  };
}

/** 그 사람의 속마음 — 상대(B)가 나(A)를 어떻게 느끼는지 */
export function crushReport(u: User, r: CompatibilityResult, today: string) {
  const p = partnerUser(r);
  const A = sajuFull(u), B = sajuFull(p);
  const tgBA = tenGod(B.ds, A.ds);
  const grp = tgGroup(tgBA);
  const temp = clamp(r.love * 0.6 + (fortuneOf(p, today).love + fortuneOf(u, today).love) * 0.2, 40, 99);
  const FEEL: Record<string, string> = {
    peer: '편하고 말이 잘 통하는 사람. 친구처럼 시작해 연인으로 발전하기 쉬운 마음이에요.',
    output: '함께 있으면 표현하고 싶어지는 사람. 당신 앞에서 자기도 모르게 많이 웃어요.',
    wealth: '현실적으로 끌리는 사람. 함께하면 안정감을 느끼고 오래 곁에 두고 싶어 해요.',
    officer: '조금 긴장되지만 신경 쓰이는 사람. 잘 보이고 싶은 마음이 커요.',
    resource: '기대고 싶은 사람. 당신에게 위로와 조언을 받고 싶어 해요.',
  };
  const { y, m, d } = parseISO(today);
  const days: { iso: string; s: number }[] = [];
  for (let i = 1; i <= 21; i++) { const iso = addDays(today, i); days.push({ iso, s: fortuneOf(u, iso).love + fortuneOf(p, iso).love }); }
  const contact = days.sort((a, b) => b.s - a.s).slice(0, 3).sort((a, b) => a.iso.localeCompare(b.iso));
  const flow = [0, 1, 2].map(k => {
    const mm = ((m - 1 + k) % 12) + 1, yy = y + Math.floor((m - 1 + k) / 12);
    const v = Math.round([3, 10, 17, 24].reduce((s, dd) => s + fortuneOf(p, isoOf(yy, mm, dd)).love + fortuneOf(u, isoOf(yy, mm, dd)).love, 0) / 8);
    return { label: `${mm}월`, v };
  });
  const theirMbti = MBTI_INFO[p.mbti];
  return {
    temp,
    tg: TG[tgBA],
    feel: FEEL[grp],
    relLine: TG_REL[tgBA],
    flow,
    contact: contact.map(c => ({ iso: c.iso, label: `${parseISO(c.iso).m}월 ${parseISO(c.iso).d}일 (${WEEK[weekdayOf(c.iso)]})` })),
    dos: [p.mbti[2] === 'F' ? '진심이 담긴 짧은 메시지가 마음을 움직여요' : '구체적인 약속 제안이 더 잘 통해요', p.mbti[0] === 'E' ? '여럿이 함께하는 자리에서 자연스럽게 다가가세요' : '둘이 조용히 대화할 시간을 만들어 보세요'],
    donts: [`${theirMbti.nickname} 성향은 '${theirMbti.watch}' 경향이 있어 재촉하면 멀어질 수 있어요`, '답장 속도로 마음을 판단하지 마세요'],
    oneLine: temp >= 85 ? '이미 마음이 꽤 열려 있어요. 작은 용기면 충분해요.' : temp >= 72 ? '호감은 있지만 확신을 기다리는 중이에요.' : '아직은 탐색 단계예요. 천천히 거리를 좁혀 보세요.',
    today: d,
  };
}

