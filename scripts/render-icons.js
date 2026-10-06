/**
 * 운Pick 앱 아이콘 · 적응형 아이콘 · 스플래시 · 파비콘 생성 (assets/)
 * 사용: npm run icons
 * 로고는 글꼴이 아니라 직접 그린 단선 레터링(획 두께 11, 둥근 끝). src/components/BrandMark.tsx 와 같은 패스.
 * 시그니처: '운'의 ㅜ 기둥 자리에 매달린 작은 노란 부적(웃는 얼굴 · 붉은 도장) — 오늘 뽑은(Pick) 행운.
 */
const { Resvg } = require('@resvg/resvg-js');
const fs = require('fs');
const path = require('path');
const NM = path.resolve(__dirname, '../node_modules/@expo-google-fonts/hahmlet');
const FONTS = [NM + '/700Bold/Hahmlet_700Bold.ttf'];
const NAVY = '#22293F', CREAM = '#F4EDDF', RED = '#B5432E', MUTE = '#857C6E', YEL = '#EDC861', YEL2 = '#D9AE3F';
const st = c => `fill="none" stroke="${c}" stroke-width="11" stroke-linecap="round" stroke-linejoin="round"`;
/** 운 (0..100) */
const un = (c = NAVY) => `
  <ellipse cx="50" cy="24.5" rx="20" ry="15" ${st(c)}/>
  <path d="M26 74 V86.5 H83" ${st(c)}/>
  <path d="M 40.24 56.85 L 59.06 54.2 L 62.36 77.67 L 43.54 80.32 Z" fill="${YEL}" stroke="${YEL2}" stroke-width="1.4" stroke-linejoin="round"/>
  <circle cx="50.45" cy="61.17" r="2.7" fill="${RED}"/>
  <circle cx="47.8" cy="68.21" r="1.55" fill="${NAVY}"/><circle cx="54.93" cy="67.2" r="1.55" fill="${NAVY}"/>
  <path d="M 48.55 72.14 Q 52.39 75.03 55.29 71.19" fill="none" stroke="${NAVY}" stroke-width="1.5" stroke-linecap="round"/>
  <circle cx="46.07" cy="71.68" r="1.7" fill="${RED}" opacity="0.32"/><circle cx="57.55" cy="70.07" r="1.7" fill="${RED}" opacity="0.32"/>
  <path d="M14 52.5 H86" ${st(c)}/>`;
/** Pick (운 뒤 x=110부터) */
const pick = (c = NAVY) => `
  <path d="M0 86.5 V13 H15 A18.5 18.5 0 0 1 15 50 H0" ${st(c)}/>
  <path d="M55 44 V86.5" ${st(c)}/><circle cx="55" cy="22" r="7" fill="${c}"/>
  <path d="M110 52 A18.5 18.5 0 1 0 110 80" ${st(c)}/>
  <path d="M128 13 V86.5 M128 67 L151 44 M135 61 L153 86.5" ${st(c)}/>`;
const word = c => `<g>${un(c)}</g><g transform="translate(110 0)">${pick(c)}</g>`; // 폭 0..269
const svg = (body, vb = '0 0 100 100') => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}">${body}</svg>`;
const png = (s, out, w) => fs.writeFileSync(out, new Resvg(s, { fitTo: { mode: 'width', value: w }, font: { fontFiles: FONTS, loadSystemFonts: false, defaultFontFamily: 'Hahmlet' } }).render().asPng());
const out = process.argv[2] || path.resolve(__dirname, '../assets');
png(svg(`<rect width="100" height="100" fill="${CREAM}"/><g transform="translate(50 50) scale(0.6) translate(-50 -50)">${un()}</g>`), `${out}/icon.png`, 1024);
png(svg(`<g transform="translate(50 50) scale(0.44) translate(-50 -50)">${un()}</g>`), `${out}/adaptive-icon.png`, 1024);
png(svg(`<g transform="translate(200 175) scale(0.62) translate(-134.5 -50)">${word(NAVY)}</g>
  <text x="200" y="250" font-family="Hahmlet" font-weight="700" font-size="16" fill="${MUTE}" text-anchor="middle">오늘의 운, 하나만 Pick!</text>`, '0 0 400 400'), `${out}/splash-icon.png`, 1200);
png(svg(`<rect width="100" height="100" rx="18" fill="${CREAM}"/><g transform="translate(50 50) scale(0.68) translate(-50 -50)">${un()}</g>`), `${out}/favicon.png`, 196);
png(svg(`<rect x="-14" y="-14" width="297" height="128" fill="${CREAM}"/>${word(NAVY)}`, '-14 -14 297 128'), path.resolve(__dirname, '../docs/wordmark.png'), 1200);
console.log('ok');
