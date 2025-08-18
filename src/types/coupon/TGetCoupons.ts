import type { TCommonResponse } from '../common';
import type { TPage } from '../TPage';

// Swagger 문서와 정확히 일치하는 쿠폰 적용 조건 타입
type TApplicableConditions = {
  type: 'ALL' | 'BRAND' | 'CATEGORY' | 'FIRST';
  values: string[];
  minOrderAmount: number;
  expireAt: string;
};

// Swagger 문서와 정확히 일치하는 쿠폰 타입
export type TCoupons = {
  couponId: number;
  couponName: string;
  discountType: 'PERCENTAGE' | 'FIXED_AMOUNT';
  discountValue: number;
  applicableConditions: TApplicableConditions;
};

// GET /api/coupons 응답 타입
export type TGetCouponsInfiniteResponse = TCommonResponse<{
  page: TPage;
  coupons: TCoupons[];
}>;

// POST /api/coupons/{couponId}/apply 응답 타입
export type TApplyCouponResponse = TCommonResponse<{
  cartId: number;
  couponId: number;
  couponName: string;
  originalAmount: number;
  discountAmount: number;
  finalAmount: number;
}>;

// DELETE /api/coupons/unapply 응답 타입
export type TCancelCouponResponse = TCommonResponse<string>;

// localStorage에 저장될 확장된 쿠폰 데이터 타입
export type TStoredCouponData = TCoupons & {
  // API 응답에서 받은 추가 정보
  cartId?: number;
  originalAmount?: number;
  discountAmount?: number;
  finalAmount?: number;
  appliedAt: string;
};
