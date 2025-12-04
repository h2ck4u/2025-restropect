// 참가자 정보 타입
export interface ParticipantInfo {
  id: string;           // 고유 식별자 (UUID)
  teamNumber: number;   // 조 번호 (1부터 시작)
  lotteryNumber: number; // 추첨 번호 (1부터 시작)
  createdAt: Date;      // 생성 시간
}

// QR 코드 데이터 타입
export interface QRCodeData {
  participantId: string;
  teamNumber: number;
  lotteryNumber: number;
}

// API 응답 타입
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
}

// URL 파라미터 타입
export interface ParticipantParams {
  id: string;
}