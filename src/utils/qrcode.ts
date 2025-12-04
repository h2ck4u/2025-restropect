import { QRCodeData } from '@/types';

/**
 * QR 코드 데이터를 JSON 문자열로 인코딩
 */
export function encodeQRData(data: QRCodeData): string {
  return JSON.stringify(data);
}

/**
 * QR 코드 데이터를 JSON 문자열에서 디코딩
 */
export function decodeQRData(encodedData: string): QRCodeData | null {
  try {
    const data = JSON.parse(encodedData) as QRCodeData;

    // 유효성 검증
    if (
      typeof data.participantId === 'string' &&
      typeof data.teamNumber === 'number' &&
      typeof data.lotteryNumber === 'number' &&
      data.participantId.length > 0 &&
      data.teamNumber > 0 &&
      data.lotteryNumber > 0
    ) {
      return data;
    }

    return null;
  } catch (error) {
    console.error('Failed to decode QR data:', error);
    return null;
  }
}

/**
 * QR 코드를 이미지로 다운로드
 */
export function downloadQRCode(element: HTMLElement, filename: string = 'qr-code.png'): void {
  try {
    // SVG 요소 찾기
    const svgElement = element.querySelector('svg');
    if (!svgElement) {
      throw new Error('QR 코드 SVG를 찾을 수 없습니다.');
    }

    // SVG를 문자열로 변환
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });

    // Canvas를 사용해서 PNG로 변환
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;

      // 흰색 배경 추가
      ctx!.fillStyle = 'white';
      ctx!.fillRect(0, 0, canvas.width, canvas.height);

      // SVG 이미지 그리기
      ctx!.drawImage(img, 0, 0);

      // PNG로 다운로드
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = filename;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }
      }, 'image/png');
    };

    img.onerror = () => {
      throw new Error('이미지 로딩에 실패했습니다.');
    };

    // SVG를 Data URL로 변환
    const url = URL.createObjectURL(svgBlob);
    img.src = url;
  } catch (error) {
    console.error('QR 코드 다운로드 실패:', error);
    alert(`QR 코드 다운로드에 실패했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
  }
}

/**
 * QR 코드를 클립보드에 복사
 */
export async function copyQRCodeToClipboard(element: HTMLElement): Promise<void> {
  try {
    const svgElement = element.querySelector('svg');
    if (!svgElement) {
      throw new Error('QR 코드 SVG를 찾을 수 없습니다.');
    }

    // SVG를 Canvas로 변환
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    return new Promise((resolve, reject) => {
      img.onload = async () => {
        canvas.width = img.width;
        canvas.height = img.height;

        // 흰색 배경 추가
        ctx!.fillStyle = 'white';
        ctx!.fillRect(0, 0, canvas.width, canvas.height);

        // SVG 이미지 그리기
        ctx!.drawImage(img, 0, 0);

        // Canvas를 Blob으로 변환
        canvas.toBlob(async (blob) => {
          if (blob) {
            try {
              const item = new ClipboardItem({ 'image/png': blob });
              await navigator.clipboard.write([item]);
              resolve();
            } catch (error) {
              reject(new Error('클립보드에 복사할 수 없습니다.'));
            }
          } else {
            reject(new Error('이미지 생성에 실패했습니다.'));
          }
        }, 'image/png');
      };

      img.onerror = () => reject(new Error('이미지 로딩에 실패했습니다.'));

      // SVG를 Data URL로 변환
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);
      img.src = url;
    });
  } catch (error) {
    throw new Error(`클립보드 복사 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
  }
}