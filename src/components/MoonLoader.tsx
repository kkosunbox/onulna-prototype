import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { LogoMark } from './BrandMark';
import { colors } from '../theme/colors';
import { useReducedMotion } from '../utils/motion';
import { fonts } from '../theme/typography';

interface Props { title: string; messages?: string[]; variant?: 'night' | 'light' }

/**
 * 조용한 로딩: 일력이 한 장씩 넘어간다(맨 위 장이 살짝 들려 사라지고 다음 장이 드러남) + 교차 페이드 문구.
 * 1.6초 주기의 느린 움직임만 쓴다. 이름은 기존 호출부 호환을 위해 유지.
 */
export default function MoonLoader({ title, messages = [] }: Props) {
  const reduced = useReducedMotion();
  const flip = useRef(new Animated.Value(0)).current;
  const fade = useRef(new Animated.Value(1)).current;
  const [i, setI] = useState(0);

  useEffect(() => {
    if (reduced) return;
    const a = Animated.loop(Animated.sequence([
      Animated.delay(500),
      Animated.timing(flip, { toValue: 1, duration: 900, easing: Easing.inOut(Easing.cubic), useNativeDriver: true }),
      Animated.timing(flip, { toValue: 0, duration: 0, useNativeDriver: true }),
    ]));
    a.start();
    return () => a.stop();
  }, [reduced]);

  useEffect(() => {
    if (messages.length < 2) return;
    const t = setInterval(() => {
      Animated.timing(fade, { toValue: 0, duration: 220, useNativeDriver: true }).start(() => {
        setI(v => (v + 1) % messages.length);
        Animated.timing(fade, { toValue: 1, duration: 320, useNativeDriver: true }).start();
      });
    }, 1400);
    return () => clearInterval(t);
  }, [messages.length]);

  const lift = flip.interpolate({ inputRange: [0, 1], outputRange: [0, -46] });
  const tilt = flip.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '-14deg'] });
  const gone = flip.interpolate({ inputRange: [0, 0.6, 1], outputRange: [1, 0.7, 0] });

  return (
    <View style={{ flex: 1, backgroundColor: colors.cream }}>
      <View style={s.center}>
        <View style={s.stage}>
          <LogoMark size={120} />
          <Animated.View style={[StyleSheet.absoluteFill, s.top, { opacity: gone, transform: [{ translateY: lift }, { rotate: tilt }] }]}>
            <LogoMark size={120} />
          </Animated.View>
        </View>
        <Text style={s.title}>{title}</Text>
        {messages.length ? <Animated.Text style={[s.msg, { opacity: fade }]}>{messages[i]}</Animated.Text> : null}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  stage: { width: 120, height: 120, alignItems: 'center', justifyContent: 'center' },
  top: { alignItems: 'center', justifyContent: 'center' },
  title: { fontFamily: fonts.serif, fontSize: 19, lineHeight: 28, fontWeight: '600', letterSpacing: -0.4, textAlign: 'center', marginTop: 36, color: colors.ink },
  msg: { fontSize: 13, marginTop: 10, textAlign: 'center', color: colors.inkMute },
});
