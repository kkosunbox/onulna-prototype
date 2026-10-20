import React from 'react';
import { Image } from 'react-native';
import Mascot from './Mascot';

/** 브랜드 — 화면 문구와 공유 문구가 모두 여기서 가져간다 (docs/BRAND.md) */
export const BRAND = { name: '운픽', ko: '운픽', slogan: '오늘, 나에게 딱 맞는 운', store: '운픽 - 오늘, 나에게 딱 맞는 운' };

/**
 * 운픽 로고 — 확정 시안 이미지(assets/brand/logo.png, 876×448)를 그대로 쓴다.
 * 다시 그리거나 색을 바꾸지 않는다. 크기만 높이(size)로 맞추고 모서리를 둥글게 자른다.
 */
const LOGO = require('../../assets/brand/logo.png');
const RATIO = 876 / 448;

/** 마크: 운알이 얼굴 (작은 자리 · 로딩) */
export function LogoMark({ size = 24 }: { size?: number; fg?: string }) {
  return <Mascot size={size} shadow={false} />;
}

/** 워드마크: 확정 로고 이미지. size = 높이 */
export default function BrandMark({ size = 22 }: { light?: boolean; size?: number; fg?: string }) {
  return (
    <Image
      source={LOGO}
      accessibilityLabel={BRAND.name}
      resizeMode="contain"
      style={{ width: size * RATIO, height: size, borderRadius: size * 0.14 }}
    />
  );
}
