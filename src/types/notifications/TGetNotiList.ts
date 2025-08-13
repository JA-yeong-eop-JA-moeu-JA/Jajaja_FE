import type { TCommonResponse } from '../common';
import type { TPage } from '../TPage';

export type TGetNoti = {
  id: number;
  type: 'MATCHING' | 'DELIVERY' | 'COUPON_AD';
  body: string;
  isRead: boolean;
  createdAt: string;
};

export type TGetNotiList = TCommonResponse<{
  page: TPage;
  notifications: TGetNoti[];
}>;
