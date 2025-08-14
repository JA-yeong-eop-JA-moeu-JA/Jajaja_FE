import type { IOrderDetailPersonalResult } from '@/types/order/detailPersonal';
import { QUERY_KEYS } from '@/constants/querykeys/queryKeys';

import { getOrderDetailPersonal } from '@/apis/order/detailPersonal';

import { useCoreQuery } from '@/hooks/customQuery';

export default function useOrderDetailPersonal(orderId: number) {
  const { data } = useCoreQuery([...QUERY_KEYS.GET_ORDER_DETAIL_PERSONAL, orderId], () => getOrderDetailPersonal(orderId), {
    select: (res) => res.result,
    enabled: Number.isFinite(orderId) && orderId > 0,
    staleTime: 60_000,
    retry: 1,
    refetchOnWindowFocus: true,
    refetchInterval: (q: any) => {
      const detail = (q?.state?.data ?? null) as IOrderDetailPersonalResult | null;
      const hasMatching = detail?.items?.some((it) => it.teamStatus === 'MATCHING') ?? false;
      return hasMatching ? 8_000 : false;
    },
  });

  return { data };
}
