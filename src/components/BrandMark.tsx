import React from 'react';
import { Image } from 'react-native';
import Mascot from './Mascot';

/** 브랜드 — 화면 문구와 공유 문구가 모두 여기서 가져간다 (docs/BRAND.md) */
export const BRAND = { name: '운픽', ko: '운픽', slogan: '오늘, 나에게 딱 맞는 운', store: '운픽 - 오늘, 나에게 딱 맞는 운' };

/**
 * 운픽 로고 — 확정 시안(assets/brand/logo-original.png)에서 배경과 모눈만 걷어낸 투명 PNG.
 * 모양·색은 원본 그대로(흰 글자 + 운알이). 하늘색이나 어두운 바탕 위에 둔다.
 * 흰 바탕처럼 밝은 곳에서만 글자를 먹색으로 바꾼 ink 버전을 쓴다. (scripts/cutout-logo.js 로 생성)
 */
const LOGO = require('../../assets/brand/logo.png');
const LOGO_INK = require('../../assets/brand/logo-ink.png');
const RATIO = 669 / 396;

/** 마크: 운알이 얼굴 (작은 자리 · 로딩) */
export function LogoMark({ size = 24 }: { size?: number; fg?: string }) {
  return <Mascot size={size} shadow={false} />;
}

/** 워드마크. size = 높이 · ink = 밝은 바탕용(글자 먹색) */
export default function BrandMark({ size = 22, ink = false }: { size?: number; ink?: boolean; light?: boolean; fg?: string }) {
  return <Image source={ink ? LOGO_INK : LOGO} accessibilityLabel={BRAND.name} resizeMode="contain" style={{ width: size * RATIO, height: size }} />;
}
