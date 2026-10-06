/**
 * 한장 앱 아이콘 · 적응형 아이콘 · 스플래시 · 파비콘 생성 (assets/)
 * 사용: npm run icons   (src/components/BrandMark.tsx 의 LogoMark 와 같은 도형)
 */
const { Resvg } = require('@resvg/resvg-js');
const fs = require('fs');
const path = require('path');
const NM = path.resolve(__dirname, '../node_modules');
const FONT = NM + '/@expo-google-fonts/hahmlet/800ExtraBold/Hahmlet_800ExtraBold.ttf';
const FONT7 = NM + '/@expo-google-fonts/hahmlet/700Bold/Hahmlet_700Bold.ttf';
const NAVY = '#22293F', CREAM = '#F4EDDF', CREAM2 = '#E4D9C3', RED = '#B5432E', MUTE = '#857C6E';
function fibers(n, x0, y0, w, h, seed = 11) {
  let s = seed; const r = () => (s = (s * 16807) % 2147483647) / 2147483647;
  return Array.from({ length: n }, () => { const x = x0 + r() * w, y = y0 + r() * h, l = 3 + r() * 9, a = r() * 70 - 35, o = 0.05 + r() * 0.06;
    return `<rect x="${x}" y="${y}" width="${l}" height="0.35" fill="#8A6F45" opacity="${o}" transform="rotate(${a} ${x} ${y})"/>`; }).join('');
}
/** 일력 한 장 — 100x100 좌표, 종이 22~78 x 16~86 */
const mark = ({ fiber = true } = {}) => `
  <rect x="25.5" y="19.5" width="56" height="70" rx="2.5" fill="#C9BCA2"/>
  <path d="M22 16 H78 V75 L67 86 H22 Z" fill="${CREAM}"/>
  ${fiber ? fibers(26, 22, 30, 54, 50) : ''}
  <path d="M78 75 L67 86 V78 Q67 75 70 75 Z" fill="${CREAM2}"/>
  <path d="M22 16 H78 V30 H22 Z" fill="${RED}"/>
  <circle cx="38" cy="23" r="2.2" fill="${NAVY}"/><circle cx="62" cy="23" r="2.2" fill="${NAVY}"/>
  <line x1="24" y1="33" x2="76" y2="33" stroke="${MUTE}" stroke-width="0.6" stroke-dasharray="1.6 1.4"/>
  <text x="50" y="72" font-family="Hahmlet" font-weight="800" font-size="34" fill="${NAVY}" text-anchor="middle">한</text>`;
const svg = (body, vb = '0 0 100 100') => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}">${body}</svg>`;
function png(s, out, w) {
  const r = new Resvg(s, { fitTo: { mode: 'width', value: w }, font: { fontFiles: [FONT, FONT7], loadSystemFonts: false, defaultFontFamily: 'Hahmlet' } });
  fs.writeFileSync(out, r.render().asPng());
}
const out = process.argv[2] || path.resolve(__dirname, '../assets');
// 앱 아이콘: 남색 바탕 + 일력 (iOS가 모서리를 깎으므로 꽉 찬 사각형)
png(svg(`<rect width="100" height="100" fill="${NAVY}"/><g transform="translate(50 51) scale(0.8) translate(-50 -51)">${mark()}</g>`), `${out}/icon.png`, 1024);
// 안드로이드 적응형 전경(안전 영역 안쪽)
png(svg(`<g transform="translate(50 51) scale(0.6) translate(-50 -51)">${mark()}</g>`), `${out}/adaptive-icon.png`, 1024);
// 스플래시(배경은 app.json의 한지색)
png(svg(`<g transform="translate(200 140) scale(1.25) translate(-50 -51)">${mark({ fiber: false })}</g>
  <text x="200" y="285" font-family="Hahmlet" font-weight="800" font-size="54" fill="${NAVY}" text-anchor="middle" letter-spacing="-1">한장</text>
  <text x="200" y="316" font-family="Hahmlet" font-weight="700" font-size="15" fill="${MUTE}" text-anchor="middle">매일 한 장, 나를 읽다</text>`, '0 0 400 400'), `${out}/splash-icon.png`, 1200);
png(svg(`<rect width="100" height="100" rx="18" fill="${NAVY}"/><g transform="translate(50 51) scale(0.8) translate(-50 -51)">${mark({ fiber: false })}</g>`), `${out}/favicon.png`, 196);
// 마크 단독(앱 안 로고용 SVG 소스 확인)
console.log('ok');
