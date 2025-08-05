import type { TDeleteCartResponse, TGetCartResponse, TUpdateCartRequest, TUpdateCartResponse } from '@/types/cart/Tcart';

import { axiosInstance } from '@/apis/axiosInstance';

export const cartApi = {
  getCart: async (): Promise<TGetCartResponse> => {
    const response = await axiosInstance.get('/api/carts');
    return response.data;
  },

  updateCartItem: async (data: TUpdateCartRequest): Promise<TUpdateCartResponse> => {
    const response = await axiosInstance.post('/api/carts/products', data);
    return response.data;
  },

  deleteCartItem: async (productId: number): Promise<TDeleteCartResponse> => {
    const response = await axiosInstance.delete(`/api/carts/${productId}`);
    return response.data;
  },
};
