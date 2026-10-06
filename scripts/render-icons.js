/**
 * 운Pick 앱 아이콘 · 적응형 아이콘 · 스플래시 · 파비콘 · 워드마크 생성
 * 사용: npm run icons
 * 로고 패스는 src/components/brandPaths.json 하나를 앱(BrandMark.tsx)과 함께 쓴다.
 * '운'은 직접 그린 명조 레터링, ㅜ 기둥 자리에는 매듭 끈에 매달린 부적(웃는 눈 · 붉은 도장 · 위아래 붉은 두 줄).
 */
const { Resvg } = require('@resvg/resvg-js');
const fs = require('fs');
const path = require('path');
const B = require('../src/components/brandPaths.json');
const FONTS = [path.resolve(__dirname, '../node_modules/@expo-google-fonts/hahmlet/700Bold/Hahmlet_700Bold.ttf')];
const NAVY = '#22293F', CREAM = '#F4EDDF', RED = '#B5432E', MUTE = '#857C6E';
const T = B.talisman;
/** 운 + 부적 (0..100) */
const un = (c = NAVY) => `
  <path d="${B.un.o}" fill="${c}" fill-rule="evenodd"/>
  <path d="${B.un.nieun}" fill="${c}"/>
  <path d="M50 53 V60.4" stroke="${RED}" stroke-width="1.1" stroke-linecap="round"/><circle cx="50" cy="57.2" r="1.5" fill="${RED}"/>
  <path d="${T.shadow}" fill="${NAVY}" opacity="0.16"/>
  <path d="${T.paper}" fill="#EFCB63"/>
  <path d="${T.rules}" fill="${RED}" opacity="0.85"/>
  <circle cx="${T.seal[0]}" cy="${T.seal[1]}" r="3.1" fill="${RED}"/>
  <path d="${T.eyes}" fill="none" stroke="${NAVY}" stroke-width="1.25" stroke-linecap="round"/>
  <path d="${T.smile}" fill="none" stroke="${NAVY}" stroke-width="1.2" stroke-linecap="round"/>
  <circle cx="${T.chL[0]}" cy="${T.chL[1]}" r="1.7" fill="#E07C6A" opacity="0.45"/><circle cx="${T.chR[0]}" cy="${T.chR[1]}" r="1.7" fill="#E07C6A" opacity="0.45"/>
  <path d="${B.un.bar}" fill="${c}"/>`;
const word = c => `${un(c)}<path d="${B.pick}" fill="${c}"/>`; // x 9.5..294.5
const svg = (body, vb = '0 0 100 100') => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}">${body}</svg>`;
const png = (s, out, w) => fs.writeFileSync(out, new Resvg(s, { fitTo: { mode: 'width', value: w }, font: { fontFiles: FONTS, loadSystemFonts: false, defaultFontFamily: 'Hahmlet' } }).render().asPng());
const out = process.argv[2] || path.resolve(__dirname, '../assets');
png(svg(`<rect width="100" height="100" fill="${CREAM}"/><g transform="translate(50 50) scale(0.68) translate(-50 -50)">${un()}</g>`), `${out}/icon.png`, 1024);
png(svg(`<g transform="translate(50 50) scale(0.5) translate(-50 -50)">${un()}</g>`), `${out}/adaptive-icon.png`, 1024);
png(svg(`<g transform="translate(200 170) scale(0.92) translate(-152 -50)">${word(NAVY)}</g>
  <text x="200" y="250" font-family="Hahmlet" font-weight="700" font-size="16" fill="${MUTE}" text-anchor="middle">오늘의 운, 하나만 Pick!</text>`, '0 0 400 400'), `${out}/splash-icon.png`, 1200);
png(svg(`<rect width="100" height="100" rx="18" fill="${CREAM}"/><g transform="translate(50 50) scale(0.78) translate(-50 -50)">${un()}</g>`), `${out}/favicon.png`, 196);
png(svg(`<rect x="-6" y="-6" width="312" height="112" fill="${CREAM}"/>${word(NAVY)}`, '-6 -6 312 112'), path.resolve(__dirname, '../docs/wordmark.png'), 1400);
console.log('ok');
