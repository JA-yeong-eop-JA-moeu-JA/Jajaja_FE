import { useInfiniteQuery } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/constants/querykeys/queryKeys';

import { getReviewable } from '@/apis/review/myReview';

export default function useGetReviewable() {
  return useInfiniteQuery({
    queryKey: QUERY_KEYS.GET_REVIEWABLE,
    queryFn: ({ pageParam = 0 }) => getReviewable({ page: pageParam, size: 5 }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const page = lastPage.result.page;
      return page.hasNextPage ? page.currentPage + 1 : undefined;
    },
  });
}
