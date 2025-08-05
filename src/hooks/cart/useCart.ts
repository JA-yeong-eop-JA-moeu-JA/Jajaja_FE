import { useCallback, useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import type { TDeleteCartResponse, TGetCartResponse, TUpdateCartRequest, TUpdateCartResponse } from '@/types/cart/Tcart';
import { QUERY_KEYS } from '@/constants/querykeys/queryKeys';

import { cartApi } from '@/apis/cart/cart';

import { useCoreMutation, useCoreQuery } from '@/hooks/customQuery';

import { CartData } from '@/mocks/CartData';

export const useCart = () => {
  const queryClient = useQueryClient();

  // 테스트용 mock 데이터
  const isDevelopment = process.env.NODE_ENV === 'development';

  const { data: cartData, isLoading } = useCoreQuery(
    QUERY_KEYS.GET_CART,
    isDevelopment
      ? (): Promise<TGetCartResponse> => Promise.resolve(CartData) // 테스트용 mock 데이터
      : cartApi.getCart,
    {
      staleTime: 1000 * 60,
    },
  );

  const updateCartMutation = useCoreMutation(
    isDevelopment
      ? (data: TUpdateCartRequest): Promise<TUpdateCartResponse> => {
          console.log('Mock updateCartItem:', data);
          return Promise.resolve({ isSuccess: true, code: 'COMMON200', message: '성공', result: {} });
        }
      : cartApi.updateCartItem,
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.GET_CART });
      },
    },
  );

  const deleteCartMutation = useCoreMutation(
    isDevelopment
      ? (productId: number): Promise<TDeleteCartResponse> => {
          console.log('Mock deleteCartItem:', productId);
          return Promise.resolve({ isSuccess: true, code: 'COMMON200', message: '성공', result: {} });
        }
      : cartApi.deleteCartItem,
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.GET_CART });
      },
    },
  );

  const deleteMultipleItems = useCallback(
    async (productIds: number[]): Promise<void> => {
      if (isDevelopment) {
        console.log('Mock deleteMultipleItems:', productIds);
        return Promise.resolve();
      }
      await Promise.all(productIds.map((productId) => cartApi.deleteCartItem(productId)));
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.GET_CART });
    },
    [queryClient, isDevelopment],
  );

  const computedValues = useMemo(() => {
    if (!cartData?.result) {
      return {
        cartItems: [],
        totalCount: 0,
        summary: null,
        appliedCoupon: null,
        isEmpty: true,
      };
    }

    const { data: cartItems } = cartData.result;

    return {
      cartItems,
      isEmpty: cartItems.length === 0,
    };
  }, [cartData]);

  return {
    ...computedValues,
    isLoading,
    updateCartItem: updateCartMutation.mutate,
    deleteCartItem: deleteCartMutation.mutate,
    deleteMultipleItems,
    isUpdating: updateCartMutation.isPending,
    isDeleting: deleteCartMutation.isPending,
  };
};
