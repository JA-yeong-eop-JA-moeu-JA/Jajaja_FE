import type { TCommonResponse } from '../common';
import type { TPage } from '../TPage';

export type TPointType = TPointHistory['type'];

export const PointLabel: Record<TPointType, string> = {
  REVIEW: '리뷰 작성',
  USE: '적립금 사용',
  EXPIRED: '적립금 소멸',
  REFUND: '적립금 환불',
  SHARE: '친구에게 공유',
  FIRST_PURCHASE: '첫 구매',
};

export type TPointHistory = {
  id: number;
  orderId: number;
  reviewId: number;
  type: 'REVIEW' | 'USE' | 'EXPIRED' | 'REFUND' | 'SHARE' | 'FIRST_PURCHASE';
  productName: string;
  amount: number;
  expiresAt: Date;
  createdAt: Date;
};

export type TGetPointsRequest = {
  page: number;
  size: number;
};

export type TGetPoints = TCommonResponse<{
  page: TPage;
  pointBalance: number;
  pointHistories: TPointHistory[];
}>;
