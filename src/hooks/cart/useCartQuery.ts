import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import type { TCartItemRequest, TDeleteCartItemParams } from '@/types/cart/TCart';
import { QUERY_KEYS } from '@/constants/querykeys/queryKeys';

import { addOrUpdateCartItems, deleteCartItem, deleteMultipleCartItems, getCartItems } from '@/apis/cart/cart';

import { useCoreMutation, useCoreQuery } from '@/hooks/customQuery';

export const useCartQuery = () => {
  return useCoreQuery(QUERY_KEYS.GET_CART_ITEMS, getCartItems, {
    staleTime: 1000 * 60 * 5, // 5분
    retry: 1,
  });
};

export const useAddCartMutation = () => {
  const queryClient = useQueryClient();

  return useCoreMutation(addOrUpdateCartItems, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.GET_CART_ITEMS });
    },
  });
};

export const useDeleteCartMutation = () => {
  const queryClient = useQueryClient();

  return useCoreMutation(deleteCartItem, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.GET_CART_ITEMS });
    },
  });
};

export const useDeleteMultipleCartMutation = () => {
  const queryClient = useQueryClient();

  return useCoreMutation(deleteMultipleCartItems, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.GET_CART_ITEMS });
    },
  });
};

export const useCart = () => {
  const cartQuery = useCartQuery();
  const addMutation = useAddCartMutation();
  const deleteMutation = useDeleteCartMutation();
  const deleteMultipleMutation = useDeleteMultipleCartMutation();

  const addItem = useCallback(
    (item: TCartItemRequest): Promise<any> => {
      return addMutation.mutateAsync([item]);
    },
    [addMutation],
  );

  const updateItem = useCallback(
    (item: TCartItemRequest): Promise<any> => {
      return addMutation.mutateAsync([item]);
    },
    [addMutation],
  );

  const deleteItem = useCallback(
    (params: TDeleteCartItemParams): Promise<any> => {
      return deleteMutation.mutateAsync(params);
    },
    [deleteMutation],
  );

  const deleteSelectedItems = useCallback(
    (items: TDeleteCartItemParams[]): Promise<any> => {
      return deleteMultipleMutation.mutateAsync(items);
    },
    [deleteMultipleMutation],
  );

  return {
    cartData: cartQuery.data?.result,
    isLoading: cartQuery.isLoading,
    isError: cartQuery.isError,
    error: cartQuery.error,

    addItem,
    updateItem,
    deleteItem,
    deleteSelectedItems,

    isAdding: addMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isDeletingMultiple: deleteMultipleMutation.isPending,

    refetch: cartQuery.refetch,
  };
};
