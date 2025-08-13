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
  // 팀 구매 관련 필드
  teamPrice?: number;
  individualPrice?: number;
  discountRate?: number;
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
  totalPrice?: number;
};

export type TCartMutationResponse = TCommonResponse<string>;

export type TDeleteCartItemParams = {
  productId: number;
  optionId?: number;
};

// 팀 구매 관련 새 타입들
export type TOrderType = 'individual' | 'team_create' | 'team_join';

export type TPaymentItem = {
  id: number; // 장바구니 아이템 ID
  productId: number;
  optionId: number;
  quantity: number;
  unitPrice: number;
  teamPrice?: number;
  individualPrice?: number;
  productName: string;
  optionName: string;
  productThumbnail: string;
};

export type TPaymentData = {
  orderType: TOrderType;
  selectedItems: TPaymentItem[];
  teamId?: number;
};
