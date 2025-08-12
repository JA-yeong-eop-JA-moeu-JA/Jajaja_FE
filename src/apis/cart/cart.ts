import type { TAddToCartRequest, TAddToCartResponse, TDeleteCartItemParams, TDeleteCartItemResponse, TGetCartResponse } from '@/types/cart/TCart';

import { axiosInstance } from '../axiosInstance';

// 장바구니 조회
export const getCart = async (): Promise<TGetCartResponse> => {
  try {
    console.log('장바구니 조회 API 호출');
    const { data } = await axiosInstance.get('/api/carts');
    console.log('장바구니 조회 성공:', data);
    return data;
  } catch (error) {
    console.error('장바구니 조회 실패:', error);
    throw error;
  }
};

// 장바구니에 상품 추가/수정
export const addToCart = async (requestData: TAddToCartRequest): Promise<TAddToCartResponse> => {
  try {
    console.log('장바구니 추가 API 호출:', requestData);
    const { data } = await axiosInstance.post('/api/carts/products', requestData);
    console.log('장바구니 추가 성공:', data);
    return data;
  } catch (error) {
    console.error('장바구니 추가 실패:', error);
    throw error;
  }
};

// 장바구니 상품 삭제
export const deleteCartItem = async (params: TDeleteCartItemParams): Promise<TDeleteCartItemResponse> => {
  try {
    console.log('장바구니 삭제 API 호출:', params);
    const { data } = await axiosInstance.delete('/api/carts/products', {
      params: {
        productId: params.productId,
        ...(params.optionId && { optionId: params.optionId }),
      },
    });
    console.log('장바구니 삭제 성공:', data);
    return data;
  } catch (error) {
    console.error('장바구니 삭제 실패:', error);
    throw error;
  }
};
