import type { TCommonResponse } from '../common';
import type { TPage } from '../TPage';

export type TGetNoti = {
  id: number;
  type: 'MATCHING' | 'DELIVERY' | 'COUPON_AD';
  title: string;
  detail?: {
    orderId?: number;
    productName?: string;
    productImage?: string;
    isTeamMatched?: boolean;
    orderProductId?: number;
    productId?: number;
  };
  isRead: boolean;
  createdAt: string;
};

export type TGetNotiList = TCommonResponse<{
  page: TPage;
  notifications: TGetNoti[];
}>;
