import { useQueryClient } from '@tanstack/react-query';

import type { TAddToCartRequest, TDeleteCartItemParams } from '@/types/cart/TCart';
import { QUERY_KEYS } from '@/constants/querykeys/queryKeys';

import { addToCart, deleteCartItem, getCart } from '@/apis/cart/cart';

import { useCoreMutation, useCoreQuery } from '@/hooks/customQuery';

// 장바구니 조회 훅 - 새로고침 시 401 오류 해결
export const useCart = () => {
  return useCoreQuery(
    QUERY_KEYS.GET_CART, // 마이페이지와 동일한 패턴
    getCart,
    {
      staleTime: 30 * 1000, // 30초
      refetchOnMount: true,
      refetchOnWindowFocus: true,
      // 새로고침 시 토큰 문제 해결을 위한 설정
      retry: (failureCount, error: any) => {
        // 401 에러의 경우 토큰 재발급 후 한 번만 재시도
        if (error?.response?.status === 401 && error?.response?.data?.code === 'AUTH4011') {
          return failureCount < 1; // 첫 번째 401은 재시도, 두 번째는 중단
        }
        return failureCount < 3;
      },
      retryDelay: (attemptIndex, error: any) => {
        // 401 에러의 경우 빠른 재시도 (토큰 재발급 대기)
        if (error?.response?.status === 401) {
          return 500; // 500ms 후 재시도
        }
        return Math.min(1000 * 2 ** attemptIndex, 30000);
      },
      // 네트워크 에러 시 무한 로딩 방지
      networkMode: 'online',
    },
  );
};

// 장바구니 아이템 추가/수정 훅
export const useAddToCart = () => {
  const queryClient = useQueryClient();

  return useCoreMutation((requestData: TAddToCartRequest) => addToCart(requestData), {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_CART] });
    },
    onError: (error: any) => {
      console.error('장바구니 추가 실패:', error);
      if (error?.response?.status !== 401) {
        alert('장바구니에 추가하는데 실패했습니다.');
      }
    },
  });
};

// 장바구니 아이템 삭제 훅
export const useDeleteCartItem = () => {
  const queryClient = useQueryClient();

  return useCoreMutation((params: TDeleteCartItemParams) => deleteCartItem(params), {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_CART] });
    },
    onError: (error: any) => {
      console.error('장바구니 삭제 실패:', error);
      if (error?.response?.status !== 401) {
        alert('장바구니에서 삭제하는데 실패했습니다.');
      }
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
