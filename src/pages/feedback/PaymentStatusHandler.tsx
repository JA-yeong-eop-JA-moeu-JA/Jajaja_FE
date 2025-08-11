import { useEffect, useState } from 'react';
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

  const paymentKey = searchParams.get('paymentKey');
  const orderId = searchParams.get('orderId');
  const amount = searchParams.get('amount');

  useEffect(() => {
    const confirmPayment = async () => {
      if (!paymentKey || !orderId || !amount) {
        setError('결제 정보가 올바르지 않습니다.');
        setIsConfirming(false);
        return;
      }

      try {
        console.log('결제 확인 요청:', { orderId, paymentKey, amount });

        const response = await paymentConfirmMutation.mutateAsync({
          orderId,
          paymentKey,
          paidAmount: Number(amount),
        });

        if (response.isSuccess) {
          setConfirmResult(response);
          console.log('결제 확인 완료:', response);
        } else {
          setError(response.message || '결제 승인에 실패했습니다.');
        }
      } catch (err) {
        console.error('결제 승인 요청 실패:', err);
        setError('결제 승인 중 오류가 발생했습니다.');
      } finally {
        setIsConfirming(false);
      }
    };

    confirmPayment();
  }, [paymentKey, orderId, amount, paymentConfirmMutation]);

  return {
    isConfirming: isConfirming || paymentConfirmMutation.isPending,
    confirmResult,
    error,
  };
};
