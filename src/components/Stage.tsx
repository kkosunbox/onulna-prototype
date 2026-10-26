import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { useReducedMotion } from '../utils/motion';

/**
 * 하늘 무대 부품 — 홈 종합운 · 운세 탭이 같은 무대를 쓴다.
 *  Clouds: 아래쪽 흰 구름 두 무더기 + 반짝이는 별(배경)
 *  Floating: 안에 든 것(운알이)을 위아래로 둥실 + 바닥 그림자(움직임 줄이기면 정지)
 */
export function Clouds() {
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <Svg width="100%" height="100%" viewBox="0 0 340 300" preserveAspectRatio="xMidYMax slice">
        {[[34, 262, 26], [64, 252, 32], [96, 264, 24], [16, 278, 20]].map(([x, y, r], i) => <Circle key={`l${i}`} cx={x} cy={y} r={r} fill="#FFFFFF" fillOpacity={0.85} />)}
        {[[262, 268, 24], [292, 254, 32], [324, 266, 26], [310, 284, 22]].map(([x, y, r], i) => <Circle key={`r${i}`} cx={x} cy={y} r={r} fill="#FFFFFF" fillOpacity={0.85} />)}
        <Path d="M60 150 L63 157 L70 160 L63 163 L60 170 L57 163 L50 160 L57 157 Z" fill="#FFD84D" />
        <Path d="M286 136 L288 141 L293 143 L288 145 L286 150 L284 145 L279 143 L284 141 Z" fill="#FFFFFF" />
        <Path d="M262 190 L264 195 L269 197 L264 199 L262 204 L260 199 L255 197 L260 195 Z" fill="#FFD84D" fillOpacity={0.9} />
        <Circle cx={88} cy={204} r={3} fill="#FFFFFF" />
      </Svg>
    </View>
  );
}

export function Floating({ children, shadowWidth = 74 }: { children: React.ReactNode; shadowWidth?: number }) {
  const reduced = useReducedMotion();
  const bob = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (reduced) return;
    const a = Animated.loop(Animated.sequence([
      Animated.timing(bob, { toValue: 1, duration: 1600, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      Animated.timing(bob, { toValue: 0, duration: 1600, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
    ]));
    a.start();
    return () => a.stop();
  }, [reduced]);
  const ty = bob.interpolate({ inputRange: [0, 1], outputRange: [3, -5] });
  const sx = bob.interpolate({ inputRange: [0, 1], outputRange: [1, 0.82] });
  return (
    <View style={{ alignItems: 'center' }}>
      <Animated.View style={[s.shadow, { width: shadowWidth, transform: [{ scaleX: sx }] }]} />
      <Animated.View style={{ transform: [{ translateY: ty }] }}>{children}</Animated.View>
    </View>
  );
}

const s = StyleSheet.create({
  shadow: { position: 'absolute', bottom: 10, height: 9, borderRadius: 999, backgroundColor: '#4C77A8', opacity: 0.12 },
});
