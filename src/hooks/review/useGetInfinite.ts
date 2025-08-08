import { useParams } from 'react-router-dom';
import { useInfiniteQuery } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/constants/querykeys/queryKeys';

import { getReviewInfinite } from '@/apis/review/review';

export default function useGetInfinite(sort: 'NEW' | 'LATEST' | 'RECOMMEND') {
  const { id } = useParams<{ id: string }>();
  const productId = Number(id);

  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.GET_PRODUCT_REVIEW, productId, sort],
    queryFn: ({ pageParam = 0 }) => getReviewInfinite({ productId, sort, page: pageParam, size: 5 }),
    getNextPageParam: (lastPage) => {
      const { page } = lastPage.result;
      return page.hasNextPage ? page.currentPage + 1 : undefined;
    },
    initialPageParam: 0,
  });
}
