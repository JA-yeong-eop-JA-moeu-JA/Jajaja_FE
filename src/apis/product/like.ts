import type { TLikeRequest, TPatchLike } from '@/types/product/like';

import { axiosInstance } from '@/apis/axiosInstance';

export const patchLike = async ({ reviewId }: TLikeRequest): Promise<TPatchLike> => {
  const { data } = await axiosInstance.patch(`/api/reviews/${reviewId}`);
  return data;
};
