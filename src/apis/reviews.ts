import axios from 'axios';

import type { IReviewResponse } from '@/types/review';

export const getReviews = async ({
  sort = 'LATEST',
  page = 0,
  size = 6,
  token,
}: {
  sort?: 'LATEST' | 'RECOMMEND';
  page?: number;
  size?: number;
  token: string;
}) => {
  const response = await axios.get<IReviewResponse>(`/api/reviews?sort=${sort}&page=${page}&size=${size}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
