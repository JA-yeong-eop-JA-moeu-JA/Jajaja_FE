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
  discountType: 'PERCENTAGE' | 'FIXED_AMOUNT';
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
  availableCouponsCount: number;
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

export type TOrderType = 'individual' | 'team_create' | 'team_join';

export type TPaymentItem = {
  brand?: string;
  store?: string;
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

export type TLocalCartItem = {
  id: string; // 로컬에서 생성하는 임시 id
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
  addedAt: string;
};

export type TLocalCartStorage = {
  items: TLocalCartItem[];
  lastUpdated: string;
};

export interface ICartItem {
  productId: number;
  productName: string;
  store: string;
  optionName: string;
  quantity: number;
  price: number;
  totalPrice: number;
  imageUrl: string;
  productThumbnail: string;
  brand: string;
  id: number; // cartItemId
  optionId: number;
  unitPrice: number;
  originalPrice: number;
  teamAvailable: boolean;
}

export type TTeamJoinCartRequest = {
  selectedOptions: Array<{
    cartItemId: number;
    optionId: number;
    quantity: number;
  }>;
};
