import type { FC, SVGProps } from 'react';

import Coupon from '@/assets/myPage/coupon.svg?react';
import Order from '@/assets/myPage/order.svg?react';
import Point from '@/assets/myPage/points.svg?react';
import Review from '@/assets/myPage/review.svg?react';

export interface IMainFunction {
  key: string;
  label: string;
  icon: FC<SVGProps<SVGSVGElement>>;
  path: string;
}

export const MAIN_FUNCTIONS: IMainFunction[] = [
  { key: 'order', label: '주문/배송', icon: Order, path: '/myPage/order' },
  { key: 'review', label: '리뷰', icon: Review, path: '/mypage/review' },
  { key: 'coupon', label: '쿠폰', icon: Coupon, path: '/mypage/coupon' },
  { key: 'point', label: '포인트', icon: Point, path: '/mypage/point' },
];
