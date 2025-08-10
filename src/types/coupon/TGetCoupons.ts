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

export type TGetCoupons = TCommonResponse<{
  page: TPage;
  coupons: TCoupons[];
}>;
