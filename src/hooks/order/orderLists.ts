import { useCoreQuery } from '@/hooks/customQuery';
import { QUERY_KEYS } from '@/constants/querykeys/queryKeys';
import { getMyOrders } from '@/apis/order/orderList';
import type { TOrder, IOrder, IOrderItem } from '@/types/order/orderList';


const mapToIOrders = (orders: TOrder[]): IOrder[] =>
  orders.map<IOrder>((o) => ({
    id: o.id,
    createdAt: o.date, // date → createdAt
    items: o.items.map<IOrderItem>((it) => ({
      orderId: o.id,
      productId: it.product.id,
      name: it.product.name,
      company: it.product.store,
      option: it.product.option,
      quantity: it.product.quantity,
      image: it.product.image,
      price: it.price,
      reviewed: false, // TODO: API 필드 있으면 대체
    })),
  }));

export const useMyOrders = () => {
  return useCoreQuery<IOrder[]>(
    [QUERY_KEYS.GET_MY_ORDERS],
    async () => {
      const orders = await getMyOrders(); // TOrder[]
      return mapToIOrders(orders);        // IOrder[]로 변환
    },
    {
      staleTime: 60 * 1000,
      retry: 1,
    }
  );
};