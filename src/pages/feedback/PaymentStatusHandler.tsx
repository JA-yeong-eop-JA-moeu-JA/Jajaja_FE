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

    // ✅ 장바구니 아이템 삭제 함수를 먼저 정의
    const handleCartItemDeletion = async () => {
      try {
        // 1. 직접구매 케이스 (기존 로직)
        const directBuyItemsJson = sessionStorage.getItem('directBuyItemsToDelete');
        if (directBuyItemsJson) {
          const itemsToDelete = JSON.parse(directBuyItemsJson);
          if (itemsToDelete && itemsToDelete.length > 0) {
            await deleteSelectedItems(itemsToDelete);
            console.log('직접구매 아이템 장바구니에서 삭제 완료');
          }
          sessionStorage.removeItem('directBuyItemsToDelete');
        }

        // 2. 장바구니에서 결제한 케이스 (새로 추가)
        const cartItemsJson = sessionStorage.getItem('cartItemsToDelete');
        if (cartItemsJson) {
          const itemsToDelete = JSON.parse(cartItemsJson);
          const orderType = sessionStorage.getItem('paymentOrderType');

          if (itemsToDelete && itemsToDelete.length > 0) {
            await deleteSelectedItems(itemsToDelete);

            if (orderType === 'individual') {
              console.log('장바구니 개별구매 아이템 삭제 완료');
            } else if (orderType === 'team_join') {
              console.log('팀 참여 후 결제 완료, 장바구니 아이템 삭제 완료');
            } else if (orderType === 'team_create') {
              console.log('팀 생성 후 결제 완료, 장바구니 아이템 삭제 완료');
            }
          }

          sessionStorage.removeItem('cartItemsToDelete');
          sessionStorage.removeItem('paymentOrderType');
        }
      } catch (deleteError) {
        console.error('장바구니 아이템 삭제 실패:', deleteError);
      }
    };

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

          await handleCartItemDeletion();
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
