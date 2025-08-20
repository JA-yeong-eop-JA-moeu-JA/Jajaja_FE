import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { useCart } from '@/hooks/cart/useCartQuery'; // [추가] 장바구니 훅 import
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
  const { deleteSelectedItems } = useCart(); // [추가] 장바구니 아이템 삭제 함수 가져오기

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

          // --- [추가] '즉시 구매' 상품 장바구니에서 삭제하는 로직 ---
          const itemsJson = sessionStorage.getItem('directBuyItemsToDelete');
          if (itemsJson) {
            try {
              const itemsToDelete = JSON.parse(itemsJson);
              if (itemsToDelete && itemsToDelete.length > 0) {
                // 결제가 성공했으므로, 저장해둔 상품을 장바구니에서 삭제합니다.
                await deleteSelectedItems(itemsToDelete);
              }
            } catch (deleteError) {
              // 이 과정에서 에러가 발생해도 결제 자체는 성공한 것이므로,
              // 사용자에게 오류를 보여주지 않고 콘솔에만 기록합니다.
              console.error('Failed to delete direct-buy items from cart:', deleteError);
            } finally {
              // 성공하든 실패하든, 사용된 sessionStorage 데이터는 반드시 삭제합니다.
              sessionStorage.removeItem('directBuyItemsToDelete');
            }
          }
          // --- 로직 종료 ---
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
  }, []); // 의존성 배열은 비워두어 최초 1회만 실행되도록 합니다.

  return {
    isConfirming: isConfirming || paymentConfirmMutation.isPending,
    confirmResult,
    error,
  };
};
