export interface TCommonResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
}

export type OrderStatus = 'PAYED' | 'PREPARING' | 'SHIPPING' | 'DELIVERED' | 'CANCELED' | string;
export type TeamStatus = 'MATCHED' | 'MATCHING' | 'FAILED' | string;

export interface OrderProduct {
  orderProductId: number;
  status: OrderStatus;
  teamStatus?: TeamStatus;
  matchStatus?: '매칭 중' | '매칭 완료' | '매칭 실패';
  product: {
    id: number;
    image: string;
    store: string;
    name: string;
    option: string;
    quantity: number;
  };
  price: number;
}

export interface DeliveryInfo {
  name: string;
  phone: string;
  address: string;
}

export interface PaymentInfo {
  method: string;
  amount: number;
  discount: number;
  pointUsed: number;
  shippingFee: number;
  finalAmount: number;
}

export interface OrderDetailPersonalResult {
  date: string;
  orderNumber: string;
  items: OrderProduct[];
  delivery: DeliveryInfo;
  payment: PaymentInfo;
}
