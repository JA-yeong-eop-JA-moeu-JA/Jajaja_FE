import type { TCommonResponse } from '@/types/common';

export type TLikeRequest = {
  reviewId: number;
};
export type TPatchLike = TCommonResponse<{
  reviewId: number;
  isLike: boolean;
}>;
