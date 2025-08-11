// hooks/useTossPayments.ts (디버깅 버전)
import { useEffect, useState } from 'react';

// 전역 window 객체에 토스페이먼츠 추가
declare global {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  interface Window {
    TossPayments: (clientKey: string) => ITossPaymentsInstance;
  }
}

interface ITossPaymentsInstance {
  widgets: (options: { customerKey: string }) => IPaymentWidgetInstance;
  payment: (options: { customerKey: string }) => IPaymentInstance;
}

interface IPaymentWidgetInstance {
  setAmount: (amount: { currency: string; value: number }) => Promise<void>;
  renderPaymentMethods: (options: { selector: string; variantKey?: string }) => IPaymentMethodWidget;
  renderAgreement: (options: { selector: string; variantKey?: string }) => IAgreementWidget;
  requestPayment: (paymentData: any) => Promise<void>;
}

interface IPaymentMethodWidget {
  on: (eventName: string, callback: (data: any) => void) => void;
  getSelectedPaymentMethod: () => any;
  destroy: () => void;
}

interface IAgreementWidget {
  on: (eventName: string, callback: (data: any) => void) => void;
  destroy: () => void;
}

interface IPaymentInstance {
  requestPayment: (paymentData: any) => Promise<void>;
}

interface IUseTossPaymentsReturn {
  tossPayments: ITossPaymentsInstance | null;
  isLoading: boolean;
  error: string | null;
}

export const useTossPayments = (): IUseTossPaymentsReturn => {
  const [tossPayments, setTossPayments] = useState<ITossPaymentsInstance | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeTossPayments = () => {
      try {
        console.log('🔍 토스페이먼츠 초기화 시작...');

        const clientKey = import.meta.env.VITE_TOSS_CLIENT_KEY;
        console.log('🔑 클라이언트 키:', clientKey ? '설정됨' : '설정되지 않음');

        if (!clientKey) {
          throw new Error('토스페이먼츠 클라이언트 키가 설정되지 않았습니다.');
        }

        // window.TossPayments 존재 여부 확인
        console.log('🌐 window.TossPayments 존재:', !!window.TossPayments);

        if (window.TossPayments) {
          console.log('✅ 토스페이먼츠 SDK 로드됨, 초기화 중...');
          const toss = window.TossPayments(clientKey);
          console.log('🎉 토스페이먼츠 인스턴스 생성 완료:', toss);
          setTossPayments(toss);
        } else {
          throw new Error('토스페이먼츠 SDK가 로드되지 않았습니다. Script 태그를 확인해주세요.');
        }
      } catch (err) {
        console.error('❌ 토스페이먼츠 초기화 실패:', err);
        setError(err instanceof Error ? err.message : '토스페이먼츠 초기화 중 오류가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    // 즉시 확인
    console.log('🚀 초기화 시작 - window.TossPayments:', !!window.TossPayments);

    if (window.TossPayments) {
      initializeTossPayments();
    } else {
      console.log('⏳ 토스페이먼츠 SDK 로딩 대기 중...');

      // Script가 아직 로드되지 않았다면 잠시 기다림
      let attempts = 0;
      const maxAttempts = 50; // 5초간 대기

      const checkTossPayments = setInterval(() => {
        attempts++;
        console.log(`🔄 SDK 로딩 확인 시도 ${attempts}/${maxAttempts}`);

        if (window.TossPayments) {
          console.log('✅ SDK 로드 완료!');
          clearInterval(checkTossPayments);
          initializeTossPayments();
        } else if (attempts >= maxAttempts) {
          console.error('❌ SDK 로드 시간 초과');
          clearInterval(checkTossPayments);
          setError('토스페이먼츠 SDK 로드 시간이 초과되었습니다. Script 태그를 확인해주세요.');
          setIsLoading(false);
        }
      }, 100);

      // 컴포넌트 언마운트 시 정리
      return () => {
        clearInterval(checkTossPayments);
      };
    }
  }, []);

  return { tossPayments, isLoading, error };
};

// 타입 export
export type { IAgreementWidget, IPaymentMethodWidget, IPaymentWidgetInstance, ITossPaymentsInstance };
