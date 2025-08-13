// src/hooks/orders/useOrderDetailPersonal.ts
import { QUERY_KEYS } from '@/constants/querykeys/queryKeys';

import { getOrderDetailPersonal } from '@/apis/order/detailPersonal';

import { useCoreQuery } from '@/hooks/customQuery';

export default function useOrderDetailPersonal(orderId: number) {
  const { data } = useCoreQuery([...QUERY_KEYS.GET_ORDER_DETAIL_PERSONAL, orderId], () => getOrderDetailPersonal(orderId), {
    select: (res) => res.result,
    enabled: Number.isFinite(orderId) && orderId > 0,
  });

  return { data };
}
