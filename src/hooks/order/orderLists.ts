import type { IOrder, IOrderItem, TOrder } from '@/types/order/orderList';
import { QUERY_KEYS } from '@/constants/querykeys/queryKeys';
import { getMyOrders } from '@/apis/order/orderList';
import { useCoreQuery } from '@/hooks/customQuery';

const toStr = (v: any, def = '') => (v == null ? def : String(v));
const toNum = (v: any, def = 0) => (v == null ? def : Number(v));

const mapToIOrders = (orders?: TOrder[] | null): IOrder[] =>
  (orders ?? []).map<IOrder>((o) => ({
    id: toNum(o.id),
    createdAt: toStr(o.date),
    items: (o.items ?? []).map<IOrderItem>((it) => ({
      orderId: toNum(o.id),
      productId: toNum(it?.product?.id),
      name: toStr(it?.product?.name),
      company: toStr(it?.product?.store),
      option: toStr(it?.product?.option),
      quantity: toNum(it?.product?.quantity, 1),
      image: toStr(it?.product?.image),
      price: toNum(it?.price),
      reviewed: false,
    })),
  }));

export const useMyOrders = (opts?: { page?: number; size?: number; sort?: string }) => {
  const { page = 0, size = 1, sort } = opts ?? {};
  return useCoreQuery<IOrder[]>(
    [QUERY_KEYS.GET_MY_ORDERS, page, size, sort],
    async () => {
      if (import.meta.env.DEV) console.log('[useMyOrders] fetch start', { page, size, sort });
      const data = await getMyOrders({ page, size, sort }); // ← data 전체 반환
      const mapped = mapToIOrders(data.result?.orders);     // ← 여기서 orders 꺼냄
      if (import.meta.env.DEV) console.log('[useMyOrders] fetch done, mapped count:', mapped.length);
      return mapped;
    },
    { staleTime: 60_000, retry: 1 },
  );
};
