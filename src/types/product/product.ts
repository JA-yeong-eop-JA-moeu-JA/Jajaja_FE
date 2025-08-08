import type { TCommonResponse } from '@/types/common';

export type TGetProductRequest = {
  productId: number;
};
export type TGetReview = TGetTeams & TGetReviews;
export type TGetReviews = {
  review: {
    id: number;
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
};
export type TGetTeams = {
  id: number;
  nickname: string;
  createdAt: string;
};
export type TGetProductDetail = TCommonResponse<{
  thumbnailUrl: string;
  store: string;
  name: string;
  originPrice: number;
  salePrice: number;
  discountRate: number;
  imageUrl: string;
  rating: number;
  reviewCount: number;
  deliveryPeriod: number;
  teams: TGetTeams[];
  reviews: TGetReviews[];
}>;
