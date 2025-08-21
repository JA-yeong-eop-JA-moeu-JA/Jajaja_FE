import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { useCart } from '@/hooks/cart/useCartQuery';

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
  const { deleteSelectedItems } = useCart();
  const didEffectRun = useRef(false);

  useEffect(() => {
    if (didEffectRun.current) {
      return;
    }
    didEffectRun.current = true;

    const handleCartItemDeletion = async () => {
      try {
        const directBuyItemsJson = sessionStorage.getItem('directBuyItemsToDelete');

        if (directBuyItemsJson) {
          const itemsToDelete = JSON.parse(directBuyItemsJson);

          if (itemsToDelete && itemsToDelete.length > 0) {
            await deleteSelectedItems(itemsToDelete);
          }
          sessionStorage.removeItem('directBuyItemsToDelete');
        }

        const cartItemsJson = sessionStorage.getItem('cartItemsToDelete');

        if (cartItemsJson) {
          const itemsToDelete = JSON.parse(cartItemsJson);

          if (itemsToDelete && itemsToDelete.length > 0) {
            await deleteSelectedItems(itemsToDelete);
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
          await handleCartItemDeletion();
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
  }, [searchParams, paymentConfirmMutation, deleteSelectedItems]);

  return {
    isConfirming,
    confirmResult,
    error,
  };
};
