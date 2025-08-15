import { useInfiniteQuery } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/constants/querykeys/queryKeys';

import { getCouponsWithPaging } from '@/apis/coupon/getCoupons';

export default function useInfiniteCoupons() {
  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.GET_COUPONS_INFINITE],
    queryFn: ({ pageParam = 0 }) => getCouponsWithPaging(pageParam, 1),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const page = lastPage.result.page;
      return page.hasNextPage ? page.currentPage + 1 : undefined;
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 1,
  });
}
