import type { TApplyCouponResponse, TCancelCouponRequest, TGetCouponsResponse } from '@/types/coupon/TGetCoupons';

import { axiosInstance } from '../axiosInstance';

export const getCoupons = async (): Promise<TGetCouponsResponse> => {
  const { data } = await axiosInstance.get('/api/coupons');
  return data;
};

export const applyCoupon = async (couponId: number): Promise<TApplyCouponResponse> => {
  const { data } = await axiosInstance.post(`/api/coupons/${couponId}/apply`);
  return data;
};

export const cancelCoupon = async (requestData: TCancelCouponRequest): Promise<void> => {
  await axiosInstance.post('/api/auth/signup', requestData);
};
