/**
 * 운픽 앱 아이콘 · 적응형 아이콘 · 스플래시 · 파비콘 생성 (assets/)
 * 사용: npm run icons
 * 아이콘은 운알이(src/components/Mascot.tsx 'classic' · 기본 눈), 워드마크는 둥근 막대 레터링 '운픽' + ㅇ 자리의 운알이
 * (src/components/BrandMark.tsx 와 같은 패스).
 */
const { Resvg } = require('@resvg/resvg-js');
const fs = require('fs');
const path = require('path');
const FONTS = [path.resolve(__dirname, '../assets/fonts/Pretendard-Bold.otf')];
const INK = '#191C22', SKY = '#CFEBFF', SKY2 = '#8CCBFF', MUTE = '#7D8490';

/** 운알이 (0..100) — Mascot.tsx 와 같은 몸 · 메시 그라데이션 · 눈 */
const BODY = 'M47 12 C66 9 82 20 86 38 C90 52 92 66 84 78 C75 90 57 93 41 90 C24 87 12 76 11 59 C10 43 15 27 27 18 C33 14 40 12 47 12 Z';
const SPOTS = [[30, 70, 34, '#B9DDFF'], [64, 58, 30, '#FFF0A3'], [74, 34, 26, '#D3F3C2'], [36, 28, 22, '#FFFFFF']];
const eye = (x, y, r) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff" stroke="#E3E8F0" stroke-width="0.8"/>
  <circle cx="${x + 1.5}" cy="${y - 1}" r="${r * 0.55}" fill="#111318"/><circle cx="${x + 1.5 + r * 0.2}" cy="${y - 1 - r * 0.22}" r="${r * 0.14}" fill="#fff"/>`;
const mascot = () => `
  <defs>
    <clipPath id="b"><path d="${BODY}"/></clipPath>
    ${SPOTS.map(([cx, cy, r, c], i) => `<radialGradient id="g${i}" cx="${cx}" cy="${cy}" r="${r}" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="${c}" stop-opacity="0.95"/><stop offset="1" stop-color="${c}" stop-opacity="0"/></radialGradient>`).join('')}
  </defs>
  <g clip-path="url(#b)"><rect width="100" height="100" fill="#E4F2FF"/>${SPOTS.map(([cx, cy, r], i) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#g${i})"/>`).join('')}</g>
  <path d="${BODY}" fill="none" stroke="#fff" stroke-opacity="0.75" stroke-width="1.6"/>
  <path d="M22 34 C24 26 29 21 35 19" stroke="#fff" stroke-opacity="0.9" stroke-width="3.2" stroke-linecap="round" fill="none"/>
  <circle cx="20" cy="41" r="1.8" fill="#fff" fill-opacity="0.85"/>
  ${eye(36, 46, 9)}${eye(58, 42, 9.5)}`;

/** 운픽 워드마크 — BrandMark.tsx 와 같은 좌표: 둥근 막대 + ㅇ 자리의 운알이 (viewBox 18 -4 232 136) */
const BARS = [[25, 83, 102, 19, 8], [66, 92, 19, 18, 5], [25, 83, 20, 45, 8], [25, 110, 102, 18, 8],
  [138, 28, 74, 19, 8], [150, 40, 18, 30, 0], [182, 40, 18, 30, 0], [138, 64, 74, 19, 8],
  [222, 22, 21, 61, 8], [138, 89, 105, 19, 8], [222, 89, 21, 44, 8]];
const word = (c = INK) => BARS.map(([x, y, w, h, r]) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${c}"/>`).join('')
  + `<g transform="translate(30 -2) scale(0.92)">${mascot()}</g>`;
const svg = (body, vb = '0 0 100 100') => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}">${body}</svg>`;
const png = (s, out, w) => fs.writeFileSync(out, new Resvg(s, { fitTo: { mode: 'width', value: w }, font: { fontFiles: FONTS, loadSystemFonts: false, defaultFontFamily: 'Pretendard' } }).render().asPng());
const out = process.argv[2] || path.resolve(__dirname, '../assets');
const skyBg = `<defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${SKY2}"/><stop offset="1" stop-color="${SKY}"/></linearGradient></defs><rect width="100" height="100" fill="url(#sky)"/>`;

png(svg(`${skyBg}<g transform="translate(50 52) scale(0.72) translate(-50 -50)">${mascot()}</g>`), `${out}/icon.png`, 1024);
png(svg(`<g transform="translate(50 52) scale(0.52) translate(-50 -50)">${mascot()}</g>`), `${out}/adaptive-icon.png`, 1024);
// 스플래시: 확정 로고 이미지(assets/brand/logo.png)를 그대로 넣는다 — 다시 그리지 않는다
const LOGO_B64 = fs.readFileSync(path.resolve(__dirname, '../assets/brand/logo.png')).toString('base64');
png(svg(`<defs><clipPath id="lc"><rect x="60" y="120" width="280" height="143.2" rx="20"/></clipPath></defs>
  <image href="data:image/png;base64,${LOGO_B64}" x="60" y="120" width="280" height="143.2" clip-path="url(#lc)"/>
  <text x="200" y="300" font-family="Pretendard" font-weight="700" font-size="16" fill="${MUTE}" text-anchor="middle">오늘, 나에게 딱 맞는 운</text>`, '0 0 400 400'), `${out}/splash-icon.png`, 1200);
png(svg(`${skyBg.replace('<rect', '<rect rx="22"')}<g transform="translate(50 52) scale(0.78) translate(-50 -50)">${mascot()}</g>`), `${out}/favicon.png`, 196);
// docs/wordmark.png 는 확정 로고 원본을 그대로 복사해 둔다
fs.copyFileSync(path.resolve(__dirname, '../assets/brand/logo.png'), path.resolve(__dirname, '../docs/wordmark.png'));
console.log('ok');
