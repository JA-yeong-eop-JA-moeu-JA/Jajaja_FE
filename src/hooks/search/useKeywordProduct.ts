import { useMemo } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';

import type { TCategorySort } from '@/types/category';
import { QUERY_KEYS } from '@/constants/querykeys/queryKeys';

import { getProductsByKeyword } from '@/apis/search/search';

// 허용 정렬값
const SORTS = ['POPULAR', 'NEW', 'PRICE_ASC', 'REVIEW'] as const;
type TSort = (typeof SORTS)[number];

// string → TCategorySort 안전 변환
const getSafeSort = (s?: string): TCategorySort => ((SORTS as readonly string[]).includes(s ?? '') ? (s as TSort) : 'POPULAR');

export function useKeywordProducts(opts: { keyword?: string; sort?: string; page?: number; size?: number }) {
  const { keyword, sort, size = 6 } = opts;
  const safeSort: TCategorySort = getSafeSort(sort);
  const { data, isLoading, fetchNextPage, hasNextPage, isFetching, isError, error } = useInfiniteQuery({
    queryKey: [QUERY_KEYS.GET_KEYWORD_PRODUCTS, 'infinite', keyword, safeSort, size],
    queryFn: ({ pageParam = 0 }) => getProductsByKeyword(keyword ?? '', safeSort, pageParam, size),
    enabled: !!keyword,
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const responsePage = lastPage?.result?.page;
      if (!responsePage) return undefined;
      const hasNext =
        typeof responsePage.hasNextPage === 'boolean'
          ? responsePage.hasNextPage
          : typeof responsePage.isLast === 'boolean'
            ? !responsePage.isLast
            : (lastPage?.result?.products?.length ?? 0) === size;
      if (!hasNext) return undefined;
      const current = responsePage.currentPage + 1;
      return current;
    },
  });

  return useMemo(() => {
    return {
      products: data?.pages.flatMap((page) => page.result.products) ?? [],
      pageInfo: data?.pages.flatMap((page) => page.result.page),
      isLoading: isLoading,
      isFetching: isFetching,
      isError: isError,
      error: error as any,
      data,
      fetchNextPage,
      hasNextPage,
    };
  }, [data, isLoading, isFetching, isError, error, fetchNextPage, hasNextPage]);
}
