const { Resvg } = require('@resvg/resvg-js');
const fs = require('fs'), zlib = require('zlib');
const SRC = require('path').resolve(__dirname, '../assets/brand/') + '/logo-original.png';
const W = 876, H = 448;
const b64 = fs.readFileSync(SRC).toString('base64');
const px = new Resvg(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><image href="data:image/png;base64,${b64}" width="${W}" height="${H}"/></svg>`).render().pixels;
const at = (x, y) => (y * W + x) * 4;
const L = (x, y) => { const i = at(x, y); return (px[i] + px[i + 1] + px[i + 2]) / 3; };
// 격자선 찾기: 배경 줄/열에서 양옆보다 어두운 1px 선
const gx = [], gy = [];
for (let x = 1; x < W - 1; x++) { let d = 0; for (const y of [6, 8, H - 8, H - 6]) d += (L(x - 1, y) + L(x + 1, y)) / 2 - L(x, y); if (d / 4 > 6) gx.push(x); }
for (let y = 1; y < H - 1; y++) { let d = 0; for (const x of [6, 8, W - 8, W - 6]) d += (L(x, y - 1) + L(x, y + 1)) / 2 - L(x, y); if (d / 4 > 6) gy.push(y); }
// 선 위 픽셀을 양옆 평균으로 메운다(세로선은 좌우, 가로선은 위아래)
for (const x of gx) for (let y = 0; y < H; y++) { const i = at(x, y), a = at(x - 1, y), b = at(x + 1, y); for (let c = 0; c < 3; c++) px[i + c] = (px[a + c] + px[b + c]) / 2; }
for (const y of gy) for (let x = 0; x < W; x++) { const i = at(x, y), a = at(x, y - 1), b = at(x, y + 1); for (let c = 0; c < 3; c++) px[i + c] = (px[a + c] + px[b + c]) / 2; }
console.log('grid', gx.length, gy.length);
// 줄마다 배경색 추정: 왼쪽 끝 · 오른쪽 끝 픽셀 평균
const bgRow = [];
for (let y = 0; y < H; y++) {
  const s = [0, 0, 0]; let n = 0;
  for (const x of [1, 2, 3, W - 2, W - 3, W - 4]) { const i = at(x, y); s[0] += px[i]; s[1] += px[i + 1]; s[2] += px[i + 2]; n++; }
  bgRow.push(s.map(v => v / n));
}
const dist = (x, y) => { const i = at(x, y), b = bgRow[y]; return Math.hypot(px[i] - b[0], px[i + 1] - b[1], px[i + 2] - b[2]); };
const T = +process.argv[2] || 34;
// 가장자리에서 배경 채우기
const bg = new Uint8Array(W * H); const q = [];
const push = (x, y) => { if (x < 0 || y < 0 || x >= W || y >= H) return; const k = y * W + x; if (bg[k] || dist(x, y) > T) return; bg[k] = 1; q.push(k); };
for (let x = 0; x < W; x++) { push(x, 0); push(x, H - 1); }
for (let y = 0; y < H; y++) { push(0, y); push(W - 1, y); }
while (q.length) { const k = q.pop(); const x = k % W, y = (k / W) | 0; push(x + 1, y); push(x - 1, y); push(x, y + 1); push(x, y - 1); }
// 둘러싸인 배경 구멍: 배경색에 가까운 덩어리 중 테두리가 흰색(글자)으로만 둘러싸인 것
{
  const seen = new Uint8Array(W * H);
  for (let k0 = 0; k0 < W * H; k0++) {
    if (bg[k0] || seen[k0]) continue; const x0 = k0 % W, y0 = (k0 / W) | 0;
    if (dist(x0, y0) > T) continue;
    const st = [k0], mem = []; seen[k0] = 1; let white = 0, other = 0;
    while (st.length) { const k = st.pop(); mem.push(k); const x = k % W, y = (k / W) | 0;
      for (const [dx, dy] of [[1,0],[-1,0],[0,1],[0,-1]]) { const xx = x + dx, yy = y + dy; if (xx < 0 || yy < 0 || xx >= W || yy >= H) continue; const kk = yy * W + xx; if (seen[kk]) continue;
        if (dist(xx, yy) <= T && !bg[kk]) { seen[kk] = 1; st.push(kk); } else if (!bg[kk]) { const i = kk * 4; Math.min(px[i], px[i + 1], px[i + 2]) > 200 ? white++ : other++; } } }
    // 운알이 영역(왼쪽 위) 밖에 있는 작은 배경색 덩어리 = 글자 속 구멍
    const inMascot = mem.some(k => k % W < 380 && ((k / W) | 0) < 262);
    if (!inMascot && mem.length < 20000) for (const k of mem) bg[k] = 1;
    void white; void other;
  }
}
// 출력: 배경 투명, 경계 1~2px은 거리 비례 알파 + 배경색 빼기
const out = Buffer.alloc(W * H * 4);
for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
  const k = y * W + x, i = k * 4;
  if (bg[k]) { out[i + 3] = 0; continue; }
  let edge = false;
  for (const [dx, dy] of [[1,0],[-1,0],[0,1],[0,-1],[1,1],[-1,-1],[1,-1],[-1,1]]) { const xx = x + dx, yy = y + dy; if (xx >= 0 && yy >= 0 && xx < W && yy < H && bg[yy * W + xx]) edge = true; }
  let a = 1;
  if (edge) a = Math.min(1, Math.max(0, (dist(x, y) - T * 0.5) / (T * 2.2)));
  const b = bgRow[y];
  for (let c = 0; c < 3; c++) {
    let v = px[i + c];
    if (a > 0 && a < 1) v = (v - b[c] * (1 - a)) / a;
    out[i + c] = Math.max(0, Math.min(255, Math.round(v)));
  }
  out[i + 3] = Math.round(a * 255);
}
// 흰 글자 위 격자선 정리: 밝고 채도 낮은 픽셀 → 흰색 (큰 덩어리만 = 글자, 눈 흰자·반짝임 같은 작은 덩어리는 그대로)
const light = new Uint8Array(W * H);
for (let k = 0; k < W * H; k++) { const i = k * 4; if (out[i + 3] < 10) continue; const r = out[i], g = out[i + 1], bb = out[i + 2]; const mx = Math.max(r, g, bb), mn = Math.min(r, g, bb); if (mn > 200 && mx - mn < 40) light[k] = 1; }
const comp = new Int32Array(W * H).fill(-1); const sizes = [];
for (let k0 = 0; k0 < W * H; k0++) {
  if (!light[k0] || comp[k0] >= 0) continue;
  const id = sizes.length; let n = 0; const st = [k0]; comp[k0] = id;
  while (st.length) { const k = st.pop(); n++; const x = k % W, y = (k / W) | 0;
    for (const [dx, dy] of [[1,0],[-1,0],[0,1],[0,-1]]) { const xx = x + dx, yy = y + dy; if (xx < 0 || yy < 0 || xx >= W || yy >= H) continue; const kk = yy * W + xx; if (light[kk] && comp[kk] < 0) { comp[kk] = id; st.push(kk); } } }
  sizes.push(n);
}
const isLetter = k => comp[k] >= 0 && sizes[comp[k]] > 2500 && (((k / W) | 0) >= 248 || k % W >= 380);
const variant = (letter) => { const o = Buffer.from(out); for (let k = 0; k < W * H; k++) if (isLetter(k)) { const i = k * 4; o[i] = letter[0]; o[i + 1] = letter[1]; o[i + 2] = letter[2]; } return o; };
// 잘라내기: 투명 아닌 영역 + 여백 6
let x0 = W, y0 = H, x1 = 0, y1 = 0;
for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (out[at(x, y) + 3] > 8) { x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y); }
x0 = Math.max(0, x0 - 6); y0 = Math.max(0, y0 - 6); x1 = Math.min(W - 1, x1 + 6); y1 = Math.min(H - 1, y1 + 6);
const cw = x1 - x0 + 1, ch = y1 - y0 + 1;
function png(buf, file) {
  const raw = Buffer.alloc((cw * 4 + 1) * ch);
  for (let y = 0; y < ch; y++) { raw[y * (cw * 4 + 1)] = 0; buf.copy(raw, y * (cw * 4 + 1) + 1, ((y + y0) * W + x0) * 4, ((y + y0) * W + x0 + cw) * 4); }
  const crcT = []; for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; crcT[n] = c >>> 0; }
  const crc = b => { let c = 0xffffffff; for (const v of b) c = crcT[(c ^ v) & 255] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; };
  const chunk = (t, d) => { const l = Buffer.alloc(4); l.writeUInt32BE(d.length); const td = Buffer.concat([Buffer.from(t), d]); const c = Buffer.alloc(4); c.writeUInt32BE(crc(td)); return Buffer.concat([l, td, c]); };
  const ih = Buffer.alloc(13); ih.writeUInt32BE(cw, 0); ih.writeUInt32BE(ch, 4); ih[8] = 8; ih[9] = 6; ih[10] = 0; ih[11] = 0; ih[12] = 0;
  fs.writeFileSync(file, Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]), chunk('IHDR', ih), chunk('IDAT', zlib.deflateSync(raw, { level: 9 })), chunk('IEND', Buffer.alloc(0))]));
}
png(variant([255, 255, 255]), require('path').resolve(__dirname, '../assets/brand/') + '/logo.png');
png(variant([25, 28, 34]), require('path').resolve(__dirname, '../assets/brand/') + '/logo-ink.png');
console.log('crop', cw, ch, 'letters', sizes.filter(s => s > 2500));
