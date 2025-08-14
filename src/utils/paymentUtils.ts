import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { usePaymentConfirm } from '@/hooks/payment/usePaymentConfirm';

interface IPaymentConfirmResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    orderId: string;
    orderName: string;
    status: string;
  };
}

export const generateCustomerKey = (userId?: string): string => {
  const randomId = crypto.randomUUID().substring(0, 8);
  if (userId) {
    return `customer_${userId}_${randomId}`;
  }
  return `guest_${randomId}`;
};

export const calculateFinalAmount = (originalAmount: number, discount: number = 0, pointsUsed: number = 0, shippingFee: number = 0): number => {
  const finalAmount = originalAmount - discount - pointsUsed + shippingFee;
  return Math.max(0, finalAmount);
};

/**
 * 한국 휴대폰 번호 유효성 검사 (010시작, 10~11자리)
 */
export const validatePhoneNumber = (phone: string): boolean => {
  if (!phone) return false;
  const onlyNumbers = phone.replace(/\D/g, '');
  return /^01\d{8,9}$/.test(onlyNumbers);
};

/**
 * Toss 결제용 전화번호 포맷팅
 */
export const formatPhoneNumberForToss = (phone: string | null | undefined): string => {
  if (!phone) return '';

  let onlyNumbers = phone.replace(/\D/g, '');

  if (onlyNumbers.startsWith('82')) {
    onlyNumbers = '0' + onlyNumbers.slice(2);
  }

  if (onlyNumbers.length < 10 || onlyNumbers.length > 11) {
    console.warn('전화번호 길이가 Toss 요구사항과 다릅니다:', onlyNumbers);
  }

  return onlyNumbers;
};

interface IUsePaymentStatusReturn {
  isConfirming: boolean;
  confirmResult: IPaymentConfirmResponse | null;
  error: string | null;
}

export const usePaymentStatus = (): IUsePaymentStatusReturn => {
  const [searchParams] = useSearchParams();
  const [isConfirming, setIsConfirming] = useState(true);
  const [confirmResult, setConfirmResult] = useState<IPaymentConfirmResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const paymentConfirmMutation = usePaymentConfirm();

  const didEffectRun = useRef(false);

  useEffect(() => {
    if (didEffectRun.current) {
      return;
    }
    didEffectRun.current = true;

    const confirmPayment = async () => {
      const paymentKey = searchParams.get('paymentKey');
      const orderId = searchParams.get('orderId');
      const amount = searchParams.get('amount');

      if (!paymentKey || !orderId || !amount) {
        setError('결제 정보가 올바르지 않습니다.');
        setIsConfirming(false);
        return;
      }

      try {
        console.log('결제 확인 요청 (백엔드 금액 사용):', {
          orderId,
          paymentKey,
          finalAmount: Number(amount),
        });

        const response = await paymentConfirmMutation.mutateAsync({
          orderId,
          paymentKey,
          finalAmount: Number(amount),
        });

        if (response.isSuccess) {
          setConfirmResult(response);
          console.log('결제 확인 완료:', response);
        } else {
          setError(response.message || '결제 승인에 실패했습니다.');
        }
      } catch (err) {
        console.error('결제 승인 요청 실패:', err);
        setError('결제 승인 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      } finally {
        setIsConfirming(false);
      }
    };

    confirmPayment();
  }, []);

  return {
    isConfirming: isConfirming || paymentConfirmMutation.isPending,
    confirmResult,
    error,
  };
};
