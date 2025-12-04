"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { ParticipantInfo } from "@/types";
import { getParticipantFromStorage } from "@/utils/participant";
import { APP_CONFIG } from "@/lib/constants";
import Link from "next/link";

export default function ParticipantPage() {
  const params = useParams();
  const participantId = params.id as string | undefined;
  let error: string | null = null;
  let participant: ParticipantInfo | null = null;

  if (!participantId) {
    error = "잘못된 참가자 ID입니다.";
  } else {
    const participantData = getParticipantFromStorage(participantId);
    if (participantData) {
      participant = participantData;
    } else {
      error =
        "참가자 정보를 찾을 수 없습니다. QR 코드가 유효한지 확인해 주세요.";
    }
  }

  if (error || !participant)
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center max-w-md w-full">
          <div className="text-6xl mb-4">😕</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            정보를 찾을 수 없습니다
          </h1>
          <p className="text-gray-600 mb-6">
            {error || "참가자 정보를 찾을 수 없습니다."}
          </p>
          <Link
            href="/"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 inline-block">
            메인으로 돌아가기
          </Link>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
              🎉 {APP_CONFIG.TITLE} 🎉
            </h1>
            <p className="text-gray-600">참가자 정보 조회</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* 성공 메시지 */}
          <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white text-center py-6">
            <div className="text-4xl mb-2">✅</div>
            <h2 className="text-2xl font-bold mb-2">정상 확인되었습니다!</h2>
            <p className="text-blue-100">아래 정보를 확인해 주세요</p>
          </div>

          {/* 참가자 정보 */}
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {/* 조 번호 */}
              <div className="text-center bg-blue-50 rounded-lg p-6">
                <div className="text-sm text-blue-600 mb-2 font-medium">
                  조 번호
                </div>
                <div className="text-6xl font-bold text-blue-800 mb-2">
                  {participant.teamNumber}
                </div>
                <div className="text-lg font-medium text-blue-700">조</div>
              </div>

              {/* 추첨 번호 */}
              <div className="text-center bg-green-50 rounded-lg p-6">
                <div className="text-sm text-green-600 mb-2 font-medium">
                  추첨 번호
                </div>
                <div className="text-6xl font-bold text-green-800 mb-2">
                  {participant.lotteryNumber}
                </div>
                <div className="text-lg font-medium text-green-700">번</div>
              </div>
            </div>

            {/* 추가 정보 */}
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-medium text-gray-800 mb-4">
                추가 정보
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">참가자 ID:</span>
                  <span className="font-mono text-gray-800">
                    {participant.id.slice(0, 8)}...
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">배정 일시:</span>
                  <span className="text-gray-800">
                    {new Date(participant.createdAt).toLocaleString("ko-KR")}
                  </span>
                </div>
              </div>
            </div>

            {/* 안내 메시지 */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <h3 className="font-medium text-yellow-800 mb-2">📋 안내사항</h3>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• 송년회 당일에 위 정보를 참고해 주세요</li>
                <li>• 조 번호에 따라 좌석 배치가 이루어집니다</li>
                <li>• 추첨 번호는 경품 추첨 시 사용됩니다</li>
                <li>
                  • 이 페이지의 링크를 저장해두시면 언제든 확인 가능합니다
                </li>
              </ul>
            </div>

            {/* 액션 버튼 */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/"
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 text-center">
                메인으로 돌아가기
              </Link>

              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator
                      .share({
                        title: `${APP_CONFIG.TITLE} - 참가자 정보`,
                        text: `조 번호: ${participant.teamNumber}조, 추첨 번호: ${participant.lotteryNumber}번`,
                        url: window.location.href,
                      })
                      .catch(console.error);
                  } else {
                    // fallback: 클립보드에 URL 복사
                    navigator.clipboard
                      .writeText(window.location.href)
                      .then(() => {
                        alert("링크가 클립보드에 복사되었습니다.");
                      })
                      .catch(() => {
                        alert("링크 복사에 실패했습니다.");
                      });
                  }
                }}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 text-center">
                링크 공유하기
              </button>
            </div>
          </div>
        </div>

        {/* QR 코드 재생성 안내 */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600 mb-4">
            QR 코드를 다시 생성하고 싶으신가요?
          </p>
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-700 font-medium text-sm underline">
            새로운 QR 코드 생성하러 가기
          </Link>
        </div>
      </main>
    </div>
  );
}
