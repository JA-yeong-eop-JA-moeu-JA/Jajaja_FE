import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { TCartItemRequest, TCartMutationResponse } from '@/types/cart/TCart';
import { QUERY_KEYS } from '@/constants/querykeys/queryKeys';

import { LocalCartStorage } from '@/utils/cartStorage';
import { mergeMultipleCartItems } from '@/utils/cartUtils';
import { addOrUpdateCartItems, getCartItems } from '@/apis/cart/cart';

import { useAuth } from '@/context/AuthContext';

export const useAddMultipleToCart = () => {
  const queryClient = useQueryClient();
  const { isLoggedIn } = useAuth();

  return useMutation({
    mutationFn: async (
      newItems: (TCartItemRequest & {
        productName?: string;
        brand?: string;
        optionName?: string;
        productThumbnail?: string;
        teamAvailable?: boolean;
        teamPrice?: number;
        individualPrice?: number;
        discountRate?: number;
      })[],
    ): Promise<TCartMutationResponse | void> => {
      if (isLoggedIn) {
        try {
          const currentCartResponse = await getCartItems();
          const currentItems = currentCartResponse.result.products;

          const mergedItems = mergeMultipleCartItems(currentItems, newItems);

          return await addOrUpdateCartItems(mergedItems);
        } catch {
          return await addOrUpdateCartItems(newItems);
        }
      } else {
        newItems.forEach((item) => {
          LocalCartStorage.addItem({
            ...item,
            productName: item.productName || '',
            brand: item.brand || '',
            optionName: item.optionName || '',
            productThumbnail: item.productThumbnail || '',
            teamAvailable: item.teamAvailable || false,
          });
        });
        window.dispatchEvent(new CustomEvent('localCartUpdate'));
      }
    },
    onSuccess: () => {
      if (isLoggedIn) {
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.GET_CART_ITEMS });
      }
    },
    onError: (error) => {
      console.error('장바구니 여러 개 추가 실패:', error);
    },
  });
};
