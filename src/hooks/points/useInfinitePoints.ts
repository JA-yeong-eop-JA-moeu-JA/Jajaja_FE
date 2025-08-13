import { useInfiniteQuery } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/constants/querykeys/queryKeys';

import { getPoints } from '@/apis/points/getPoints';

export default function useInfinitePoints() {
  return useInfiniteQuery({
    queryKey: QUERY_KEYS.GET_POINTS,
    queryFn: ({ pageParam = 0 }) => getPoints({ page: pageParam, size: 5 }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const page = lastPage.result.page;
      return page.hasNextPage ? page.currentPage + 1 : undefined;
    },
  });
}
