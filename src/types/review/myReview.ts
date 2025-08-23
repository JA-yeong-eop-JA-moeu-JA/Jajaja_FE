import type { TCommonResponse } from '../common';
import type { TPage } from '../TPage';

export type TReviewableOrderList = {
  id: number;
  date: string;
  items: TReviewableOrderItem[];
};

export type TReviewableOrderItem = {
  orderId: number;
  orderDate: string;
  orderProductId: number;
  productId: number;
  productName: string;
  store: string;
  optionName: string;
  imageUrl: string;
  price: number;
  quantity: number;
  isReviewWritten: Boolean;
};

export type TGetReviewable = TCommonResponse<{
  page: TPage;
  orders: TReviewableOrderList[];
}>;

export type TPostReviewRequest = {
  orderProductId: number;
  rating: number;
  content: string;
  imageKeys: string[];
};

export type TPostReview = TCommonResponse<{
  reviewId: number;
}>;
