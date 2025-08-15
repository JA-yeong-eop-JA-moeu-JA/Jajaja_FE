import type { TCartItemRequest, TCartMutationResponse, TDeleteCartItemParams, TGetCartResponse } from '@/types/cart/TCart';

import { axiosInstance } from '@/apis/axiosInstance';

export const getCartItems = async (): Promise<TGetCartResponse> => {
  const response = await axiosInstance.get<TGetCartResponse>('/api/carts/', {
    // 401 오류 시 로그인 모달을 띄우지 않음
    optionalAuth: true,
    validateStatus: (status: number) => (status >= 200 && status < 300) || status === 401,
  });
  return response.data;
};

export const addOrUpdateCartItems = async (items: TCartItemRequest[]): Promise<TCartMutationResponse> => {
  items.forEach((item) => {
    if (!item.productId) throw new Error('productId가 없습니다!');
    if (!item.optionId) throw new Error('optionId가 없습니다!');
    if (!item.quantity || item.quantity < 1) throw new Error('quantity가 유효하지 않습니다!');
  });

  const response = await axiosInstance.post<TCartMutationResponse>('/api/carts/products', items);
  return response.data;
};

export const deleteCartItem = async (params: TDeleteCartItemParams): Promise<TCartMutationResponse> => {
  const response = await axiosInstance.delete<TCartMutationResponse>('/api/carts/products', { params });
  return response.data;
};

export const deleteMultipleCartItems = async (items: TDeleteCartItemParams[]): Promise<TCartMutationResponse[]> => {
  const deletePromises = items.map((item) => deleteCartItem(item));
  return Promise.all(deletePromises);
};
