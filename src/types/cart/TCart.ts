import type { TCommonResponse } from '@/types/common';

// 장바구니 아이템 타입
export type TCartItem = {
  id: number;
  productId: number;
  productName: string;
  productThumbnail: string;
  brand: string;
  optionId: number;
  optionName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  teamAvailable: boolean;
};

// 적용된 쿠폰 타입
export type TAppliedCoupon = {
  couponId: number;
  couponName: string;
  discountType: 'PERCENTAGE' | 'FIXED_AMOUNT';
  discountValue: number;
};

// 장바구니 요약 정보 타입
export type TCartSummary = {
  originalAmount: number;
  discountAmount: number;
  shippingFee: number;
  finalAmount: number;
};

// 장바구니 조회 응답 데이터 타입
export type TCartData = {
  products: TCartItem[];
  summary: TCartSummary;
  appliedCoupon?: TAppliedCoupon;
};

// 장바구니 조회 API 응답 타입
export type TGetCartResponse = TCommonResponse<TCartData>;

// 장바구니 아이템 추가/수정 요청 타입
export type TAddToCartRequest = {
  productId: number;
  optionId: number;
  quantity: number;
};

// 장바구니 아이템 추가/수정 응답 타입
export type TAddToCartResponse = TCommonResponse<{
  message: string;
}>;

// 장바구니 아이템 삭제 요청 파라미터 타입
export type TDeleteCartItemParams = {
  productId: number;
  optionId?: number;
};

// 장바구니 아이템 삭제 응답 타입
export type TDeleteCartItemResponse = TCommonResponse<{
  message: string;
}>;
