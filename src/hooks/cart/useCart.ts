import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import type { TAddToCartRequest, TDeleteCartItemParams } from '@/types/cart/TCart';
import { QUERY_KEYS } from '@/constants/querykeys/queryKeys';

import { addToCart, deleteCartItem, getCart } from '@/apis/cart/cart';

// 장바구니 조회 훅
export const useCart = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_CART],
    queryFn: getCart,
    staleTime: 30 * 1000, // 30초 (장바구니는 자주 변경되므로 짧게 설정)
  });
};

// 장바구니 아이템 추가/수정 훅 (배열로 여러 상품 처리)
export const useAddToCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (requestData: TAddToCartRequest) => addToCart(requestData),
    onSuccess: () => {
      // 장바구니 쿼리 무효화하여 최신 데이터 다시 가져오기
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_CART] });
    },
    onError: (error) => {
      console.error('장바구니 추가 실패:', error);
    },
  });
};

// 장바구니 아이템 삭제 훅 (Query parameter 사용)
export const useDeleteCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: TDeleteCartItemParams) => deleteCartItem(params),
    onSuccess: () => {
      // 장바구니 쿼리 무효화하여 최신 데이터 다시 가져오기
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_CART] });
    },
    onError: (error) => {
      console.error('장바구니 삭제 실패:', error);
    },
  });
};

// 장바구니 총 금액 계산 헬퍼 함수들
export const useCartHelpers = () => {
  const calculateItemTotal = (unitPrice: number, quantity: number): number => {
    return unitPrice * quantity;
  };

  const calculateCartTotal = (items: any[]): number => {
    return items.reduce((total, item) => total + item.totalPrice, 0);
  };

  const getCartItemCount = (items: any[]): number => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  return {
    calculateItemTotal,
    calculateCartTotal,
    getCartItemCount,
  };
};
