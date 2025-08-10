import type { TGetSearchKeyWord } from '@/types/search/search';

import { axiosInstance } from '@/apis/axiosInstance';

export const getSearchKeyword = async (): Promise<TGetSearchKeyWord> => {
  const { data } = await axiosInstance.get('/api/search/popular-keywords');
  return data;
};
