export type TOrderItemProduct = {
  id: number;
  image: string | null;
  store: string | null;
  name: string | null;
  option: string | null;
  quantity: number | null;
};

export type TOrderItem = {
  orderProductId: number;
  status: string | null;
  teamStatus: string | null;
  product: TOrderItemProduct;
  price: number | null;
};

export type TOrder = {
  id: number;
  date: string | null; // ISO string
  items: TOrderItem[] | null;
};

export type TPage = {
  size: number;
  totalElements: number;
  currentElements: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  isLast: boolean;
};

export type TGetMyOrdersResponse = {
  isSuccess: boolean;
  code: string;
  message: string;
  result?: {
    page?: TPage;
    orders: TOrder[];
  };
};

// ✅ 요청 파라미터 타입 추가 (page/size/sort)
export type TGetMyOrdersRequest = {
  page?: number;
  size?: number;
  // 보통 스프링은 'createdAt,desc' 형식 권장
  sort?: `${string},${'asc' | 'desc'}` | string;
};

// ====== (선택) 백엔드 enum 합의 후 엄격 타입으로 바꾸고 싶을 때 ======
// export type OrderStatus = 'PENDING' | 'PAID' | 'SHIPPING' | 'DELIVERED' | 'CANCELED' | 'DONE';
// export type TeamStatus  = 'MATCHED' | 'MATCHING' | 'FAILED' | 'NONE';
// export type TOrderItem = {
//   orderProductId: number;
//   status: OrderStatus | null;
//   teamStatus: TeamStatus | null;
//   product: TOrderItemProduct;
//   price: number | null;
// };

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

  orderStatus?: string | null;
  matchStatus?: string | null;
}

export interface IOrder {
  id: number;
  createdAt: string; // 화면용 날짜 포맷(예: '2025.08.12')
  items: IOrderItem[];
}
