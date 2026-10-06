/**
 * WHO AM I? 앱 아이콘 · 적응형 아이콘 · 스플래시 · 파비콘 생성 (assets/)
 * 사용: npm run icons   (src/components/BrandMark.tsx 의 LogoMark 와 같은 도형)
 * 마크: 직접 그린 물음표 + 점 자리의 붉은 낙관(我, 나 아)
 */
const { Resvg } = require('@resvg/resvg-js');
const fs = require('fs');
const path = require('path');
const NM = path.resolve(__dirname, '../node_modules');
const FONTS = [
  NM + '/@expo-google-fonts/hahmlet/800ExtraBold/Hahmlet_800ExtraBold.ttf',
  NM + '/@expo-google-fonts/hahmlet/700Bold/Hahmlet_700Bold.ttf',
  '/System/Library/Fonts/Supplemental/AppleMyungjo.ttf', // 我 (한자) 대비
];
const NAVY = '#22293F', CREAM = '#F4EDDF', RED = '#B5432E', MUTE = '#857C6E';

/** 물음표 마크 — 100x100 좌표. fg: 물음표 색 */
const mark = (fg = CREAM) => `
  <path d="M33 37 C33 23 42 15 52 15 C63 15 71 22 71 33 C71 42 65 46 59 50 C54 53 51 56 51 62 V64" fill="none" stroke="${fg}" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>
  <g transform="rotate(-6 51 81)">
    <rect x="41" y="71" width="20" height="20" rx="2" fill="${RED}"/>
    <rect x="43" y="73" width="16" height="16" rx="1" fill="none" stroke="${CREAM}" stroke-opacity="0.7" stroke-width="0.7"/>
    <text x="51" y="86.3" font-family="AppleMyungjo" font-weight="700" font-size="12.5" fill="${CREAM}" text-anchor="middle">我</text>
  </g>`;
const svg = (body, vb = '0 0 100 100') => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}">${body}</svg>`;
function png(s, out, w) {
  const r = new Resvg(s, { fitTo: { mode: 'width', value: w }, font: { fontFiles: FONTS, loadSystemFonts: false, defaultFontFamily: 'Hahmlet' } });
  fs.writeFileSync(out, r.render().asPng());
}
const out = process.argv[2] || path.resolve(__dirname, '../assets');
png(svg(`<rect width="100" height="100" fill="${NAVY}"/><g transform="translate(50 52) scale(0.78) translate(-52 -53)">${mark()}</g>`), `${out}/icon.png`, 1024);
png(svg(`<g transform="translate(50 52) scale(0.58) translate(-52 -53)">${mark()}</g>`), `${out}/adaptive-icon.png`, 1024);
png(svg(`<g transform="translate(200 135) scale(1.25) translate(-52 -53)">${mark(NAVY)}</g>
  <text x="200" y="282" font-family="Hahmlet" font-weight="800" font-size="46" fill="${NAVY}" text-anchor="middle" letter-spacing="1">WHO AM I?</text>
  <text x="200" y="314" font-family="Hahmlet" font-weight="700" font-size="15" fill="${MUTE}" text-anchor="middle">나는 어떤 사람일까</text>`, '0 0 400 400'), `${out}/splash-icon.png`, 1200);
png(svg(`<rect width="100" height="100" rx="18" fill="${NAVY}"/><g transform="translate(50 52) scale(0.82) translate(-52 -53)">${mark()}</g>`), `${out}/favicon.png`, 196);
console.log('ok');
