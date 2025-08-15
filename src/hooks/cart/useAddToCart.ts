import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { TCartItemRequest, TCartMutationResponse } from '@/types/cart/TCart';
import { QUERY_KEYS } from '@/constants/querykeys/queryKeys';

import { LocalCartStorage } from '@/utils/cartStorage';
import { mergeMultipleCartItems } from '@/utils/cartUtils';
import { addOrUpdateCartItems, getCartItems } from '@/apis/cart/cart';

import { useAuth } from '@/context/AuthContext';

export const useAddToCart = () => {
  const queryClient = useQueryClient();
  const { isLoggedIn } = useAuth();

  return useMutation({
    mutationFn: async (
      newItem: TCartItemRequest & {
        productName?: string;
        brand?: string;
        optionName?: string;
        productThumbnail?: string;
        teamAvailable?: boolean;
        teamPrice?: number;
        individualPrice?: number;
        discountRate?: number;
      },
    ): Promise<TCartMutationResponse | void> => {
      if (isLoggedIn) {
        try {
          const currentCartResponse = await getCartItems();
          const currentItems = currentCartResponse.result.products;

          const mergedItems = mergeMultipleCartItems(currentItems, [newItem]);

          return await addOrUpdateCartItems(mergedItems);
        } catch {
          return await addOrUpdateCartItems([newItem]);
        }
      } else {
        LocalCartStorage.addItem({
          ...newItem,
          productName: newItem.productName || '',
          brand: newItem.brand || '',
          optionName: newItem.optionName || '',
          productThumbnail: newItem.productThumbnail || '',
          teamAvailable: newItem.teamAvailable || false,
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
      console.error('장바구니 추가 실패:', error);
    },
  });
};
