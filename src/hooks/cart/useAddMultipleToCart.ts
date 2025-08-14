import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { TCartItemRequest, TCartMutationResponse } from '@/types/cart/TCart';
import { QUERY_KEYS } from '@/constants/querykeys/queryKeys';

import { mergeMultipleCartItems } from '@/utils/cartUtils';
import { addOrUpdateCartItems, getCartItems } from '@/apis/cart/cart';

export const useAddMultipleToCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newItems: TCartItemRequest[]): Promise<TCartMutationResponse> => {
      try {
        const currentCartResponse = await getCartItems();
        const currentItems = currentCartResponse.result.products;

        const mergedItems = mergeMultipleCartItems(currentItems, newItems);

        return await addOrUpdateCartItems(mergedItems);
      } catch {
        return await addOrUpdateCartItems(newItems);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.GET_CART });
    },
    onError: () => {
      // 에러 추가
    },
  });
};
