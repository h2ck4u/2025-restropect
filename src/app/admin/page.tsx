'use client';

import { useState, useEffect } from 'react';
import { ParticipantInfo } from '@/types';
import { getUsageStats, createParticipantInfo, saveParticipantToStorage } from '@/utils/participant';
import { APP_CONFIG, YEAR_END_PARTY_CONFIG } from '@/lib/constants';
import Link from 'next/link';

export default function AdminPage() {
  const [stats, setStats] = useState(getUsageStats());
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshStats = () => {
    setStats(getUsageStats());
  };

  useEffect(() => {
    // 컴포넌트 마운트 시 통계 새로고침
    refreshStats();
  }, []);

  const generateTestParticipant = async () => {
    if (isGenerating) return;

    setIsGenerating(true);
    setError(null);

    try {
      const newParticipant = createParticipantInfo();
      saveParticipantToStorage(newParticipant);
      refreshStats();
    } catch (error) {
      setError(error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setIsGenerating(false);
    }
  };

  const clearAllData = () => {
    if (confirm('정말로 모든 참가자 데이터를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      localStorage.removeItem('year-end-party-participants');
      refreshStats();
      alert('모든 데이터가 삭제되었습니다.');
    }
  };

  const exportData = () => {
    const participants = JSON.parse(localStorage.getItem('year-end-party-participants') || '{}');
    const dataStr = JSON.stringify(participants, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `송년회-참가자-데이터-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                🛠️ 관리자 페이지
              </h1>
              <p className="text-gray-600">
                송년회 조 배정 시스템 관리
              </p>
            </div>
            <Link
              href="/"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
            >
              메인으로 돌아가기
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* 전체 통계 */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">📊 전체 현황</h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <div className="text-sm text-blue-600 mb-1">총 조 개수</div>
              <div className="text-3xl font-bold text-blue-800">{YEAR_END_PARTY_CONFIG.TEAM_COUNT}</div>
              <div className="text-xs text-blue-600">개</div>
            </div>

            <div className="bg-green-50 rounded-lg p-4 text-center">
              <div className="text-sm text-green-600 mb-1">전체 수용 인원</div>
              <div className="text-3xl font-bold text-green-800">{stats.totalCapacity}</div>
              <div className="text-xs text-green-600">명</div>
            </div>

            <div className="bg-purple-50 rounded-lg p-4 text-center">
              <div className="text-sm text-purple-600 mb-1">배정 완료</div>
              <div className="text-3xl font-bold text-purple-800">{stats.totalAssigned}</div>
              <div className="text-xs text-purple-600">명</div>
            </div>

            <div className="bg-orange-50 rounded-lg p-4 text-center">
              <div className="text-sm text-orange-600 mb-1">남은 자리</div>
              <div className="text-3xl font-bold text-orange-800">{stats.availableSlots}</div>
              <div className="text-xs text-orange-600">명</div>
            </div>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-300"
              style={{
                width: `${(stats.totalAssigned / stats.totalCapacity) * 100}%`
              }}
            ></div>
          </div>
          <p className="text-center text-sm text-gray-600 mt-2">
            {((stats.totalAssigned / stats.totalCapacity) * 100).toFixed(1)}% 완료
          </p>
        </div>

        {/* 조별 상세 현황 */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">👥 조별 상세 현황</h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {stats.teamStats.map((team) => (
              <div
                key={team.teamNumber}
                className={`text-center p-4 rounded-lg border-2 ${
                  team.currentCount === team.maxCount
                    ? 'bg-red-50 border-red-200'
                    : team.currentCount === 0
                    ? 'bg-gray-50 border-gray-200'
                    : 'bg-blue-50 border-blue-200'
                }`}
              >
                <div className="text-xl font-bold text-gray-800 mb-2">
                  {team.teamNumber}조
                </div>
                <div className="text-sm text-gray-600 mb-3">
                  {team.currentCount}/{team.maxCount}명
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      team.currentCount === team.maxCount
                        ? 'bg-red-500'
                        : team.currentCount === 0
                        ? 'bg-gray-300'
                        : 'bg-gradient-to-r from-blue-500 to-green-500'
                    }`}
                    style={{
                      width: `${(team.currentCount / team.maxCount) * 100}%`
                    }}
                  ></div>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {team.currentCount === team.maxCount ? '만석' :
                   team.currentCount === 0 ? '비어있음' :
                   `${team.maxCount - team.currentCount}자리 남음`}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 관리 도구 */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">⚙️ 관리 도구</h2>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm">⚠️ {error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={generateTestParticipant}
              disabled={isGenerating || stats.availableSlots === 0}
              className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                '🎲'
              )}
              {isGenerating ? '생성 중...' : '테스트 참가자 생성'}
            </button>

            <button
              onClick={refreshStats}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
            >
              🔄 통계 새로고침
            </button>

            <button
              onClick={exportData}
              className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
            >
              💾 데이터 내보내기
            </button>

            <button
              onClick={clearAllData}
              className="bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
            >
              🗑️ 모든 데이터 삭제
            </button>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-800 mb-2">사용 안내</h3>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• <strong>테스트 참가자 생성</strong>: 임의의 참가자를 생성하여 시스템을 테스트할 수 있습니다</li>
              <li>• <strong>통계 새로고침</strong>: 최신 참가자 현황을 다시 로드합니다</li>
              <li>• <strong>데이터 내보내기</strong>: 모든 참가자 데이터를 JSON 파일로 다운로드합니다</li>
              <li>• <strong>모든 데이터 삭제</strong>: localStorage의 모든 참가자 데이터를 삭제합니다 (주의!)</li>
            </ul>
          </div>
        </div>

        {/* 시스템 설정 */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">🔧 시스템 설정</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-800 mb-3">기본 설정</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">총 조 개수:</span>
                  <span className="font-medium">{YEAR_END_PARTY_CONFIG.TEAM_COUNT}개</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">조별 최대 인원:</span>
                  <span className="font-medium">{YEAR_END_PARTY_CONFIG.MEMBERS_PER_TEAM}명</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">최대 추첨 번호:</span>
                  <span className="font-medium">{YEAR_END_PARTY_CONFIG.MAX_LOTTERY_NUMBER}번</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">애플리케이션 제목:</span>
                  <span className="font-medium">{APP_CONFIG.TITLE}</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-800 mb-3">저장소 정보</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">저장 방식:</span>
                  <span className="font-medium">LocalStorage</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">저장소 키:</span>
                  <span className="font-mono text-xs">year-end-party-participants</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">데이터 지속성:</span>
                  <span className="font-medium">브라우저별</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 py-8 border-t">
        <div className="max-w-6xl mx-auto px-4 text-center text-gray-600">
          <p className="text-sm">
            송년회 2025 - 관리자 페이지
          </p>
        </div>
      </footer>
    </div>
  );
}