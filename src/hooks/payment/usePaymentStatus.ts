import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { usePaymentConfirm } from './usePaymentConfirm';

interface IPaymentConfirmResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: any;
}

interface IUsePaymentStatusReturn {
  isConfirming: boolean;
  confirmResult: IPaymentConfirmResponse | null;
  error: unknown;
}

export const usePaymentStatus = (): IUsePaymentStatusReturn => {
  const [searchParams] = useSearchParams();
  const [isConfirming, setIsConfirming] = useState(true);
  const [confirmResult, setConfirmResult] = useState<IPaymentConfirmResponse | null>(null);
  const [error, setError] = useState<unknown>(null);

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
      const expectedFinalAmount = sessionStorage.getItem('finalAmount');

      if (!paymentKey || !orderId || !amount) {
        setError(new Error('결제 정보가 올바르지 않습니다.'));
        setIsConfirming(false);
        return;
      }

      try {
        const response = await paymentConfirmMutation.mutateAsync({
          orderId: orderId,
          paymentKey,
          finalAmount: Number(expectedFinalAmount),
        });

        if (response.isSuccess) {
          setConfirmResult(response);
          sessionStorage.removeItem('finalAmount');
        } else {
          setError(new Error(response.message || '결제 승인에 실패했습니다.'));
        }
      } catch (err: unknown) {
        setError(err);
      } finally {
        setIsConfirming(false);
      }
    };

    confirmPayment();
  }, []);

  return {
    isConfirming,
    confirmResult,
    error,
  };
};
