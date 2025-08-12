import type { TAddToCartRequest, TAddToCartResponse, TDeleteCartItemParams, TDeleteCartItemResponse, TGetCartResponse } from '@/types/cart/Tcart';

import { axiosInstance } from '../axiosInstance';

// 장바구니 조회
export const getCart = async (): Promise<TGetCartResponse> => {
  const { data } = await axiosInstance.get('/api/carts/');
  return data;
};

// 장바구니에 상품 추가/수정
export const addToCart = async (requestData: TAddToCartRequest): Promise<TAddToCartResponse> => {
  const { data } = await axiosInstance.post('/api/carts/products', requestData);
  return data;
};

// 장바구니 상품 삭제
export const deleteCartItem = async (params: TDeleteCartItemParams): Promise<TDeleteCartItemResponse> => {
  const { data } = await axiosInstance.delete('/api/carts/products', {
    params: {
      productId: params.productId,
      ...(params.optionId && { optionId: params.optionId }),
    },
  });
  return data;
};
