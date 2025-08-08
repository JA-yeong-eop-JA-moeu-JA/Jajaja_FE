import type { TCommonResponse } from '../common';

export type TGetNoti = {
  id: number;
  type: 'MATCHING' | 'DELIVERY' | 'COUPON_AD';
  body: string;
  isRead: boolean;
  createdAt: string;
};

export type TGetNotiList = TCommonResponse<TGetNoti[]>;
