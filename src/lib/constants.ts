// 송년회 설정 상수
export const YEAR_END_PARTY_CONFIG = {
  // 총 조 개수
  TEAM_COUNT: 9,

  // 조별 최대 인원수
  MEMBERS_PER_TEAM: 10,

  // 총 참가자 수
  get TOTAL_PARTICIPANTS() {
    return this.TEAM_COUNT * this.MEMBERS_PER_TEAM;
  },

  // 추첨 번호 범위 (1부터 시작)
  get LOTTERY_NUMBER_RANGE() {
    return { min: 1, max: this.TOTAL_PARTICIPANTS };
  },

  // 조 번호 범위 (1부터 시작)
  get TEAM_NUMBER_RANGE() {
    return { min: 1, max: this.TEAM_COUNT };
  },
} as const;

// QR 코드 설정
export const QR_CODE_CONFIG = {
  // QR 코드 크기
  SIZE: 256,

  // QR 코드 색상
  FG_COLOR: "#000000",
  BG_COLOR: "#FFFFFF",

  // 에러 정정 레벨
  LEVEL: "M" as const, // L, M, Q, H
} as const;

// 앱 메타 정보
export const APP_CONFIG = {
  TITLE: "송년회 2025",
  DESCRIPTION: "송년회 조 배정 및 추첨 번호 안내 서비스",
  BASE_URL: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
} as const;
