/**
 * 운Pick 앱 아이콘 · 적응형 아이콘 · 스플래시 · 파비콘 생성 (assets/)
 * 사용: npm run icons
 * 아이콘은 운알이(src/components/Mascot.tsx 'classic' · 기본 눈), 워드마크는 굵은 레터링 '운Pick'(물결 ㄴ · 파란 k 사선)
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
  ${eye(36, 46, 9)}${eye(58, 42, 9.5)}`;

const BLUE = '#5B9BF5';
const st = (c, cap = 'round') => `fill="none" stroke="${c}" stroke-width="18" stroke-linecap="${cap}" stroke-linejoin="round"`;
/** 운Pick 워드마크 — BrandMark.tsx 와 같은 패스 (폭 -8..336, 높이 -10..128) */
const word = (c = INK) => `
  <circle cx="48" cy="24" r="18" ${st(c)}/>
  <rect x="0" y="54" width="96" height="18" fill="${c}"/>
  <rect x="39" y="64" width="18" height="30" fill="${c}"/>
  <path d="M13 64 V88 C13 102 30 104 46 97 C60 91 72 90 80 98 C85 103 86 112 86 124" ${st(c, 'butt')}/>
  <path d="M117 104 V38 H138 A19 19 0 0 1 138 76 H126" ${st(c)}/>
  <path d="M187 60 V104" ${st(c)}/><circle cx="187" cy="32" r="11" fill="${c}"/>
  <path d="M254 62 A22 22 0 1 0 254 98" ${st(c)}/>
  <path d="M284 30 V104 M291 78 L314 104" ${st(c)}/>
  <path d="M292 72 L318 46" ${st(BLUE)}/>`;
const svg = (body, vb = '0 0 100 100') => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}">${body}</svg>`;
const png = (s, out, w) => fs.writeFileSync(out, new Resvg(s, { fitTo: { mode: 'width', value: w }, font: { fontFiles: FONTS, loadSystemFonts: false, defaultFontFamily: 'Pretendard' } }).render().asPng());
const out = process.argv[2] || path.resolve(__dirname, '../assets');
const skyBg = `<defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${SKY2}"/><stop offset="1" stop-color="${SKY}"/></linearGradient></defs><rect width="100" height="100" fill="url(#sky)"/>`;

png(svg(`${skyBg}<g transform="translate(50 52) scale(0.72) translate(-50 -50)">${mascot()}</g>`), `${out}/icon.png`, 1024);
png(svg(`<g transform="translate(50 52) scale(0.52) translate(-50 -50)">${mascot()}</g>`), `${out}/adaptive-icon.png`, 1024);
png(svg(`<g transform="translate(200 130) scale(1.1) translate(-50 -50)">${mascot()}</g>
  <g transform="translate(200 252) scale(0.4) translate(-164 -59)">${word()}</g>
  <text x="200" y="312" font-family="Pretendard" font-weight="700" font-size="16" fill="${MUTE}" text-anchor="middle">오늘, 나에게 딱 맞는 운</text>`, '0 0 400 400'), `${out}/splash-icon.png`, 1200);
png(svg(`${skyBg.replace('<rect', '<rect rx="22"')}<g transform="translate(50 52) scale(0.78) translate(-50 -50)">${mascot()}</g>`), `${out}/favicon.png`, 196);
png(svg(`<rect x="-28" y="-26" width="384" height="170" fill="#FFFFFF"/>${word()}`, '-28 -26 384 170'), path.resolve(__dirname, '../docs/wordmark.png'), 1200);
console.log('ok');
