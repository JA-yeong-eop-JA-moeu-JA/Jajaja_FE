export interface ICommonResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
}

export type TOrderStatus = 'PAYED' | 'PREPARING' | 'SHIPPING' | 'DELIVERED' | 'CANCELED' | string;
export type TTeamStatus = 'MATCHED' | 'MATCHING' | 'FAILED' | string;

export interface IOrderProduct {
  orderProductId: number;
  status: TOrderStatus;
  teamStatus?: TTeamStatus;
  matchStatus?: '매칭 중' | '매칭 완료' | '매칭 실패';
  teamCreatedAt?: string | null; 
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

export interface IDeliveryInfo {
  name: string;
  phone: string;
  address: string;
}

export interface IPaymentInfo {
  method: string;
  amount: number;
  discount: number;
  pointUsed: number;
  shippingFee: number;
  finalAmount: number;
}

export interface IOrderDetailPersonalResult {
  date: string;
  orderNumber: string;
  items: IOrderProduct[];
  delivery: IDeliveryInfo;
  payment: IPaymentInfo;
}
