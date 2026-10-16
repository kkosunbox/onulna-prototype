import React from 'react';
import { Text, View } from 'react-native';
import PressableScale from './PressableScale';
import { txt } from '../theme/typography';
import { colors } from '../theme/colors';

/**
 * 섹션 제목 — 굵은 800 제목. eyebrow 를 주면 위에 코랄 영문 눈썹(예: TODAY)을 단다.
 * "01 · 제목" 형태면 번호를 코랄 눈썹으로 떼어 보여준다(유료 리포트 목차).
 */
export function HeadTitle({ title, eyebrow }: { title: string; eyebrow?: string }) {
  const m = title.match(/^(\d{2}) · (.+)$/);
  const brow = eyebrow ?? (m ? `CHAPTER ${m[1]}` : undefined);
  return (
    <View>
      {brow ? <Text style={{ fontSize: 12, fontWeight: '700', color: colors.seal, letterSpacing: 2, marginBottom: 6 }}>{brow}</Text> : null}
      <Text style={[txt.h2, { flexShrink: 1 }]} accessibilityRole="header">{m ? m[2] : title}</Text>
    </View>
  );
}

export default function SectionHeader({ title, caption, action, onAction, first, eyebrow }: { title: string; caption?: string; action?: string; onAction?(): void; first?: boolean; eyebrow?: string }) {
  return (
    <View style={{ marginTop: first ? 8 : 36, marginBottom: 14 }}>
      <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 12 }}>
        <View style={{ flex: 1 }}><HeadTitle title={title} eyebrow={eyebrow} /></View>
        {action ? (
          <PressableScale onPress={onAction} hitSlop={10} scaleTo={0.94} style={{ paddingBottom: 3 }}>
            <Text style={{ fontSize: 13, fontWeight: '700', color: colors.seal }}>{action} →</Text>
          </PressableScale>
        ) : null}
      </View>
      {caption ? <Text style={[txt.small, { marginTop: 4, fontSize: 14, lineHeight: 20 }]}>{caption}</Text> : null}
    </View>
  );
}
