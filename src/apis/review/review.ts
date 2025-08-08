import type { TReviewInfiniteRequest, TReviewInfiniteResponse, TReviewRequest, TReviewResponse } from '@/types/review/review';

import { axiosInstance } from '@/apis/axiosInstance';

export const getReviewDetail = async ({ productId }: TReviewRequest): Promise<TReviewResponse> => {
  const { data } = await axiosInstance.get(`/api/reviews/info/${productId}`);
  return data;
};
export const getReviewInfinite = async ({ productId, sort, page, size }: TReviewInfiniteRequest): Promise<TReviewInfiniteResponse> => {
  const { data } = await axiosInstance.get(`/api/reviews/${productId}`, { params: { sort: sort, page: page, size: size } });
  return data;
};
