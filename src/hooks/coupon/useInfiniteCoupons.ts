import { useInfiniteQuery } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/constants/querykeys/queryKeys';

import { getCoupons } from '@/apis/coupon/getCoupons';

export default function useInfiniteCoupons(size: number = 4) {
  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.GET_COUPONS, size],
    queryFn: ({ pageParam = 0 }) => getCoupons(pageParam, size),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const page = lastPage.result.page;
      return page.hasNextPage ? page.currentPage + 1 : undefined;
    },
  });
}
