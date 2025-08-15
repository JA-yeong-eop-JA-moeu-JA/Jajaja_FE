import { useCallback, useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import type { TCartItemRequest, TDeleteCartItemParams } from '@/types/cart/TCart';
import { QUERY_KEYS } from '@/constants/querykeys/queryKeys';

import { LocalCartStorage } from '@/utils/cartStorage';
import { mergeMultipleCartItems } from '@/utils/cartUtils';
import { addOrUpdateCartItems, deleteCartItem, deleteMultipleCartItems, getCartItems } from '@/apis/cart/cart';

import { useCoreMutation, useCoreQuery } from '@/hooks/customQuery';

import { useAuth } from '@/context/AuthContext';

export const useCartQuery = () => {
  const { isLoggedIn } = useAuth();

  return useCoreQuery(QUERY_KEYS.GET_CART_ITEMS, getCartItems, {
    enabled: isLoggedIn, // 로그인 상태에서만 활성화
    staleTime: 1000 * 60 * 5,
    retry: false,
    throwOnError: false,
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

// 기존 useCart 훅을 완전히 대체하는 새로운 useCart
export const useCart = () => {
  const { isLoggedIn } = useAuth();

  // 서버 관련 훅들
  const cartQuery = useCartQuery();
  const addMutation = useAddCartMutation();
  const addWithMergeMutation = useAddCartWithMergeMutation();
  const deleteMutation = useDeleteCartMutation();
  const deleteMultipleMutation = useDeleteMultipleCartMutation();

  // 로컬 장바구니 상태
  const [localCart, setLocalCart] = useState(() => LocalCartStorage.get());
  const [isSyncing, setIsSyncing] = useState(false);

  // 동기화 함수를 useCallback으로 선언 (hoisting 문제 해결)
  const syncLocalCartToServer = useCallback(async () => {
    if (isSyncing) return;

    setIsSyncing(true);
    try {
      const localItems = LocalCartStorage.convertToServerFormat();
      if (localItems.length > 0) {
        await addWithMergeMutation.mutateAsync(localItems);
        LocalCartStorage.clear();
        setLocalCart({ items: [], lastUpdated: new Date().toISOString() });
        window.dispatchEvent(new CustomEvent('localCartUpdate'));
      }
    } catch (error) {
      console.error('장바구니 동기화 실패:', error);
    } finally {
      setIsSyncing(false);
    }
  }, [isSyncing, addWithMergeMutation]);

  // 로컬스토리지 변경 감지
  useEffect(() => {
    const handleStorageChange = () => {
      setLocalCart(LocalCartStorage.get());
    };

    const handleLocalStorageUpdate = () => {
      setLocalCart(LocalCartStorage.get());
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('localCartUpdate', handleLocalStorageUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('localCartUpdate', handleLocalStorageUpdate);
    };
  }, []);

  // 로그인 시 로컬 장바구니를 서버로 동기화
  useEffect(() => {
    if (isLoggedIn && localCart.items.length > 0 && !isSyncing) {
      syncLocalCartToServer();
    }
  }, [isLoggedIn, localCart.items.length, isSyncing, syncLocalCartToServer]);

  // 기존 함수들 - 로그인 상태에 따라 다르게 처리
  const addItem = useCallback(
    async (item: TCartItemRequest): Promise<any> => {
      if (isLoggedIn) {
        return addWithMergeMutation.mutateAsync([item]);
      } else {
        // 비로그인 시에는 기본값으로 로컬에 저장
        LocalCartStorage.addItem({
          ...item,
          productName: '',
          brand: '',
          optionName: '',
          productThumbnail: '',
          teamAvailable: false,
        });
        setLocalCart(LocalCartStorage.get());
        window.dispatchEvent(new CustomEvent('localCartUpdate'));
      }
    },
    [isLoggedIn, addWithMergeMutation],
  );

  const updateItem = useCallback(
    async (item: TCartItemRequest): Promise<any> => {
      if (isLoggedIn) {
        return addMutation.mutateAsync([item]);
      } else {
        LocalCartStorage.updateItem(item.productId, item.optionId, {
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.totalPrice,
        });
        setLocalCart(LocalCartStorage.get());
        window.dispatchEvent(new CustomEvent('localCartUpdate'));
      }
    },
    [isLoggedIn, addMutation],
  );

  const deleteItem = useCallback(
    async (params: TDeleteCartItemParams | { id: string }): Promise<any> => {
      if (isLoggedIn) {
        if ('id' in params) {
          // 서버에서는 productId, optionId로 삭제해야 함
          const serverItem = cartQuery.data?.result.products.find((p) => p.id.toString() === params.id);
          if (serverItem) {
            return deleteMutation.mutateAsync({
              productId: serverItem.productId,
              optionId: serverItem.optionId,
            });
          }
        } else {
          return deleteMutation.mutateAsync(params);
        }
      } else {
        if ('id' in params) {
          LocalCartStorage.removeItem(params.id);
        } else {
          LocalCartStorage.removeByProductAndOption(params.productId, params.optionId);
        }
        setLocalCart(LocalCartStorage.get());
        window.dispatchEvent(new CustomEvent('localCartUpdate'));
      }
    },
    [isLoggedIn, deleteMutation, cartQuery.data],
  );

  const deleteSelectedItems = useCallback(
    async (items: TDeleteCartItemParams[] | string[]): Promise<any> => {
      if (isLoggedIn) {
        if (typeof items[0] === 'string') {
          // id 배열인 경우 서버 형식으로 변환
          const serverItems: TDeleteCartItemParams[] = [];
          (items as string[]).forEach((id) => {
            const serverItem = cartQuery.data?.result.products.find((p) => p.id.toString() === id);
            if (serverItem) {
              serverItems.push({
                productId: serverItem.productId,
                optionId: serverItem.optionId,
              });
            }
          });
          return deleteMultipleMutation.mutateAsync(serverItems);
        } else {
          return deleteMultipleMutation.mutateAsync(items as TDeleteCartItemParams[]);
        }
      } else {
        if (typeof items[0] === 'string') {
          (items as string[]).forEach((id) => LocalCartStorage.removeItem(id));
        } else {
          LocalCartStorage.removeMultiple(items as TDeleteCartItemParams[]);
        }
        setLocalCart(LocalCartStorage.get());
        window.dispatchEvent(new CustomEvent('localCartUpdate'));
      }
    },
    [isLoggedIn, deleteMultipleMutation, cartQuery.data],
  );

  const addMultipleItems = useCallback(
    async (items: TCartItemRequest[]): Promise<any> => {
      if (isLoggedIn) {
        return addWithMergeMutation.mutateAsync(items);
      } else {
        items.forEach((item) => {
          LocalCartStorage.addItem({
            ...item,
            productName: '',
            brand: '',
            optionName: '',
            productThumbnail: '',
            teamAvailable: false,
          });
        });
        setLocalCart(LocalCartStorage.get());
        window.dispatchEvent(new CustomEvent('localCartUpdate'));
      }
    },
    [isLoggedIn, addWithMergeMutation],
  );

  const addMultipleItemsAsync = useCallback(
    async (items: TCartItemRequest[]): Promise<any> => {
      return addMultipleItems(items);
    },
    [addMultipleItems],
  );

  // 현재 장바구니 데이터 반환
  const cartData = isLoggedIn
    ? cartQuery.data?.result
    : {
        products: localCart.items,
        appliedCoupon: null,
        availableCouponsCount: 0,
        summary: {
          originalAmount: localCart.items.reduce((sum, item) => sum + item.totalPrice, 0),
          discountAmount: 0,
          finalAmount: localCart.items.reduce((sum, item) => sum + item.totalPrice, 0),
          shippingFee: 0,
        },
        totalCount: localCart.items.length,
      };

  return {
    cartData,
    isLoading: isLoggedIn ? cartQuery.isLoading || isSyncing : false,
    isError: isLoggedIn ? cartQuery.isError : false,
    error: isLoggedIn ? cartQuery.error : null,
    isSyncing,

    addItem,
    updateItem,
    deleteItem,
    deleteSelectedItems,

    addMultipleItems,
    addMultipleItemsAsync,
    isAddingMultiple: isLoggedIn ? addWithMergeMutation.isPending : false,

    isAdding: isLoggedIn ? addMutation.isPending : false,
    isDeleting: isLoggedIn ? deleteMutation.isPending : false,
    isDeletingMultiple: isLoggedIn ? deleteMultipleMutation.isPending : false,

    refetch: isLoggedIn
      ? cartQuery.refetch
      : () => {
          setLocalCart(LocalCartStorage.get());
          window.dispatchEvent(new CustomEvent('localCartUpdate'));
        },

    // 추가 정보
    isLoggedIn,
  };
};
