import type { TCommonResponse } from '@/types/common';

import { axiosInstance } from '@/apis/axiosInstance';

type TCategoryBody = {
  businessCategoryId: number;
};
export const postCategory = async ({ businessCategoryId }: TCategoryBody): Promise<TCommonResponse<{}>> => {
  const { data } = await axiosInstance.post('/api/onboarding/', { businessCategoryId });
  return data;
};
