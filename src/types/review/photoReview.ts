import type { TCommonResponse } from '@/types/common';

export type TPhotoReviewResponse = TCommonResponse<{
  page: {
    size: number;
    totalElements: number;
    currentElements: number;
    totalPages: number;
    currentPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    isLast: boolean;
  };
  images: [
    {
      photoId: number;
      reviewId: number;
      imageUrl: string;
      createdAt: string;
    },
  ];
}>;
export type TPhotoReviewRequest = {
  productId: number;
  sort: 'LATEST' | 'RECOMMEND';
  page: number;
  size: number;
};
