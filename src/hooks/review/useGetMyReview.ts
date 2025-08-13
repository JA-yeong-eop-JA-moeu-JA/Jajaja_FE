import { useInfiniteQuery } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/constants/querykeys/queryKeys';

import { getMyReview } from '@/apis/review/myReview';

export default function useGetMyReview() {
  return useInfiniteQuery({
    queryKey: QUERY_KEYS.GET_MY_REVIEW,
    queryFn: ({ pageParam = 0 }) => getMyReview({ page: pageParam, size: 5 }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const page = lastPage.result.page;
      return page.hasNextPage ? page.currentPage + 1 : undefined;
    },
  });
}
