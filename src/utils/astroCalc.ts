/**
 * 해와 달의 황경(도) 근사 계산 — 별자리 · 낙샤트라 판정용.
 * 해: 오차 약 0.01°, 달: 주요 섭동 6항만 써서 오차 약 0.3° (낙샤트라 폭 13°20′에 비해 충분).
 * 시각은 한국 표준시(UTC+9) 기준, 출생 시각을 모르면 정오로 계산한다.
 */

const rad = (d: number) => (d * Math.PI) / 180;
const norm = (d: number) => ((d % 360) + 360) % 360;

/** 율리우스일 — 'YYYY-MM-DD' + 'HH:MM'(KST) */
export function julianDay(iso: string, time: string | null): number {
  const [y, m, d] = iso.split('-').map(Number);
  const [hh, mm] = (time ?? '12:00').split(':').map(Number);
  return Date.UTC(y, m - 1, d, hh - 9, mm) / 86400000 + 2440587.5;
}

/** 해의 열대 황경 */
export function sunLongitude(jd: number): number {
  const n = jd - 2451545.0;
  const L = 280.46 + 0.9856474 * n;
  const g = rad(357.528 + 0.9856003 * n);
  return norm(L + 1.915 * Math.sin(g) + 0.02 * Math.sin(2 * g));
}

/** 달의 열대 황경 */
export function moonLongitude(jd: number): number {
  const n = jd - 2451545.0;
  const L = 218.316 + 13.176396 * n; // 평균 황경
  const Mm = rad(134.963 + 13.064993 * n); // 달의 평균 근점이각
  const Ms = rad(357.529 + 0.98560028 * n); // 해의 평균 근점이각
  const D = rad(297.85 + 12.190749 * n); // 평균 이각
  const F = rad(93.272 + 13.22935 * n); // 승교점 이각
  return norm(
    L + 6.289 * Math.sin(Mm) - 1.274 * Math.sin(Mm - 2 * D) + 0.658 * Math.sin(2 * D)
      + 0.214 * Math.sin(2 * Mm) - 0.186 * Math.sin(Ms) - 0.114 * Math.sin(2 * F),
  );
}

/** 라히리 아야남샤(세차 보정) 근사 — 2000년 23.853°에서 해마다 약 50.3″ */
export function ayanamsa(jd: number): number {
  return 23.853 + ((jd - 2451545.0) / 365.25) * 0.013969;
}

export const signOf = (lon: number) => Math.floor(norm(lon) / 30);
export const nakshatraOf = (siderealLon: number) => Math.floor(norm(siderealLon) / (360 / 27));
