import type { IGetKeywordProductsResponse, TCategorySort, TGetSearchKeyWord } from '@/types/search/search';

import { axiosInstance } from '@/apis/axiosInstance';

export const getSearchKeyword = async (): Promise<TGetSearchKeyWord> => {
  const { data } = await axiosInstance.get('/api/search/popular-keywords');
  return data;
};

export const getProductsByKeyword = async (keyword: string, sort: TCategorySort = 'POPULAR', page = 0, size = 6): Promise<IGetKeywordProductsResponse> => {
  const { data } = await axiosInstance.get<IGetKeywordProductsResponse>('/api/search', { params: { keyword, sort, page, size } });

  return data;
};
