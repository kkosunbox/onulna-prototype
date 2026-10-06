/**
 * 운Pick 앱 아이콘 · 적응형 아이콘 · 스플래시 · 파비콘 생성 (assets/)
 * 사용: npm run icons   (src/components/BrandMark.tsx 의 LogoMark 와 같은 도형)
 * 마크: 명조 '운' + 느낌표(막대 + 점 자리의 붉은 낙관). "오늘의 운, 하나만 Pick!"
 */
const { Resvg } = require('@resvg/resvg-js');
const fs = require('fs');
const path = require('path');
const NM = path.resolve(__dirname, '../node_modules/@expo-google-fonts/hahmlet');
const FONTS = [NM + '/800ExtraBold/Hahmlet_800ExtraBold.ttf', NM + '/700Bold/Hahmlet_700Bold.ttf'];
const NAVY = '#22293F', CREAM = '#F4EDDF', RED = '#B5432E', MUTE = '#857C6E';

/** 운! 마크 — 100x100 좌표. fg: 글자 색 */
const mark = (fg = NAVY) => `
  <text x="40" y="67" font-family="Hahmlet" font-weight="800" font-size="47" fill="${fg}" text-anchor="middle" letter-spacing="-1">운</text>
  <rect x="68.5" y="29" width="7.4" height="28" rx="3.7" fill="${fg}"/>
  <g transform="rotate(-8 72.2 67.5)"><rect x="67.2" y="62.5" width="10" height="10" rx="1.2" fill="${RED}"/></g>`;
const svg = (body, vb = '0 0 100 100') => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}">${body}</svg>`;
function png(s, out, w) {
  const r = new Resvg(s, { fitTo: { mode: 'width', value: w }, font: { fontFiles: FONTS, loadSystemFonts: false, defaultFontFamily: 'Hahmlet' } });
  fs.writeFileSync(out, r.render().asPng());
}
const out = process.argv[2] || path.resolve(__dirname, '../assets');
png(svg(`<rect width="100" height="100" fill="${CREAM}"/><g transform="translate(50 50) scale(1.02) translate(-47.5 -50)">${mark()}</g>`), `${out}/icon.png`, 1024);
png(svg(`<g transform="translate(50 50) scale(0.72) translate(-47.5 -50)">${mark()}</g>`), `${out}/adaptive-icon.png`, 1024);
png(svg(`<g transform="translate(200 150) scale(1.5) translate(-47.5 -50)">${mark()}</g>
  <text x="200" y="282" font-family="Hahmlet" font-weight="800" font-size="46" fill="${NAVY}" text-anchor="middle" letter-spacing="-0.5">운Pick</text>
  <text x="200" y="314" font-family="Hahmlet" font-weight="700" font-size="15" fill="${MUTE}" text-anchor="middle">오늘의 운, 하나만 Pick!</text>`, '0 0 400 400'), `${out}/splash-icon.png`, 1200);
png(svg(`<rect width="100" height="100" rx="18" fill="${CREAM}"/><g transform="translate(50 50) scale(1.05) translate(-47.5 -50)">${mark()}</g>`), `${out}/favicon.png`, 196);
module.exports = { mark };
console.log('ok');
