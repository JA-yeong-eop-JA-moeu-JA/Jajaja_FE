import type { TGetReviewsResponse, TReviewSort } from '@/types/board/reviewBoard';

import { axiosInstance } from '@/apis/axiosInstance';

type TParams = {
  sort?: TReviewSort;
  page?: number;
  size?: number;
};

export const getReviews = async ({ sort = 'LATEST', page = 0, size = 6 }: TParams) => {
  const { data } = await axiosInstance.get<TGetReviewsResponse>('/api/reviews', {
    params: { sort, page, size },
  });
  return data;
};
