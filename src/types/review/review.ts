import type { TCommonResponse } from '@/types/common';

export type TReviewRequest = {
  productId: number;
};
export type TReviewResponse = TCommonResponse<{
  reviewCount: number;
  avgRating: number;
  imagesCount: number;
  imageUrls: string[];
}>;
export type TReviewInfiniteRequest = {
  productId: number;
  sort: 'NEW' | 'LATEST' | 'RECOMMEND';
  page: number;
  size: number;
};
export type TReviewInfiniteResponse = TCommonResponse<{
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
  reviews: {
    review: {
      id: number;
      memberId: number;
      nickname: string;
      profileUrl: string;
      createDate: string;
      rating: number;
      option: string;
      content: string;
      likeCount: number;
      imagesCount: number;
    };
    isLike: boolean;
    imageUrls: string[];
  }[];
}>;
