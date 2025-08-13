import type { TCommonResponse } from '../common';
import type { TPage } from '../TPage';

type TApplicableConditions = {
  type: 'ALL' | 'BRAND' | 'CATEGORY' | 'FIRST';
  values: string[];
  minOrderAmount: number;
  expireAt: string;
};

export type TCoupons = {
  couponId: number;
  couponName: string;
  discountType: 'PERCENTAGE' | 'FIXED_AMOUNT';
  discountValue: number;
  applicableConditions: TApplicableConditions;
};

export type TGetCouponsResponse = TCommonResponse<{
  page: TPage;
  coupons: TCoupons[];
}>;

export type TApplyCouponResponse = TCommonResponse<{
  data: TCoupons;
}>;

export type TCancelCouponRequest = {
  id: number;
};
