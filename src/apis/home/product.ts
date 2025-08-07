import type { TGetHomeProduct, TGetHomeProductRequest } from '@/types/home/product';

import { axiosInstance } from '@/apis/axiosInstance';

export const getHomeProduct = async ({ categoryId }: TGetHomeProductRequest): Promise<TGetHomeProduct> => {
  const { data } = await axiosInstance.get('/api/products', {
    params: categoryId ? { categoryId } : {},
  });
  return data;
};
