import { useCallback } from 'react';

import type { TTossPaymentOptions } from '@/types/payment/TPayment';

const loadTossPaymentsScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (document.getElementById('toss-payments-script')) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.id = 'toss-payments-script';
    script.src = 'https://js.tosspayments.com/v1/payment';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('토스페이먼츠 SDK 로드 실패'));
    document.head.appendChild(script);
  });
};

export const useTossPayments = () => {
  // 사용자별 customerKey 생성 (고유)
  const generateCustomerKey = useCallback((userId?: number | string) => {
    if (userId) {
      // 로그인한 사용자: user-{userId}, 비회원은 결제 커스텀키 필요 x
      return `user-${userId}`;
    }
  }, []);

  const initializeTossPayments = useCallback(async (clientKey: string) => {
    if (!window.TossPayments) {
      await loadTossPaymentsScript();
    }
    return window.TossPayments(clientKey);
  }, []);

  const requestNaverPay = useCallback(
    async (options: TTossPaymentOptions) => {
      try {
        const tossPayments = await initializeTossPayments(options.clientKey);
        const customerKey = options.customerKey || generateCustomerKey();

        await tossPayments.requestPayment('네이버페이', {
          amount: options.amount,
          orderId: options.orderId,
          orderName: options.orderName,
          customerKey: customerKey,
          successUrl: options.successUrl,
          failUrl: options.failUrl,
        });
      } catch (error) {
        console.error('네이버페이 결제 요청 중 오류:', error);
        throw error;
      }
    },
    [initializeTossPayments, generateCustomerKey],
  );

  const requestKakaoPay = useCallback(
    async (options: TTossPaymentOptions) => {
      try {
        const tossPayments = await initializeTossPayments(options.clientKey);
        const customerKey = options.customerKey || generateCustomerKey();

        await tossPayments.requestPayment('카카오페이', {
          amount: options.amount,
          orderId: options.orderId,
          orderName: options.orderName,
          customerKey: customerKey,
          successUrl: options.successUrl,
          failUrl: options.failUrl,
        });
      } catch (error) {
        console.error('카카오페이 결제 요청 중 오류:', error);
        throw error;
      }
    },
    [initializeTossPayments, generateCustomerKey],
  );

  return {
    requestNaverPay,
    requestKakaoPay,
    generateCustomerKey,
  };
};
