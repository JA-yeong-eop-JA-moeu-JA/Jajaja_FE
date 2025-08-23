import type { TCommonResponse } from '@/types/common';
import type { TGetReviewable, TPostReview, TPostReviewRequest } from '@/types/review/myReview';
import type { TReviewInfiniteResponse } from '@/types/review/review';
import type { TInfiniteRequest } from '@/types/TPage';

import axiosInstance from '../axiosInstance';

export const getReviewable = async ({ page, size }: TInfiniteRequest): Promise<TGetReviewable> => {
  const { data } = await axiosInstance.get(`/api/reviews/reviewable`, { params: { page: page, size: size } });
  return data;
};

export const postReview = async ({ orderProductId: productId, rating, content, imageKeys }: TPostReviewRequest): Promise<TPostReview> => {
  const { data } = await axiosInstance.post(`/api/reviews/${productId}`, { rating, content, imageKeys });
  return data;
};

export const deleteReview = async (reviewId: number): Promise<TCommonResponse<{}>> => {
  const { data } = await axiosInstance.delete(`/api/reviews/${reviewId}`);
  return data;
};

export const getMyReview = async ({ page, size }: TInfiniteRequest): Promise<TReviewInfiniteResponse> => {
  const { data } = await axiosInstance.get(`/api/reviews/me`, { params: { page: page, size: size } });
  return data;
};
