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

export type TPurchaseType = 'individual' | 'team_create' | 'team_join';

export type TPaymentItem = {
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
  purchaseType: TPurchaseType;
  selectedItems: TPaymentItem[];
  teamId?: number;
};
