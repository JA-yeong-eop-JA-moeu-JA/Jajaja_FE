import { useEffect, useRef, useState } from 'react';

import type { TPaymentRequestData } from '@/types/toss/tossPayments';

import type { IAgreementWidget, IPaymentMethodWidget, IPaymentWidgetInstance } from './useTossPayments';
import { useTossPayments } from './useTossPayments';

interface IUsePaymentWidgetProps {
  customerKey: string;
  amount: number;
}

interface IUsePaymentWidgetReturn {
  paymentWidget: IPaymentWidgetInstance | null;
  isLoading: boolean;
  error: string | null;
  renderPaymentMethods: (selector: string) => void;
  renderAgreement: (selector: string) => void;
  requestPayment: (paymentData: TPaymentRequestData) => Promise<void>;
}

export const usePaymentWidget = ({ customerKey, amount }: IUsePaymentWidgetProps): IUsePaymentWidgetReturn => {
  const { tossPayments, isLoading: tossLoading, error: tossError } = useTossPayments();
  const [paymentWidget, setPaymentWidget] = useState<IPaymentWidgetInstance | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const paymentMethodsRef = useRef<IPaymentMethodWidget | null>(null);
  const agreementRef = useRef<IAgreementWidget | null>(null);
  const isInitialized = useRef(false);

  useEffect(() => {
    const initializeWidget = async () => {
      if (!tossPayments || tossLoading || isInitialized.current) return;

      try {
        console.log('🔧 결제위젯 초기화 시작...');
        const widget = tossPayments.widgets({ customerKey });
        console.log('✅ 결제위젯 인스턴스 생성:', widget);

        // 결제 금액 설정
        await widget.setAmount({
          currency: 'KRW',
          value: amount,
        });
        console.log('💰 결제 금액 설정 완료:', amount);

        setPaymentWidget(widget);
        isInitialized.current = true;
      } catch (err) {
        console.error('❌ 결제위젯 초기화 실패:', err);
        setError(err instanceof Error ? err.message : '결제위젯 초기화 중 오류가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    initializeWidget();
  }, [tossPayments, tossLoading, customerKey, amount]);

  // 금액이 변경될 때 업데이트
  useEffect(() => {
    if (paymentWidget && amount > 0 && isInitialized.current) {
      paymentWidget
        .setAmount({
          currency: 'KRW',
          value: amount,
        })
        .catch((err) => {
          console.error('결제 금액 업데이트 실패:', err);
        });
    }
  }, [paymentWidget, amount]);

  const renderPaymentMethods = (selector: string) => {
    if (!paymentWidget) {
      console.error('결제위젯이 초기화되지 않았습니다.');
      return;
    }

    try {
      console.log('🔄 결제 수단 렌더링 시작, 셀렉터:', selector);

      // DOM 요소 존재 확인
      const element = document.querySelector(selector);
      if (!element) {
        throw new Error(`셀렉터 '${selector}'에 해당하는 요소를 찾을 수 없습니다.`);
      }

      // 기존 렌더링된 결제 수단이 있다면 정리
      if (paymentMethodsRef.current && typeof paymentMethodsRef.current.destroy === 'function') {
        console.log('🗑️ 기존 결제 수단 정리');
        paymentMethodsRef.current.destroy();
      }

      // 실제 토스페이먼츠 SDK 호출
      const paymentMethods = paymentWidget.renderPaymentMethods({
        selector,
        variantKey: 'DEFAULT',
      });

      console.log('✅ 결제 수단 렌더링 성공:', paymentMethods);

      // destroy 메서드가 있는 경우에만 저장
      if (paymentMethods && typeof paymentMethods.destroy === 'function') {
        paymentMethodsRef.current = paymentMethods;
      } else {
        console.log('⚠️ 결제 수단 객체에 destroy 메서드가 없습니다.');
        paymentMethodsRef.current = null;
      }
    } catch (err) {
      console.error('❌ 결제 수단 렌더링 실패:', err);
      setError(err instanceof Error ? err.message : '결제 수단 렌더링 중 오류가 발생했습니다.');
    }
  };

  const renderAgreement = (selector: string) => {
    if (!paymentWidget) {
      console.error('결제위젯이 초기화되지 않았습니다.');
      return;
    }

    try {
      console.log('🔄 약관 렌더링 시작, 셀렉터:', selector);

      // DOM 요소 존재 확인
      const element = document.querySelector(selector);
      if (!element) {
        throw new Error(`셀렉터 '${selector}'에 해당하는 요소를 찾을 수 없습니다.`);
      }

      // 기존 렌더링된 약관이 있다면 정리
      if (agreementRef.current && typeof agreementRef.current.destroy === 'function') {
        console.log('🗑️ 기존 약관 정리');
        agreementRef.current.destroy();
      }

      // 실제 토스페이먼츠 SDK 호출
      const agreement = paymentWidget.renderAgreement({
        selector,
        variantKey: 'DEFAULT',
      });

      console.log('✅ 약관 렌더링 성공:', agreement);

      // destroy 메서드가 있는 경우에만 저장
      if (agreement && typeof agreement.destroy === 'function') {
        agreementRef.current = agreement;
      } else {
        console.log('⚠️ 약관 객체에 destroy 메서드가 없습니다.');
        agreementRef.current = null;
      }
    } catch (err) {
      console.error('❌ 약관 렌더링 실패:', err);
      setError(err instanceof Error ? err.message : '약관 렌더링 중 오류가 발생했습니다.');
    }
  };

  const requestPayment = async (paymentData: TPaymentRequestData) => {
    if (!paymentWidget) {
      throw new Error('결제위젯이 초기화되지 않았습니다.');
    }

    try {
      console.log('💳 결제 요청 시작:', paymentData);
      await paymentWidget.requestPayment(paymentData);
    } catch (err) {
      console.error('❌ 결제 요청 실패:', err);
      throw err;
    }
  };

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      if (paymentMethodsRef.current && typeof paymentMethodsRef.current.destroy === 'function') {
        paymentMethodsRef.current.destroy();
      }
      if (agreementRef.current && typeof agreementRef.current.destroy === 'function') {
        agreementRef.current.destroy();
      }
    };
  }, []);

  return {
    paymentWidget,
    isLoading: isLoading || tossLoading,
    error: error || tossError,
    renderPaymentMethods,
    renderAgreement,
    requestPayment,
  };
};
