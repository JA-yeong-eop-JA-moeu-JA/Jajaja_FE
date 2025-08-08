import type { TCommonResponse } from '@/types/common';
import type { TGetRecent } from '@/types/search/recent';

import { axiosInstance } from '@/apis/axiosInstance';

export const getRecent = async (): Promise<TGetRecent> => {
  const { data } = await axiosInstance.get('/api/search/recent-keywords');
  return data;
};

export const deleteRecent = async (keywordId: number): Promise<TCommonResponse<{}>> => {
  const { data } = await axiosInstance.delete(`/api/search/recent-keywords/${keywordId}`);
  return data;
};
