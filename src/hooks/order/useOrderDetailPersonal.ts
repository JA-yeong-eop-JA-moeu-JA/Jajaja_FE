// src/hooks/orders/useOrderDetailPersonal.ts
import { useCoreQuery } from '@/hooks/customQuery';
import { getOrderDetailPersonal } from '@/apis/order/detailPersonal';
import { QUERY_KEYS } from '@/constants/querykeys/queryKeys';

export default function useOrderDetailPersonal(orderId: number) {
  const { data } = useCoreQuery(
    [...QUERY_KEYS.GET_ORDER_DETAIL_PERSONAL, orderId],
    () => getOrderDetailPersonal(orderId),
    {
      select: (res) => res.result,
      enabled: Number.isFinite(orderId) && orderId > 0,
    }
  );

  return { data };
}
