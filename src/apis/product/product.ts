import type { TGetProductDetail, TGetProductRequest } from '@/types/product/product';

import { axiosInstance } from '@/apis/axiosInstance';

export const getProductDetail = async ({ productId }: TGetProductRequest): Promise<TGetProductDetail> => {
  const { data } = await axiosInstance.get(`/api/products/${productId}`);
  return data;
};
