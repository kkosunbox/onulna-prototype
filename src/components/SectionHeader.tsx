import React from 'react';
import { Text, View } from 'react-native';
import PressableScale from './PressableScale';
import Icon from './Icon';
import { txt } from '../theme/typography';
import { colors } from '../theme/colors';

/**
 * 섹션 제목 — 소제목(18 · 700). eyebrow 를 주면 위에 코랄 영문 눈썹(예: TODAY)을 단다.
 * "01 · 제목" 형태면 번호를 코랄 눈썹으로 떼어 보여준다(유료 리포트 목차).
 */
export function HeadTitle({ title, eyebrow }: { title: string; eyebrow?: string }) {
  const m = title.match(/^(\d{2}) · (.+)$/);
  const brow = eyebrow ?? (m ? `CHAPTER ${m[1]}` : undefined);
  return (
    <View>
      {brow ? <Text style={[txt.eyebrow, { marginBottom: 6 }]}>{brow}</Text> : null}
      <Text style={[txt.h2, { flexShrink: 1 }]} accessibilityRole="header">{m ? m[2] : title}</Text>
    </View>
  );
}

export default function SectionHeader({ title, caption, action, onAction, first, eyebrow }: { title: string; caption?: string; action?: string; onAction?(): void; first?: boolean; eyebrow?: string }) {
  // 시안: "제목 | 설명            >" 한 줄. 설명이 길면 제목 아래로 내린다
  const inline = !!caption && caption.length <= 22 && !eyebrow && !/^\d{2} · /.test(title);
  return (
    <View style={{ marginTop: first ? 8 : 32, marginBottom: 12 }}>
      <PressableScale onPress={onAction} disabled={!onAction} scaleTo={0.98} accessibilityLabel={action ? `${title} ${action}` : title}
        style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <View style={{ flexShrink: 1 }}><HeadTitle title={title} eyebrow={eyebrow} /></View>
        {inline ? (
          <>
            <View style={{ width: 1, height: 14, backgroundColor: colors.lineStrong }} />
            <Text style={[txt.small, { flex: 1 }]} numberOfLines={1}>{caption}</Text>
          </>
        ) : <View style={{ flex: 1 }} />}
        {onAction ? <Icon name="chevronRight" size={20} color={colors.inkSub} strokeWidth={2} /> : null}
      </PressableScale>
      {caption && !inline ? <Text style={[txt.small, { marginTop: 4 }]}>{caption}</Text> : null}
    </View>
  );
}
