import { useParams } from 'react-router-dom';
import { useInfiniteQuery } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/constants/querykeys/queryKeys';

import { getPhotoReview } from '@/apis/review/photoReview';

export default function useGetPhoto(sort: 'LATEST' | 'RECOMMEND') {
  const { id } = useParams<{ id: string }>();
  const productId = Number(id);

  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.GET_PHOTO, productId, sort],
    queryFn: ({ pageParam = 0 }) => getPhotoReview({ productId, sort, page: pageParam, size: 12 }),
    getNextPageParam: (lastPage) => {
      const { page } = lastPage.result;
      return page.hasNextPage ? page.currentPage + 1 : undefined;
    },
    initialPageParam: 0,
  });
}
