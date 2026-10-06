# 이용약관·개인정보처리방침 원본 → src/content/legal.ts + public/*.html (python3 scripts/build-legal.py)
import json, html
UPDATED = '2026년 10월 6일'
OP = '[운영자명]'; MAIL = '[문의 이메일]'
TERMS = [
 ('제1조 (목적)', f'이 약관은 {OP}(이하 "회사")가 제공하는 모바일 앱 "운Pick"(이하 "서비스")의 이용 조건과 절차, 회사와 이용자의 권리·의무를 정하는 것을 목적으로 합니다.'),
 ('제2조 (서비스의 성격)', '서비스가 제공하는 운세·사주·궁합·상담 등 모든 콘텐츠는 재미와 참고를 위한 것입니다. 의료·법률·투자·금융 등 중요한 결정의 근거가 될 수 없으며, 이용자는 이를 이해하고 스스로 판단하여 이용합니다.'),
 ('제3조 (회원가입과 계정)', '① 이용자는 이메일 또는 카카오·네이버·Apple·Google 계정으로 가입할 수 있습니다.\n② 만 14세 미만은 가입할 수 없습니다.\n③ 이용자는 계정 정보를 스스로 관리해야 하며, 타인에게 양도하거나 빌려줄 수 없습니다.'),
 ('제4조 (포인트와 유료 콘텐츠)', '① 포인트는 서비스 안의 유료 콘텐츠를 여는 데에만 쓸 수 있으며 현금으로 바꿀 수 없습니다.\n② 유료 콘텐츠의 가격과 열람 기간(소장·기간제)은 구매 화면에 표시합니다.\n③ 구매한 포인트는 사용하지 않은 경우 구매일로부터 7일 이내에 청약을 철회할 수 있습니다. 이미 연 콘텐츠는 디지털 콘텐츠의 특성상 철회가 제한될 수 있습니다.\n④ 앱 마켓을 통한 결제의 환불은 각 마켓의 정책을 따릅니다.\n⑤ 출석·공유 등으로 무료 지급된 포인트는 환불 대상이 아닙니다.'),
 ('제5조 (이용자의 의무)', '이용자는 타인의 개인정보(생년월일 등)를 동의 없이 입력하거나, 서비스를 이용해 타인을 비방·괴롭히는 행위를 해서는 안 됩니다. 고민 상담에 타인을 특정할 수 있는 정보를 적지 않도록 주의해 주세요.'),
 ('제6조 (서비스의 변경·중단)', '회사는 운영상·기술상 필요에 따라 서비스의 전부 또는 일부를 변경하거나 중단할 수 있으며, 중요한 변경은 사전에 앱 안에서 알립니다.'),
 ('제7조 (회원 탈퇴)', '이용자는 언제든지 [마이 > 회원 탈퇴]에서 탈퇴할 수 있으며, 탈퇴하면 프로필·운세 기록·포인트·구매 내역이 삭제되고 되돌릴 수 없습니다.'),
 ('제8조 (책임의 제한)', '회사는 콘텐츠의 내용에 따른 이용자의 판단과 그 결과에 대해 책임지지 않습니다. 다만 회사의 고의 또는 중대한 과실로 인한 손해는 예외로 합니다.'),
 ('제9조 (분쟁 해결)', f'서비스 이용과 관련한 문의·불만은 {MAIL}로 접수하며, 분쟁은 대한민국 법을 따르고 민사소송법상 관할 법원에서 해결합니다.'),
 ('부칙', f'이 약관은 {UPDATED}부터 시행합니다.'),
]
PRIVACY = [
 ('1. 수집하는 개인정보', '• 회원가입: 이메일(이메일 가입 시), 소셜 계정 식별자(소셜 가입 시)\n• 운세 계산: 닉네임, 생년월일, 출생시간(선택), 성별, MBTI, 혈액형, 관심사(선택)\n• 궁합: 상대방의 닉네임·생년월일·성별·MBTI·혈액형 (이용자가 직접 입력)\n• 고민 상담: 이용자가 작성한 고민 글\n• 이용 기록: 포인트 적립·사용 내역, 열람한 콘텐츠'),
 ('2. 이용 목적', '맞춤 운세·궁합·상담 결과 제공, 포인트와 유료 콘텐츠 관리, 고객 문의 응대, 서비스 개선. 수집한 정보는 광고 목적으로 판매하거나 제3자에게 제공하지 않습니다.'),
 ('3. 보관 위치와 기간', '현재 버전은 위 정보를 이용자의 기기 안(앱 저장소)에 계정별로 보관합니다. 회원 탈퇴 또는 앱 삭제 시 즉시 삭제됩니다. 고민 상담 글은 기기에만 저장되며 공유 카드·링크에 포함되지 않습니다. 서버 보관 방식으로 바뀌면 이 방침을 개정하고 앱에서 알립니다.'),
 ('4. 공유 링크', '이용자가 결과를 공유하면 링크에 이용자의 닉네임과 결과 한 줄이, 궁합 초대 링크에는 궁합 계산에 필요한 최소 정보(닉네임·생년월일·성별·MBTI·혈액형)가 담깁니다. 링크를 받은 사람은 이 정보를 볼 수 있으니 공유 전에 확인해 주세요.'),
 ('5. 제3자 제공과 처리 위탁', '법령에 따른 경우를 제외하고 제3자에게 제공하지 않습니다. 소셜 로그인 시 해당 플랫폼(카카오·네이버·Apple·Google)의 인증을 이용하며, 결제는 앱 마켓(Apple App Store·Google Play)이 처리합니다.'),
 ('6. 이용자의 권리', '이용자는 언제든지 [마이]에서 프로필을 확인·수정하고, [회원 탈퇴]로 모든 정보를 삭제할 수 있습니다. 열람·정정·삭제·처리정지 요청은 아래 연락처로도 할 수 있습니다.'),
 ('7. 만 14세 미만', '만 14세 미만 아동의 가입을 받지 않으며, 해당 사실을 알게 되면 즉시 정보를 삭제합니다.'),
 ('8. 개인정보 보호책임자', f'• 책임자: [이름]\n• 연락처: {MAIL}\n개인정보 침해 신고·상담은 개인정보침해신고센터(privacy.kisa.or.kr, 국번 없이 118)에도 할 수 있습니다.'),
 ('9. 개정', f'이 방침은 {UPDATED}부터 적용합니다. 내용이 바뀌면 시행 7일 전부터 앱 안에서 알립니다.'),
]
DOCS = {'terms': ('서비스 이용약관', TERMS), 'privacy': ('개인정보처리방침', PRIVACY)}
ts = "/**\n * 이용약관 · 개인정보처리방침 — public/terms.html · public/privacy.html 과 같은 원본에서 만든다.\n * [대괄호] 항목(운영자명·연락처 등)은 출시 전에 실제 정보로 채워야 한다.\n */\nexport type LegalDoc = 'terms' | 'privacy';\nexport const LEGAL_UPDATED = %s;\nexport const LEGAL: Record<LegalDoc, { title: string; sections: [string, string][] }> = %s;\n" % (json.dumps(UPDATED, ensure_ascii=False), json.dumps({k: {'title': t, 'sections': s} for k,(t,s) in DOCS.items()}, ensure_ascii=False, indent=2))
open('src/content/legal.ts','w',encoding='utf-8').write(ts)
for k,(t,secs) in DOCS.items():
    body=''.join(f'<h2>{html.escape(a)}</h2><p>{html.escape(b).replace(chr(10),"<br>")}</p>' for a,b in secs)
    page=f'''<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{t} · 운Pick</title>
<link rel="icon" href="/favicon.ico"><style>
:root{{--bg:#F3EEE4;--ink:#1C1A17;--sub:#58524A;--line:#DCD3C3;--accent:#A8402B}}
@media (prefers-color-scheme:dark){{:root{{--bg:#151411;--ink:#EDE7DB;--sub:#BDB4A4;--line:#38342D;--accent:#D58A8C}}}}
body{{margin:0;background:var(--bg);color:var(--ink);font:15px/1.75 -apple-system,"Apple SD Gothic Neo","Noto Sans KR",sans-serif;word-break:keep-all}}
main{{max-width:720px;margin:0 auto;padding:40px 16px 64px}}h1{{font-family:AppleMyungjo,"Nanum Myeongjo",serif;font-size:26px;margin:0 0 4px}}
.meta{{color:var(--sub);font-size:13px;padding-bottom:20px;border-bottom:1px solid var(--line)}}h2{{font-size:16px;margin:28px 0 6px;color:var(--accent)}}p{{margin:0;color:var(--sub)}}
</style></head><body><main><h1>{t}</h1><div class="meta">운Pick · 시행일 {UPDATED}</div>{body}</main></body></html>'''
    open(f'public/{k}.html','w',encoding='utf-8').write(page)
print('ok')
