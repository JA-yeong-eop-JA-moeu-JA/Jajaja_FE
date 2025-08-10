import type { TGetReviewsSuccess, TReviewSort } from '@/types/board/reviewBoard';
import { QUERY_KEYS } from '@/constants/querykeys/queryKeys';

import { getReviews } from '@/apis/board/reviewBoard';

import { useCoreQuery } from '@/hooks/customQuery';

type TUseReviewsParams = {
  sort?: TReviewSort;
  page?: number;
};

export const useReviews = (params: TUseReviewsParams) => {
  const DEFAULT_SIZE = 5;

  const query = useCoreQuery(
    // ✅ key는 sort/page만 포함 (size는 고정)
    [QUERY_KEYS.GET_REVIEWS, params.sort ?? 'latest', params.page ?? 0],
    async () => {
      const res = await getReviews({ ...params, size: DEFAULT_SIZE });
      if (res.isSuccess) return res as TGetReviewsSuccess;

      if (!res.isSuccess && res.code === 'REVIEW4001') {
        return {
          isSuccess: true,
          code: 'COMMON200',
          message: 'empty',
          result: {
            page: {
              size: DEFAULT_SIZE, // ✅ 고정값 사용
              totalElements: 0,
              currentElements: 0,
              totalPages: 0,
              currentPage: params.page ?? 0,
              hasNextPage: false,
              hasPreviousPage: (params.page ?? 0) > 0,
              isLast: true,
            },
            reviews: [],
          },
        } as TGetReviewsSuccess;
      }

      throw new Error(res.message || '리뷰 조회 실패');
    },
    {
      staleTime: 30 * 1000,
    },
  );

  const reviews = query.data?.result?.reviews ?? [];
  const page = query.data?.result?.page;

  return {
    reviews,
    page,
    isLoading: query.isLoading,
    isError: query.isError,
    isFetched: query.isFetched,
    error: query.error,
    refetch: query.refetch,
  };
};
