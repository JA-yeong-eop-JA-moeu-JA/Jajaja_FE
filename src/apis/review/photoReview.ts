import type { TPhotoReviewRequest, TPhotoReviewResponse } from '@/types/review/photoReview';

import { axiosInstance } from '@/apis/axiosInstance';

export const getPhotoReview = async ({ productId, sort, page, size }: TPhotoReviewRequest): Promise<TPhotoReviewResponse> => {
  const { data } = await axiosInstance.get(`/api/reviews/photo/${productId}`, { params: { sort: sort, page: page, size: size } });
  return data;
};
