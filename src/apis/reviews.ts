import axios from 'axios'
import type { IReviewResponse } from '@/types/review';

export const getReviews = async ({
  sort = 'latest',
  page = 0,
  size = 5,
  token,
}: {
  sort?: 'latest' | 'recommend';
  page?: number;
  size?: number;
  token: string;
}) => {
  const response = await axios.get<IReviewResponse>(
    `/api/reviews?sort=${sort}&page=${page}&size=${size}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};
