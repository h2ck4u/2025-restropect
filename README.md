# 송년회 2025 - QR 코드 조 배정 시스템

송년회를 위한 QR 코드 기반 조 배정 및 추첨 번호 관리 웹 서비스입니다.

## 🎯 주요 기능

- **자동 조 배정**: 랜덤하게 조 번호와 추첨 번호 자동 배정
- **QR 코드 생성**: 참가자 정보가 포함된 QR 코드 생성
- **QR 코드 다운로드**: PNG 형식으로 QR 코드 다운로드 및 클립보드 복사
- **정보 조회**: QR 코드 스캔 시 조 번호 및 추첨 번호 확인
- **반응형 디자인**: 데스크탑, 태블릿, 모바일 모든 기기에서 최적화
- **데이터 영속성**: localStorage를 통한 정보 저장으로 재접속 시에도 동일 정보 유지

## 🛠 기술 스택

- **Frontend**: Next.js 16 (React 기반)
- **언어**: TypeScript
- **스타일링**: Tailwind CSS
- **QR 코드**: react-qr-code
- **기타**: UUID 생성, localStorage

## 📦 설정

### 기본 설정 (src/lib/constants.ts)

```typescript
export const YEAR_END_PARTY_CONFIG = {
  TEAM_COUNT: 6,                    // 총 조 개수
  MEMBERS_PER_TEAM: 5,              // 조별 최대 인원수
  // 총 30명까지 참가 가능 (6조 × 5명)
}
```

설정을 변경하려면 `src/lib/constants.ts` 파일의 값들을 수정하면 됩니다.

## 🚀 실행 방법

### 개발 환경 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

개발 서버가 실행되면 http://localhost:3000 에서 확인할 수 있습니다.

### 프로덕션 빌드

```bash
# 빌드
npm run build

# 프로덕션 서버 실행
npm start
```

## 📱 사용 방법

### 1. 조 배정 받기
- 메인 페이지에서 "조 배정 받기" 버튼 클릭
- 자동으로 조 번호와 추첨 번호가 배정됨
- QR 코드가 생성됨

### 2. QR 코드 저장
- "PNG로 다운로드" 버튼으로 이미지 파일 저장
- "클립보드에 복사" 버튼으로 이미지 복사

### 3. QR 코드 조회
- QR 코드를 스캔하거나 링크를 직접 접속
- 배정된 조 번호와 추첨 번호 확인
- 동일한 링크로 재접속 시에도 같은 정보 표시

## 🏗 프로젝트 구조

```
src/
├── app/                      # Next.js App Router
│   ├── layout.tsx           # 레이아웃 컴포넌트
│   ├── page.tsx             # 메인 페이지
│   └── participant/[id]/    # 참가자 정보 조회 페이지
├── components/              # React 컴포넌트
│   └── QRCodeGenerator.tsx  # QR 코드 생성 컴포넌트
├── lib/                     # 라이브러리 및 설정
│   └── constants.ts         # 앱 설정 상수
├── types/                   # TypeScript 타입 정의
│   └── index.ts
└── utils/                   # 유틸리티 함수
    ├── participant.ts       # 참가자 관리 함수
    └── qrcode.ts           # QR 코드 관련 함수
```

## ⚙️ 배포

### Vercel 배포

1. Vercel 계정에 로그인
2. GitHub 저장소를 Vercel에 연결
3. 자동 배포 설정 완료

### Netlify 배포

1. `npm run build` 명령어로 빌드
2. `out` 폴더를 Netlify에 업로드

## 🔧 커스터마이징

### 조 개수 및 인원수 변경

`src/lib/constants.ts`에서 아래 값들을 수정:

```typescript
export const YEAR_END_PARTY_CONFIG = {
  TEAM_COUNT: 8,        // 8개 조로 변경
  MEMBERS_PER_TEAM: 6,  // 조별 6명으로 변경
}
```

### 디자인 색상 변경

`src/app/page.tsx` 및 `src/components/QRCodeGenerator.tsx`에서 Tailwind CSS 클래스를 수정하여 색상 변경 가능

### QR 코드 설정 변경

`src/lib/constants.ts`에서 QR 코드 관련 설정 변경:

```typescript
export const QR_CODE_CONFIG = {
  SIZE: 512,            // 크기 변경
  FG_COLOR: '#000000',  // 전경색 변경
  BG_COLOR: '#FFFFFF',  // 배경색 변경
  LEVEL: 'H',           // 에러 정정 레벨 변경 (L, M, Q, H)
}
```

## 📝 주의사항

- 브라우저의 localStorage를 사용하여 데이터를 저장하므로, 브라우저 데이터 삭제 시 정보가 사라질 수 있습니다.
- 실제 운영 환경에서는 백엔드 데이터베이스 연동을 권장합니다.
- QR 코드 다운로드 기능은 최신 브라우저에서만 지원됩니다.

## 📄 라이선스

이 프로젝트는 MIT 라이선스를 따릅니다.

## 🤝 기여하기

1. 이 저장소를 Fork
2. 기능 브랜치 생성 (`git checkout -b feature/amazing-feature`)
3. 변경사항 커밋 (`git commit -m 'Add some amazing feature'`)
4. 브랜치에 Push (`git push origin feature/amazing-feature`)
5. Pull Request 생성

## 📞 문의

프로젝트 관련 문의사항이 있으시면 이슈를 생성해 주세요.
