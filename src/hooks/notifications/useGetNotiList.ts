import { useInfiniteQuery } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/constants/querykeys/queryKeys';

import { getNotiList } from '@/apis/notifications/notifications';

export default function useGetNotiList() {
  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.GET_NOTI_LIST],
    queryFn: ({ pageParam = 0 }) => getNotiList({ page: pageParam, size: 10 }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const page = lastPage.result.page;
      return page.hasNextPage ? page.currentPage + 1 : undefined;
    },
  });
}
