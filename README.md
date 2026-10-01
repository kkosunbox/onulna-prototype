# 오늘나 — 4가지 관점으로 보는 나의 오늘

사주 · 태국 점성술 · MBTI · 혈액형을 종합해 개인 맞춤 운세를 보여주는 Expo(React Native + TypeScript) MVP.

## 실행

```bash
npm install
npx expo install --fix   # 설치된 Expo SDK에 맞게 네이티브 패키지 버전 정렬
npx expo start           # Expo Go 앱으로 QR 스캔
npm run web              # 브라우저에서 실행 (react-native-web)
npm run build:web        # 정적 웹 빌드 → dist/
```

## 웹 배포 (Vercel)

`vercel.json`에 빌드 설정이 들어 있어 GitHub 저장소를 Vercel에 Import하면 그대로 배포된다.
(Build: `npx expo export --platform web`, Output: `dist`, SPA rewrite)

## 구조

```
App.tsx
src/
  theme/        colors, typography
  types/        User, DailyFortune, CombinedFortune, Compatibility …
  data/         사주·태국·MBTI·혈액형 기초 데이터, 공통 키워드 어휘/행동 풀
  services/
    fortune/
      sajuService.ts            /fortune/saju      (4주 근사 계산 + 일진 관계)
      thaiAstrologyService.ts   /fortune/thai      (탄생 요일 행성)
      mbtiService.ts            /fortune/mbti
      bloodTypeService.ts       /fortune/blood
      combinedService.ts        /fortune/combined  (규칙 기반 종합 엔진)
      aiFortuneService.ts       AI 종합 레이어 (FortuneEngine 인터페이스, JSON 검증, fallback)
      fortuneService.ts         파이프라인 + 캐시
      periodFortuneService.ts   주간/월간/연간
      compatibilityService.ts   궁합 (CompatibilityEngine)
    storage/storageService.ts   AsyncStorage (StorageRepository → Supabase 교체 지점)
    notificationService.ts      아침 알림 (Mock)
    shareService.ts             공유 카드 캡처 + 시스템 공유
  context/AppContext.tsx
  navigation/                   Root stack + 커스텀 하단 탭
  components/                   ScoreCard, ScoreRing, FortuneCard, KeywordChip, AnalysisCard …
  screens/                      Onboarding, ProfileSetup, Home, Fortune, Compatibility, MyPage …
```

## AI 연결

`src/services/fortune/aiFortuneService.ts`
1. 백엔드(예: Supabase Edge Function)에 `buildPrompt()` 결과를 받아 LLM을 호출하는 엔드포인트를 만든다. **API 키는 앱에 넣지 않는다.**
2. `AI_CONFIG.endpoint` 수정, `enabled: true`.
3. 응답은 `CombinedFortune` JSON. 스키마 검증 실패·타임아웃 시 규칙 엔진으로 자동 fallback.

## 사주 계산 범위 (MVP)
- 일주: 60갑자 순환 정확 계산 (1949-10-01 갑자일 기준)
- 년주: 입춘 2/4 고정 근사 / 월주: 절입일 고정 근사 / 시주: 시두법
- 미적용: 음력 입력, 절입 시각, 야자시, 서머타임·경도 보정 → 만세력 엔진으로 교체 예정

## 디자인 시스템 (v0.2)

- **토큰**: `theme/colors.ts`(브랜드·분야·4가지 관점 컬러, 그라디언트), `theme/typography.ts`(`txt` 타입 스케일, `radius`, `shadow`)
- **반경 위계**: 히어로 28 · 카드 20 · 입력/칩 12~16 · 알약 999
- **그림자**: 회색 대신 보라 톤(#2A1B5C) 저불투명 그림자
- **관점 컬러**: 사주 인디고 · 태국 앰버 · MBTI 틸 · 혈액형 로즈
- **모션**: 누름 스프링(`PressableScale`), 점수 링 채움 + 숫자 카운트업, 막대 채움, 세그먼트 슬라이드, 탭 인디케이터, 단계 전환. 홈 첫 진입 시 한 번만 순차 등장. OS '동작 줄이기' 설정을 따름(`utils/motion.ts`)
- **햅틱**: 선택·탭 전환·주요 버튼에 가벼운 selection 햅틱 (`expo-haptics`)
