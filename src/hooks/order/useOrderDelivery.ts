import { QUERY_KEYS } from '@/constants/querykeys/queryKeys';

import { getOrderProductDelivery } from '@/apis/order/delivery';

import { useCoreQuery } from '@/hooks/customQuery';

export default function useOrderDelivery(orderProductId: number) {
  const { data, isLoading, isError } = useCoreQuery([...QUERY_KEYS.GET_ORDER_PRODUCT_DELIVERY, orderProductId], () => getOrderProductDelivery(orderProductId), {
    select: (res) => res.result,
    enabled: Number.isFinite(orderProductId) && orderProductId > 0,
  });

  return { data, isLoading, isError };
}
