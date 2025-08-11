import { useInfiniteQuery } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/constants/querykeys/queryKeys';

import { getCoupons } from '@/apis/coupon/getCoupons';

export default function useInfiniteCoupons() {
  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.GET_COUPONS],
    queryFn: () => getCoupons(), // 매개변수 제거
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const page = lastPage.result.page;
      return page.hasNextPage ? page.currentPage + 1 : undefined;
    },
  });
}
