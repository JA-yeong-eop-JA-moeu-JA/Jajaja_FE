// src/hooks/orders/useOrderDetailPersonal.ts
import { QUERY_KEYS } from '@/constants/querykeys/queryKeys';
import { getOrderDetailPersonal } from '@/apis/order/detailPersonal';
import { useCoreQuery } from '@/hooks/customQuery';
import type { IOrderDetailPersonalResult } from '@/types/order/detailPersonal';

export default function useOrderDetailPersonal(orderId: number) {
  const { data } = useCoreQuery(
    [...QUERY_KEYS.GET_ORDER_DETAIL_PERSONAL, orderId],
    () => getOrderDetailPersonal(orderId),
    {
      select: (res) => res.result, // IOrderDetailPersonalResult
      enabled: Number.isFinite(orderId) && orderId > 0,
      staleTime: 60_000,
      retry: 1,
      refetchOnWindowFocus: true,
      // TanStack v4: refetchInterval 인자는 Query 객체
      refetchInterval: (q: any) => {
        const detail = (q?.state?.data ?? null) as IOrderDetailPersonalResult | null;
        const hasMatching = detail?.items?.some((it) => it.teamStatus === 'MATCHING') ?? false;
        return hasMatching ? 8_000 : false; // MATCHING일 때만 8초 폴링
      },
    },
  );

  // ✅ 기존 사용 패턴 유지: { data }만 반환
  return { data };
}
