export type TCommonResponse<T> = {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
};

export type TCartProduct = {
  id: number;
  productId: number;
  productName: string;
  brand: string;
  optionId: number;
  optionName: string;
  quantity: number;
  productThumbnail: string;
  unitPrice: number;
  totalPrice: number;
  teamAvailable: boolean;
};

export type TCoupon = {
  couponId: number;
  couponName: string;
  discountType: 'PERCENTAGE' | 'FIXED';
  discountValue: number;
  applicableConditions: {
    type: 'ALL' | 'SPECIFIC';
    values: string[];
    minOrderAmount: number;
    expireAt: string;
  };
};

export type TCartSummary = {
  originalAmount: number;
  discountAmount: number;
  finalAmount: number;
  shippingFee: number;
};

export type TCartResult = {
  products: TCartProduct[];
  appliedCoupon: TCoupon | null;
  summary: TCartSummary;
  totalCount: number;
};

export type TGetCartResponse = TCommonResponse<TCartResult>;

export type TCartItemRequest = {
  productId: number;
  optionId: number;
  quantity: number;
  unitPrice?: number;
  totalPrice?: number; // 서버 추가 예정 (Todo: 필수 필드로 변경)
};

export type TCartMutationResponse = TCommonResponse<string>;

export type TDeleteCartItemParams = {
  productId: number;
  optionId?: number;
};
