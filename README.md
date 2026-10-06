# 운Pick — 오늘의 운, 하나만 Pick!

사주 · 태국 점성술 · MBTI · 혈액형을 겹쳐 읽어 나를 알아가는 Expo(React Native + TypeScript) 앱.

- 브랜드 가이드: [docs/BRAND.md](docs/BRAND.md)
- 스토어 등록 정보: [docs/STORE_LISTING.md](docs/STORE_LISTING.md)
- 출시 전 체크리스트: [docs/LAUNCH_CHECKLIST.md](docs/LAUNCH_CHECKLIST.md)
- 아이콘·스플래시 다시 만들기: `npm run icons`

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

## 로그인 · 회원가입 (v0.6, 기획 공유용)

흐름: 온보딩 → 로그인 → 프로필 입력(4단계) → 홈. `services/auth/authService.ts`의 `AuthService` 계약만 지키면 실제 서버로 바꿀 수 있다.

- **첫 화면**: 큰 문구 + 로고 → 하단 "SNS 계정으로 간편 가입하기" 원형 아이콘(카카오 · 네이버 · Apple · Google) → "이메일로 시작하기" → "로그인에 어려움이 있나요?" 시트(이메일 로그인 · 비밀번호 찾기 · 문의)
- **이메일 가입**: 이메일 · 비밀번호(보기 토글) 두 칸 → 약관은 마지막에 바텀시트 한 장
- **비밀번호 찾기**: 이메일 → 6자리 인증번호(데모: 화면 표시) → 새 비밀번호
- **소셜 로그인**: 각 사 동의 화면을 흉내 낸 데모. 실제 연동 시 OAuth 인가 코드를 서버에서 토큰으로 교환 (Apple은 iOS 소셜 로그인 제공 시 필수)
- 계정·세션은 기기 저장(비밀번호는 해시만), 프로필·운세·포인트는 계정별 분리 저장

## 화면 구성 (v0.6)

- **하단 탭**: 홈 · 운세 · 콘텐츠 · 궁합 · 마이
- **프로필 입력 4단계**: 이름 → 생일·시간(모름 체크) → 성별·혈액형 → MBTI(모르면 4문항 간이 테스트)
- **홈**: 오늘의 운세 → 오늘의 행동 → 무료 콘텐츠(가로 스크롤, 결과 미리보기) → 4가지 관점 → 프리미엄 1장
- **콘텐츠 탭**: 무료 4종 → 신규 프리미엄 → 인생 패키지 → 전체 프리미엄 목록

## 신규 콘텐츠 (v0.6)

| 구분 | 콘텐츠 | 내용 | 목적 |
|---|---|---|---|
| 무료 | 찰떡 MBTI | 나와 맞는 MBTI TOP 3 · 조심할 유형 · 16유형 순위 · 공유 카드 | 공유·유입 |
| 무료 | 나의 사주 캐릭터 | 일주 60갑자로 정하는 캐릭터("하얀 뱀") · 성향 · 찰떡 캐릭터 · 공유 카드 | 공유·유입 |
| 무료 | 오늘의 부적 | 오늘의 키워드 한자 부적 · 주문 · 행운 색/숫자/시간 (매일 갱신) | 재방문 |
| 무료 | 친구 궁합 초대 | 링크를 받은 친구가 앱을 열면 홈에 초대 배너 → 바로 궁합 결과 | 신규 유입 |
| 300P | 미래 배우자 리포트 | 배우자 분위기 · 성격 · MBTI · 띠 · 나이 · 만나는 해/달/대운 · 장소 · 개운법 | 매출 |
| 150P | 그 사람의 속마음 | 마음 온도 · 나를 어떻게 느끼는지 · 3개월 흐름 · 연락하기 좋은 날 · 다가가는 법 | 매출 |

공유: 결과 카드 "이미지 저장"(웹은 PNG 다운로드) · "친구에게 공유"(Web Share API, 없으면 링크 복사)

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
