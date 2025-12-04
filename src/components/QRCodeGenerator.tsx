'use client';

import { useState, useRef } from 'react';
import QRCode from 'react-qr-code';
import { ParticipantInfo } from '@/types';
import { QR_CODE_CONFIG } from '@/lib/constants';
import { downloadQRCode, copyQRCodeToClipboard } from '@/utils/qrcode';
import { generateParticipantUrl } from '@/utils/participant';

interface QRCodeGeneratorProps {
  participant: ParticipantInfo;
  className?: string;
}

export default function QRCodeGenerator({ participant, className = '' }: QRCodeGeneratorProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isCopying, setIsCopying] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

  const qrValue = generateParticipantUrl(participant.id);

  const handleDownload = async () => {
    if (!qrRef.current || isDownloading) return;

    setIsDownloading(true);
    try {
      const filename = `송년회-QR코드-${participant.id.slice(0, 8)}.png`;
      downloadQRCode(qrRef.current, filename);
    } catch (error) {
      console.error('Download failed:', error);
      alert('다운로드에 실패했습니다. 다시 시도해 주세요.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCopyToClipboard = async () => {
    if (!qrRef.current || isCopying) return;

    setIsCopying(true);
    try {
      await copyQRCodeToClipboard(qrRef.current);
      alert('QR 코드가 클립보드에 복사되었습니다.');
    } catch (error) {
      console.error('Copy failed:', error);
      alert('클립보드 복사에 실패했습니다. 다시 시도해 주세요.');
    } finally {
      setIsCopying(false);
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
      {/* QR 코드 */}
      <div className="flex justify-center mb-6">
        <div
          ref={qrRef}
          className="p-4 bg-white rounded-lg border-2 border-gray-200"
          style={{ width: 'fit-content' }}
        >
          <QRCode
            value={qrValue}
            size={QR_CODE_CONFIG.SIZE}
            fgColor={QR_CODE_CONFIG.FG_COLOR}
            bgColor={QR_CODE_CONFIG.BG_COLOR}
            level={QR_CODE_CONFIG.LEVEL}
          />
        </div>
      </div>

      {/* QR 코드 설명 */}
      <div className="text-center space-y-3 mb-6">
        <h2 className="text-xl font-semibold text-gray-800">개인 QR 코드</h2>
        <p className="text-sm text-gray-600">
          QR 코드를 스캔하면 조 번호와 추첨 번호를 확인할 수 있습니다
        </p>
        <div className="text-xs text-gray-500">
          ID: {participant.id.slice(0, 8)}...
        </div>
      </div>

      {/* 액션 버튼 */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
        >
          {isDownloading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            </svg>
          )}
          {isDownloading ? '다운로드 중...' : 'PNG로 다운로드'}
        </button>

        <button
          onClick={handleCopyToClipboard}
          disabled={isCopying}
          className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
        >
          {isCopying ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          )}
          {isCopying ? '복사 중...' : '클립보드에 복사'}
        </button>
      </div>

      {/* 사용 안내 */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-sm font-medium text-gray-800 mb-2">사용 안내</h3>
        <ul className="text-xs text-gray-600 space-y-1">
          <li>• QR 코드를 스캔하거나 링크로 접속하면 조 번호와 추첨 번호를 확인할 수 있습니다</li>
          <li>• QR 코드는 저장하거나 출력해서 송년회 당일에 활용하세요</li>
          <li>• 동일한 QR 코드로는 항상 같은 정보가 표시됩니다</li>
        </ul>
      </div>
    </div>
  );
}