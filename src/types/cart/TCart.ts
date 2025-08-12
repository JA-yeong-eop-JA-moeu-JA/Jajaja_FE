import type { TCommonResponse } from '../common';
import type { TCoupons } from '../coupon/TGetCoupons';

export type TCartItem = {
  id: number;
  productId: number;
  productName: string;
  brand: string;
  optionId: number;
  optionName: string; // 기존 option에서 optionName으로 변경
  quantity: number;
  productThumbnail: string;
  unitPrice: number;
  totalPrice: number;
  teamAvailable: boolean;
};

export type TCartSummary = {
  originalAmount: number; // 원래금액
  discountAmount: number; // 할인금액
  finalAmount: number; // 최종금액
  shippingFee: number;
};

export type TCartData = {
  products: TCartItem[]; // 기존 data에서 products로 변경
  appliedCoupon: TCoupons | null;
  summary: TCartSummary;
  totalCount: number;
};

// 장바구니 조회 응답
export type TGetCartResponse = TCommonResponse<TCartData>;

// 장바구니 아이템 추가/수정 요청 (배열로 변경)
export type TAddToCartItem = {
  productId: number;
  optionId: number;
  quantity: number;
};

export type TAddToCartRequest = TAddToCartItem[];

// 장바구니 아이템 추가/수정 응답
export type TAddToCartResponse = TCommonResponse<string>;

// 장바구니 아이템 삭제 요청 (Query parameter)
export type TDeleteCartItemParams = {
  productId: number;
  optionId?: number;
};

// 장바구니 아이템 삭제 응답
export type TDeleteCartItemResponse = TCommonResponse<string>;
