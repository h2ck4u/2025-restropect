'use client';

import { useState, useEffect } from 'react';
import { ParticipantInfo } from '@/types';
import { createParticipantInfo, saveParticipantToStorage, getUsageStats } from '@/utils/participant';
import { APP_CONFIG, YEAR_END_PARTY_CONFIG } from '@/lib/constants';
import QRCodeGenerator from '@/components/QRCodeGenerator';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [participant, setParticipant] = useState<ParticipantInfo | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // 관리자 페이지 접근을 위한 키보드 단축키 (Ctrl+Shift+A)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.shiftKey && event.key === 'A') {
        event.preventDefault();
        router.push('/admin');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [router]);

  // 컴포넌트 마운트 시 자동으로 QR 코드 생성
  useEffect(() => {
    generateNewParticipant();
  }, []);

  const generateNewParticipant = async () => {
    if (isGenerating) return;

    setIsGenerating(true);
    setError(null);

    try {
      const stats = getUsageStats();
      if (stats.availableSlots === 0) {
        throw new Error('모든 자리가 찼습니다. 관리자에게 문의하세요.');
      }

      const newParticipant = createParticipantInfo();
      setParticipant(newParticipant);
      saveParticipantToStorage(newParticipant);
    } catch (error) {
      setError(error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setIsGenerating(false);
    }
  };

  const resetAndGenerate = () => {
    setParticipant(null);
    setError(null);
    generateNewParticipant();
  };

  if (isGenerating && !participant) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">QR 코드 생성 중...</h1>
          <p className="text-gray-600">잠시만 기다려 주세요</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center max-w-md w-full">
          <div className="text-6xl mb-4">😕</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            오류가 발생했습니다
          </h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-y-3">
            <button
              onClick={resetAndGenerate}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
            >
              다시 시도하기
            </button>
            {/* 관리자 페이지 링크는 공개 디스플레이에서 숨김 */}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
              🎉 {APP_CONFIG.TITLE} 🎉
            </h1>
            <p className="text-gray-600">
              아래 QR 코드를 스캔하여 조 정보를 확인하세요
            </p>
          </div>
        </div>
      </header>

      {/* QR Code Section */}
      <main className="max-w-2xl mx-auto px-4 py-8">
        {participant && (
          <div className="space-y-6">
            <div className="flex justify-center">
              <QRCodeGenerator
                participant={participant}
                className="w-full max-w-md"
              />
            </div>

            <div className="text-center space-y-4">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4">QR 코드 사용법</h2>
                <div className="text-sm text-gray-600 space-y-2 text-left">
                  <p>📱 <strong>스마트폰 카메라</strong>로 QR 코드를 스캔하세요</p>
                  <p>🔍 링크를 클릭하면 <strong>조 번호와 추첨 번호</strong>가 표시됩니다</p>
                  <p>💾 QR 코드를 <strong>저장</strong>하여 송년회 당일 활용하세요</p>
                  <p>🎉 추첨 번호로 <strong>경품 추첨</strong>에 참여할 수 있습니다</p>
                </div>
              </div>

              <div className="flex justify-center">
                <button
                  onClick={resetAndGenerate}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg transition-colors duration-200"
                >
                  새로운 QR 코드 생성
                </button>
                {/* 관리자 페이지 링크는 공개 디스플레이에서 숨김 */}
              </div>
              <p className="text-xs text-gray-500">
                ⚠️ 새로운 QR 코드를 생성하면 이전 정보는 사라집니다.
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 text-center text-gray-600">
          <p className="text-sm">
            송년회 2025 - QR 코드 기반 조 배정 시스템
          </p>
        </div>
      </footer>
    </div>
  );
}
