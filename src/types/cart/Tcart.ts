import type { TCommonResponse } from '../common';

export type TCartItem = {
  id: number;
  productId: number;
  productName: string;
  brand: string;
  optionId: number;
  option: string;
  quantity: number;
  productThumbnail: string;
  unitPrice: number;
  totalPrice: number;
  teamAvailable: boolean;
};

export type TAppliedCoupon = {
  couponId: number;
  couponName: string;
  discountType: 'FIXED_AMOUNT' | 'PERCENTAGE';
  discountValue: number;
  applicableConditions: {
    type: 'ALL' | 'BRAND' | 'CATEGORY';
    values: string[];
    minOrderAmount?: number;
  };
};

export type TCartSummary = {
  originalAmount: number;
  discountAmount: number;
  finalAmount: number;
  shippingFee: number;
};

export type TGetCartResponse = TCommonResponse<{
  data: TCartItem[];
}>;

export type TUpdateCartRequest = {
  productId: number;
  optionId: number;
  quantity: number;
};

export type TUpdateCartResponse = TCommonResponse<{}>;
export type TDeleteCartResponse = TCommonResponse<{}>;
