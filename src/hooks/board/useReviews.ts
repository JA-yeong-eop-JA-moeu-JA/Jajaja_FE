import type { TGetReviewsSuccess, TReviewSort } from '@/types/board/reviewBoard';
import { QUERY_KEYS } from '@/constants/querykeys/queryKeys';

import { getReviews } from '@/apis/board/reviewBoard';

import { useCoreQuery } from '@/hooks/customQuery';

type TUseReviewsParams = {
  sort?: TReviewSort | 'LATEST' | 'RECOMMEND';
  page?: number;
  size?: number;
  enabled?: boolean;
};

export const useReviews = (params: TUseReviewsParams) => {
  const DEFAULT_SIZE = 6;
  const page = params.page ?? 0;
  const size = params.size ?? DEFAULT_SIZE;
  const sortForApi = (params.sort ?? 'LATEST').toString().toUpperCase() as TReviewSort;

  const query = useCoreQuery(
    [QUERY_KEYS.GET_REVIEWS, sortForApi, page, size],
    async () => {
      const res = await getReviews({ sort: sortForApi, page, size });
      if (res.isSuccess) return res as TGetReviewsSuccess;

      if (!res.isSuccess && res.code === 'REVIEW4001') {
        return {
          isSuccess: true,
          code: 'COMMON200',
          message: 'empty',
          result: {
            page: { size, totalElements: 0, currentElements: 0, totalPages: 0, currentPage: page, hasNextPage: false, hasPreviousPage: page > 0, isLast: true },
            reviews: [],
          },
        } as TGetReviewsSuccess;
      }
      throw new Error(res.message || '리뷰 조회 실패');
    },
    {
      staleTime: 30 * 1000,
      enabled: params.enabled ?? true,
    },
  );

  return {
    reviews: query.data?.result?.reviews ?? [],
    page: query.data?.result?.page,
    isLoading: query.isLoading,
    isError: query.isError,
    isFetched: query.isFetched,
    error: query.error,
    refetch: query.refetch,
  };
};
