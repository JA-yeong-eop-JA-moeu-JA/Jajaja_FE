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
  teamCreatedAt: string | null;
  product: TOrderItemProduct;
  price: number | null;
};

export type TOrder = {
  id: number;
  date: string | null; 
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

export type TGetMyOrdersRequest = {
  page?: number;
  size?: number;
  sort?: `${string},${'asc' | 'desc'}` | string;
};



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
  teamCreatedAt?: string | null;
}

export interface IOrder {
  id: number;
  createdAt: string;
  items: IOrderItem[];
}
