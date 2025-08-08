import type { TGetCoupons } from '@/types/coupon/TGetCoupons';

import axiosInstance from '../axiosInstance';

export const getCoupons = async (page: number, size: number): Promise<TGetCoupons> => {
  const { data } = await axiosInstance.get(`/api/coupons?page=${page}&size=${size}`);
  return data;
};
