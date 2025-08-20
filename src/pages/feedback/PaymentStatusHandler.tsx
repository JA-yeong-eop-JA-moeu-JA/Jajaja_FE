import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { useCart } from '@/hooks/cart/useCartQuery';
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
  const { deleteSelectedItems } = useCart();

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
        setError('결제 정보가 올바르지 않습니다.');
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

          const itemsJson = sessionStorage.getItem('directBuyItemsToDelete');
          if (itemsJson) {
            try {
              const itemsToDelete = JSON.parse(itemsJson);
              if (itemsToDelete && itemsToDelete.length > 0) {
                await deleteSelectedItems(itemsToDelete);
              }
            } catch (deleteError) {
              console.error('Failed to delete direct-buy items from cart:', deleteError);
            } finally {
              sessionStorage.removeItem('directBuyItemsToDelete');
            }
          }
        } else {
          setError(response.message || '결제 승인에 실패했습니다.');
        }
      } catch (err: any) {
        if (err.response?.data?.code === 'ORDER4001') {
          setError(`주문을 찾을 수 없습니다. orderId: ${orderId}`);
        } else if (err.response?.data?.code === 'PAYMENT4004') {
          setError(`결제 금액이 일치하지 않습니다. 확인된 금액: ${amount}원`);
        } else {
          setError(err.response?.data?.message || '결제 승인 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
        }
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
