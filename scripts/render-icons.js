/**
 * 운Pick 앱 아이콘 · 적응형 아이콘 · 스플래시 · 파비콘 생성 (assets/)
 * 사용: npm run icons
 * 로고는 글꼴이 아니라 직접 그린 단선 레터링(획 두께 11, 둥근 끝). src/components/BrandMark.tsx 와 같은 패스.
 * 시그니처: '운'의 ㅜ 기둥 자리에 놓인 붉은 낙관 사각형 — 오늘 뽑은(Pick) 그 한 점.
 */
const { Resvg } = require('@resvg/resvg-js');
const fs = require('fs');
const path = require('path');
const NM = path.resolve(__dirname, '../node_modules/@expo-google-fonts/hahmlet');
const FONTS = [NM + '/700Bold/Hahmlet_700Bold.ttf'];
const NAVY = '#22293F', CREAM = '#F4EDDF', RED = '#B5432E', MUTE = '#857C6E';
const st = c => `fill="none" stroke="${c}" stroke-width="11" stroke-linecap="round" stroke-linejoin="round"`;
/** 운 (0..100) */
const un = (c = NAVY) => `
  <ellipse cx="50" cy="24.5" rx="20" ry="15" ${st(c)}/>
  <path d="M14 52.5 H86" ${st(c)}/>
  <path d="M41.4 58.6 L56.4 56.5 L58.6 71.4 L43.6 73.5 Z" fill="${RED}" stroke="${RED}" stroke-width="1.6" stroke-linejoin="round"/>
  <path d="M26 74 V86.5 H83" ${st(c)}/>`;
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
