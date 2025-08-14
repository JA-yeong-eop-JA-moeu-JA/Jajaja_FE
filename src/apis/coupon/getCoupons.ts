import type { TApplyCouponResponse, TGetCouponsInfiniteResponse } from '@/types/coupon/TGetCoupons';

import { axiosInstance } from '../axiosInstance';

export const getCouponsWithPaging = async (page: number, size: number = 10): Promise<TGetCouponsInfiniteResponse> => {
  const { data } = await axiosInstance.get(`/api/coupons?page=${page}&size=${size}`);
  return data;
};

export const applyCoupon = async (couponId: number): Promise<TApplyCouponResponse> => {
  const { data } = await axiosInstance.post(`/api/coupons/${couponId}/apply`);
  return data;
};

export const cancelCoupon = async (): Promise<void> => {
  await axiosInstance.delete('/api/coupons/unapply');
};
