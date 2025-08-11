// PaymentStatusWrapper에서 사용할 결제 승인 로직

import { useEffect, useState } from 'react';
// eslint-disable-next-line import/no-duplicates
import { useSearchParams } from 'react-router-dom';

import { axiosInstance } from '@/apis/axiosInstance';

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

interface IUsePaymentConfirmReturn {
  isConfirming: boolean;
  confirmResult: IPaymentConfirmResponse | null;
  error: string | null;
}

export const usePaymentConfirm = (): IUsePaymentConfirmReturn => {
  const [searchParams] = useSearchParams();
  const [isConfirming, setIsConfirming] = useState(true);
  const [confirmResult, setConfirmResult] = useState<IPaymentConfirmResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  // URL 파라미터에서 결제 정보 추출
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
        // 백엔드에 결제 승인 요청
        const response = await axiosInstance.post<IPaymentConfirmResponse>('/api/orders/confirm', {
          orderId,
          paymentKey,
          paidAmount: Number(amount),
        });

        if (response.data.isSuccess) {
          setConfirmResult(response.data);
        } else {
          setError(response.data.message || '결제 승인에 실패했습니다.');
        }
      } catch (err) {
        console.error('결제 승인 요청 실패:', err);
        setError('결제 승인 중 오류가 발생했습니다.');
      } finally {
        setIsConfirming(false);
      }
    };

    confirmPayment();
  }, [paymentKey, orderId, amount]);

  return { isConfirming, confirmResult, error };
};
