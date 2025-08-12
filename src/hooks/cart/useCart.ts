import { useQueryClient } from '@tanstack/react-query';

import type { TAddToCartRequest, TCartItem, TDeleteCartItemParams } from '@/types/cart/Tcart';
import { QUERY_KEYS } from '@/constants/querykeys/queryKeys';

import { addToCart, deleteCartItem, getCart } from '@/apis/cart/cart';

import { useCoreMutation, useCoreQuery } from '@/hooks/customQuery';

export const useCart = () => {
  return useCoreQuery(QUERY_KEYS.GET_CART, getCart, {
    staleTime: 30 * 1000, // 30초
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
};

export const useAddToCart = () => {
  const queryClient = useQueryClient();

  return useCoreMutation((requestData: TAddToCartRequest) => addToCart(requestData), {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_CART] });
    },
  });
};

export const useDeleteCartItem = () => {
  const queryClient = useQueryClient();

  return useCoreMutation((params: TDeleteCartItemParams) => deleteCartItem(params), {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_CART] });
    },
  });
};

export const useCartHelpers = () => {
  const calculateItemTotal = (unitPrice: number, quantity: number): number => {
    return unitPrice * quantity;
  };

  const calculateCartTotal = (items: TCartItem[]): number => {
    return items.reduce((total, item) => total + item.totalPrice, 0);
  };

  const getCartItemCount = (items: TCartItem[]): number => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  return {
    calculateItemTotal,
    calculateCartTotal,
    getCartItemCount,
  };
};
