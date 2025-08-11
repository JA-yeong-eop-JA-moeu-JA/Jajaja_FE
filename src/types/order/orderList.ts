export type TOrderItemProduct = {
  id: number;
  image: string;
  store: string;
  name: string;
  option: string;
  quantity: number;
};

export type TOrderItemStatus = 'SHIPPING' | 'DELIVERED' | 'CANCELLED' | 'PENDING' | string;
export type TTeamStatus = 'MATCHED' | 'MATCHING' | 'FAILED' | string;

export type TOrderItem = {
  orderProductId: number;
  status: TOrderItemStatus;
  teamStatus: TTeamStatus;
  product: TOrderItemProduct;
  price: number;
};

export type TOrder = {
  id: number;
  date: string; // ISO string
  items: TOrderItem[];
};

export type TGetMyOrdersResponse = {
  isSuccess: boolean;
  code: string;
  message: string;
  result?: {
    orders: TOrder[];
  };
};

// UI에서 사용하는 정규화 타입
export interface IOrderItem {
  orderId: number;
  productId: number;
  name: string;
  company: string;
  option: string;
  quantity: number;
  image: string;
  price: number;
  reviewed: boolean;
}

export interface IOrder {
  id: number;
  createdAt: string;      // 주문일자
  items: IOrderItem[];    // 주문 내 아이템 리스트
}
