/**
 * 운Pick 앱 아이콘 · 적응형 아이콘 · 스플래시 · 파비콘 생성 (assets/)
 * 사용: npm run icons
 * 로고는 글꼴이 아니라 직접 그린 단선 레터링(획 두께 11, 둥근 끝). src/components/BrandMark.tsx 와 같은 패스.
 * 시그니처: '운'의 ㅜ 기둥 자리에 붉은 매듭 끈으로 매달린 노란 부적(위아래 붉은 두 줄 · 도장 · 웃는 눈 · 볼 · 그림자).
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
  <path d="M50 54 V61.6" stroke="${RED}" stroke-width="1.1" stroke-linecap="round"/><circle cx="50" cy="59.6" r="1.45" fill="${RED}"/>
  <path d="M 42.73 63.82 L 60.6 61.63 L 63.17 82.57 L 45.3 84.76 Z" fill="${NAVY}" opacity="0.16"/>
  <path d="M 41.37 62.58 L 59.24 60.38 L 61.8 81.23 L 43.93 83.42 Z" fill="#EFCB63" stroke="#EFCB63" stroke-width="1.6" stroke-linejoin="round"/>
  <path d="M 43.23 64.57 L 57.92 62.76 L 57.99 63.36 L 43.3 65.16 Z M 43.37 65.76 L 58.06 63.95 L 58.11 64.3 L 43.42 66.11 Z M 45.13 80.05 L 59.82 78.25 L 59.86 78.59 L 45.17 80.4 Z M 45.24 80.94 L 59.93 79.14 L 60.0 79.74 L 45.31 81.54 Z" fill="${RED}" opacity="0.85"/>
  <circle cx="51.15" cy="68.33" r="2.6" fill="${RED}"/>
  <path d="M 47.03 73.37 Q 48.3 71.4 50.01 73.0 M 53.38 72.59 Q 54.65 70.62 56.36 72.22" fill="none" stroke="${NAVY}" stroke-width="1.2" stroke-linecap="round"/>
  <path d="M 49.59 75.37 Q 52.27 77.46 54.36 74.79" fill="none" stroke="${NAVY}" stroke-width="1.15" stroke-linecap="round"/>
  <circle cx="46.3" cy="75.67" r="1.5" fill="#E07C6A" opacity="0.5"/><circle cx="57.62" cy="74.29" r="1.5" fill="#E07C6A" opacity="0.5"/>
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
