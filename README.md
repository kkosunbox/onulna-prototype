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

## 프리미엄 콘텐츠 · 포인트 (v0.3)

`onulna-preview.html` 미리보기의 유료 콘텐츠를 앱으로 옮겼다. 계산 엔진은 미리보기와 같은 결과를 낸다(같은 프로필로 대조 검증).

- **포인트**: 1,000원 = 100P, 가입 축하 100P · 출석 체크 10P. 충전은 미리보기용(실제 결제 없음) — `context/PremiumContext.tsx`
- **상품 · 가격**: `services/premium/catalog.ts` (상세 사주 300P · 평생운 500P · 신년 300P/해 · 월별 100P/월 · 테마 각 200P · 심층 궁합 150P/상대 · 길일 50P/7일 · 인생 패키지 1,100P)
- **계산 엔진**: `services/premium/engine.ts` (십성 · 지장간 · 12운성 · 신강약 · 용신 · 신살 · 대운 · 연/월운 · 테마 · 길일), 문장 데이터 `services/premium/data.ts`
- **화면**: `screens/premium/*` — 프리미엄 허브, 내 포인트, 상세 사주 해석, 평생운, 신년운세, 월별 상세운세, 테마 운세, 길일 찾기 + 궁합 결과의 심층 궁합
- 모든 콘텐츠는 앞부분 무료 미리보기 → 나머지는 흐리게 잠금(`LockGate`) → 포인트로 열람

### AI 종합 리포트
열람한 콘텐츠마다 4가지 관점을 엮은 장문 리포트(8~14개 섹션)를 만든다. `services/report/reportService.ts`
1. 백엔드에 `POST { prompt }` → `{ text }` 를 돌려주는 엔드포인트를 만든다(LLM 호출). **API 키는 앱에 넣지 않는다.**
2. `REPORT_CONFIG.endpoint` 수정, `enabled: true`.
3. 꺼져 있으면 "AI 종합 풀이를 쓸 수 없어요" 안내와 함께 계산 근거(상세 데이터)를 바로 펼쳐 보여준다.

## AI 연결

`src/services/fortune/aiFortuneService.ts`
1. 백엔드(예: Supabase Edge Function)에 `buildPrompt()` 결과를 받아 LLM을 호출하는 엔드포인트를 만든다. **API 키는 앱에 넣지 않는다.**
2. `AI_CONFIG.endpoint` 수정, `enabled: true`.
3. 응답은 `CombinedFortune` JSON. 스키마 검증 실패·타임아웃 시 규칙 엔진으로 자동 fallback.

## 사주 계산 범위 (MVP)
- 일주: 60갑자 순환 정확 계산 (1949-10-01 갑자일 기준)
- 년주: 입춘 2/4 고정 근사 / 월주: 절입일 고정 근사 / 시주: 시두법
- 미적용: 음력 입력, 절입 시각, 야자시, 서머타임·경도 보정 → 만세력 엔진으로 교체 예정

## 디자인 시스템 — 책력(冊曆) (v0.4)

`onulna-preview.html`의 책력 디자인 시스템을 따른다.

- **색** (`theme/colors.ts`): 한지 바탕 `#F3EEE4` · 카드 `#FFFDF8` · 먹 남색 `#22293F` · 달빛 금색 `#D9B872` · 낙관 붉은색 `#B5432E`. 관점(사주·태국·MBTI·혈액형)과 분야(연애·재물·직장·관계)별 색이 따로 있다.
  - `purple`은 글자·강조용(다크 모드에서 밝아짐), `navy`는 버튼·선택 상태 채움용(모드와 무관)
- **다크 모드**: 시스템 설정을 따른다(앱 시작 시 결정)
- **글꼴**: 제목·숫자·리포트 본문은 명조 Hahmlet, 본문은 IBM Plex Sans KR(웹). 네이티브는 expo-font로 Hahmlet을 불러오고 본문은 시스템 글꼴
- **아이콘**: 이모지 대신 한자 도장(낙관) — 분야 緣財業人, 관점 命星性血, 키워드 新變機財休集言愼和挑感學 (`components/Seal.tsx`, `components/Ico.tsx`)
- **모양**: 카드 14 · 히어로 18(단색, 광채 없음) · 버튼 12 · 입력/선택지 10 · 칩·태그 6, 그림자는 거의 평평하게
