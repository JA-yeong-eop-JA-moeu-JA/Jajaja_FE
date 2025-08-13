import type { TGetOptionList, TOptionRequest } from '@/types/product/option';

import { axiosInstance } from '@/apis/axiosInstance';

export const getOptionList = async ({ productId }: TOptionRequest): Promise<TGetOptionList> => {
  const { data } = await axiosInstance.get(`/api/products/${productId}/options`);
  return data;
};
