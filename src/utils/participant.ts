import { v4 as uuidv4 } from "uuid";
import { ParticipantInfo } from "@/types";
import { YEAR_END_PARTY_CONFIG } from "@/lib/constants";

/**
 * localStorage에서 참가자 정보 저장/조회
 */
const STORAGE_KEY = "year-end-party-participants";

/**
 * localStorage에서 기존 참가자 데이터 불러오기
 */
function getExistingParticipants(): Record<string, ParticipantInfo> {
  if (typeof window === "undefined") return {};

  try {
    const existingData = localStorage.getItem(STORAGE_KEY);
    return existingData ? JSON.parse(existingData) : {};
  } catch (error) {
    console.error("Failed to load existing participants:", error);
    return {};
  }
}

/**
 * 기존 참가자들의 사용된 번호 추출
 */
function getUsedNumbers() {
  const participants = getExistingParticipants();
  const usedTeamNumbers = new Set<number>();
  const usedLotteryNumbers = new Set<number>();

  Object.values(participants).forEach((participant) => {
    usedTeamNumbers.add(participant.teamNumber);
    usedLotteryNumbers.add(participant.lotteryNumber);
  });

  return { usedTeamNumbers, usedLotteryNumbers };
}

/**
 * 랜덤 숫자 생성 (범위 내에서 중복되지 않음)
 */
function generateRandomNumber(
  min: number,
  max: number,
  usedNumbers: Set<number>
): number {
  const available = [];
  for (let i = min; i <= max; i++) {
    if (!usedNumbers.has(i)) {
      available.push(i);
    }
  }

  if (available.length === 0) {
    throw new Error("사용 가능한 번호가 없습니다.");
  }

  const randomIndex = Math.floor(Math.random() * available.length);
  return available[randomIndex];
}

/**
 * 새로운 참가자 정보 생성
 */
export function createParticipantInfo(): ParticipantInfo {
  const id = uuidv4();

  // 기존 참가자 정보 가져오기
  const { usedTeamNumbers, usedLotteryNumbers } = getUsedNumbers();

  // 조별 인원 제한 체크
  if (usedTeamNumbers.size >= YEAR_END_PARTY_CONFIG.TOTAL_PARTICIPANTS) {
    throw new Error("모든 자리가 찼습니다.");
  }

  let teamNumber: number;
  let lotteryNumber: number;

  try {
    // 조 번호 생성 (각 조마다 정해진 인원수까지만 가능)
    const availableTeams = [];
    const existingParticipants = Object.values(getExistingParticipants());

    for (let team = 1; team <= YEAR_END_PARTY_CONFIG.TEAM_COUNT; team++) {
      const currentTeamCount = existingParticipants.filter(
        (p) => p.teamNumber === team
      ).length;

      if (currentTeamCount < YEAR_END_PARTY_CONFIG.MEMBERS_PER_TEAM) {
        availableTeams.push(team);
      }
    }

    if (availableTeams.length === 0) {
      throw new Error("모든 조가 찼습니다.");
    }

    teamNumber =
      availableTeams[Math.floor(Math.random() * availableTeams.length)];

    // 추첨 번호 생성 (1부터 총 참가자 수까지 중복되지 않음)
    lotteryNumber = generateRandomNumber(
      YEAR_END_PARTY_CONFIG.LOTTERY_NUMBER_RANGE.min,
      YEAR_END_PARTY_CONFIG.LOTTERY_NUMBER_RANGE.max,
      usedLotteryNumbers
    );

    const participant: ParticipantInfo = {
      id,
      teamNumber,
      lotteryNumber,
      createdAt: new Date(),
    };
    return participant;
  } catch (error) {
    throw new Error(
      `참가자 정보 생성 실패: ${
        error instanceof Error ? error.message : "알 수 없는 오류"
      }`
    );
  }
}

/**
 * QR 코드에서 사용할 URL 생성
 */
export function generateParticipantUrl(participantId: string): string {
  const baseUrl =
    typeof window !== "undefined"
      ? `${window.location.protocol}//${window.location.host}`
      : process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  return `${baseUrl}/participant/${participantId}`;
}

export function saveParticipantToStorage(participant: ParticipantInfo): void {
  if (typeof window === "undefined") return;

  try {
    const existingData = localStorage.getItem(STORAGE_KEY);
    const participants: Record<string, ParticipantInfo> = existingData
      ? JSON.parse(existingData)
      : {};

    participants[participant.id] = participant;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(participants));
  } catch (error) {
    console.error("Failed to save participant to storage:", error);
  }
}

export function getParticipantFromStorage(id: string): ParticipantInfo | null {
  if (typeof window === "undefined") return null;

  try {
    const existingData = localStorage.getItem(STORAGE_KEY);
    if (!existingData) return null;

    const participants: Record<string, ParticipantInfo> =
      JSON.parse(existingData);
    const participant = participants[id];

    if (participant) {
      // Date 객체로 복원
      participant.createdAt = new Date(participant.createdAt);
      return participant;
    }

    return null;
  } catch (error) {
    console.error("Failed to get participant from storage:", error);
    return null;
  }
}

/**
 * 현재 사용 통계 조회
 */
export function getUsageStats() {
  const existingParticipants = Object.values(getExistingParticipants());

  return {
    totalAssigned: existingParticipants.length,
    totalCapacity: YEAR_END_PARTY_CONFIG.TOTAL_PARTICIPANTS,
    availableSlots:
      YEAR_END_PARTY_CONFIG.TOTAL_PARTICIPANTS - existingParticipants.length,
    teamStats: Array.from(
      { length: YEAR_END_PARTY_CONFIG.TEAM_COUNT },
      (_, i) => {
        const teamNumber = i + 1;
        const currentTeamCount = existingParticipants.filter(
          (p) => p.teamNumber === teamNumber
        ).length;

        return {
          teamNumber,
          currentCount: currentTeamCount,
          maxCount: YEAR_END_PARTY_CONFIG.MEMBERS_PER_TEAM,
          available: YEAR_END_PARTY_CONFIG.MEMBERS_PER_TEAM - currentTeamCount,
        };
      }
    ),
  };
}
