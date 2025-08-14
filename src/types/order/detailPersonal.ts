export interface ICommonResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
}

export type TOrderStatusBE =
  | 'READY' // 결제 대기
  | 'DONE' // 결제 승인
  | 'CANCELED' // 결제 취소
  | 'ABORTED' // 결제 승인 실패
  | 'EXPIRED' // 유효기간 만료로 거래 취소
  | 'SHIPPING' // 배송 중
  | 'DELIVERED' // 배송 완료
  | 'REFUND_REQUESTED' // 환불(반품) 요청
  | 'REFUND_FAILED' // 환불 실패
  | 'REFUNDED' // 환불 완료
  | 'TEAM_MATCHING_FAILED'; // 팀 매칭 실패(환불 대상 등);

export type TTeamStatusBE = 'MATCHING' | 'COMPLETED' | 'FAILED';

export interface IOrderProduct {
  orderProductId: number;
  status: TOrderStatusBE;

  teamStatus?: TTeamStatusBE;
  matchingStatus?: TTeamStatusBE;
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
  method: string; // NORMAL | BILLING | BRANDPAY 등 BE 코드
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
