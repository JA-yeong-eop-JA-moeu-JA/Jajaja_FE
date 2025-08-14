import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import type { TCartItemRequest, TDeleteCartItemParams } from '@/types/cart/TCart';
import { QUERY_KEYS } from '@/constants/querykeys/queryKeys';

import { mergeMultipleCartItems } from '@/utils/cartUtils';
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

// 병합 로직 추가
export const useAddCartWithMergeMutation = () => {
  const queryClient = useQueryClient();

  return useCoreMutation(
    async (newItems: TCartItemRequest[]) => {
      try {
        const currentCartResponse = await getCartItems();
        const currentItems = currentCartResponse.result.products;

        const mergedItems = mergeMultipleCartItems(currentItems, newItems);

        return await addOrUpdateCartItems(mergedItems);
      } catch {
        return await addOrUpdateCartItems(newItems);
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.GET_CART_ITEMS });
      },
    },
  );
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
  const addWithMergeMutation = useAddCartWithMergeMutation();
  const deleteMutation = useDeleteCartMutation();
  const deleteMultipleMutation = useDeleteMultipleCartMutation();

  const addItem = useCallback(
    (item: TCartItemRequest): Promise<any> => {
      return addWithMergeMutation.mutateAsync([item]);
    },
    [addWithMergeMutation],
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

  // OptionModal용 아이템 추가 함수
  const addMultipleItems = useCallback(
    (items: TCartItemRequest[]): Promise<any> => {
      return addWithMergeMutation.mutateAsync(items);
    },
    [addWithMergeMutation],
  );

  const addMultipleItemsAsync = useCallback(
    (items: TCartItemRequest[]): Promise<any> => {
      return addWithMergeMutation.mutateAsync(items);
    },
    [addWithMergeMutation],
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

    addMultipleItems,
    addMultipleItemsAsync,
    isAddingMultiple: addWithMergeMutation.isPending,

    isAdding: addMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isDeletingMultiple: deleteMultipleMutation.isPending,

    refetch: cartQuery.refetch,
  };
};
