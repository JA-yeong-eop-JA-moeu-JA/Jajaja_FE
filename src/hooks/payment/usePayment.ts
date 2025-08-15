import { useEffect, useState } from 'react';

import type { TPaymentRequestData } from '@/types/toss/tossPayments';

import { useTossPayments } from './useTossPayments';

interface IPaymentInstance {
  requestPayment: (paymentData: TPaymentRequestData) => Promise<void>;
}

interface ITApiPaymentRequestData extends Omit<TPaymentRequestData, 'method'> {
  method: 'CARD'; // 통합 결제창
  amount: {
    currency: 'KRW';
    value: number;
  };
}

interface IUsePaymentProps {
  customerKey: string;
}

interface IUsePaymentReturn {
  payment: IPaymentInstance | null;
  isLoading: boolean;
  error: string | null;
  requestPayment: (paymentData: ITApiPaymentRequestData) => Promise<void>;
}

// 토스페이먼츠 api 개별 연동 훅
export const usePayment = ({ customerKey }: IUsePaymentProps): IUsePaymentReturn => {
  const { tossPayments, isLoading: tossLoading, error: tossError } = useTossPayments();
  const [payment, setPayment] = useState<IPaymentInstance | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializePayment = async () => {
      if (!tossPayments || tossLoading) return;

      try {
        const paymentInstance = tossPayments.payment({ customerKey });
        console.log('결제 인스턴스 생성 완료:', paymentInstance);

        setPayment(paymentInstance);
        setIsLoading(false);
      } catch (err) {
        console.error('결제 인스턴스 초기화 실패:', err);
        setError(err instanceof Error ? err.message : '결제 초기화 중 오류가 발생했습니다.');
        setIsLoading(false);
      }
    };

    if (tossPayments && !tossLoading && !payment) {
      initializePayment();
    }
  }, [tossPayments, tossLoading, customerKey, payment]);

  const requestPayment = async (paymentData: ITApiPaymentRequestData) => {
    if (!payment) {
      throw new Error('결제 시스템이 초기화되지 않았습니다.');
    }

    try {
      console.log('API 개별 연동 결제 요청 시작:', paymentData);
      await payment.requestPayment(paymentData);
    } catch (err) {
      console.error('결제 요청 실패:', err);
      throw err;
    }
  };

  return {
    payment,
    isLoading: isLoading || tossLoading,
    error: error || tossError,
    requestPayment,
  };
};
