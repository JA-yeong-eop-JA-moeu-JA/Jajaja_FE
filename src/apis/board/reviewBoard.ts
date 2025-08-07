import type { IReviewResponse } from '@/types/review';

import axiosInstance from '@/apis/axiosInstance';

interface GetReviewsParams {
  sort?: 'latest' | 'recommend';
  page?: number;
  size?: number;
  token: string;
}

export const getReviews = async ({ sort = 'latest', page = 0, size = 5, token }: GetReviewsParams): Promise<IReviewResponse> => {
  const response = await axiosInstance.get('/api/reviews', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      sort,
      page,
      size,
    },
  });

  return response.data;
};
