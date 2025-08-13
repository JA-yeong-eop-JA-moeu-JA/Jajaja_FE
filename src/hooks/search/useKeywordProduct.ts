// src/hooks/search/useKeywordProducts.ts
import { useMemo } from 'react';

import type { TCategorySort } from '@/types/category';
import { QUERY_KEYS } from '@/constants/querykeys/queryKeys';

import { getProductsByKeyword } from '@/apis/search/search';

import { useCoreQuery } from '@/hooks/customQuery';

// 허용 정렬값
const SORTS = ['POPULAR', 'NEW', 'PRICE_ASC', 'REVIEW'] as const;
type TSort = (typeof SORTS)[number];

// string → TCategorySort 안전 변환
const getSafeSort = (s?: string): TCategorySort => ((SORTS as readonly string[]).includes(s ?? '') ? (s as TSort) : 'POPULAR');

export function useKeywordProducts(opts: { keyword?: string; sort?: string; page?: number; size?: number }) {
  const { keyword, sort, page = 0, size = 20 } = opts;
  const safeSort: TCategorySort = getSafeSort(sort); // ✅ 여기서 확정
  const q = useCoreQuery(
    [QUERY_KEYS.GET_KEYWORD_PRODUCTS, keyword, safeSort, page, size],
    () => getProductsByKeyword(keyword ?? '', safeSort, page, size), // ✅ string 아님, TCategorySort
    { enabled: !!keyword },
  );

  return useMemo(() => {
    const res = q.data;
    return {
      products: res?.result?.products ?? [],
      pageInfo: res?.result?.page,
      isLoading: q.isLoading,
      isFetching: q.isFetching,
      isError: q.isError,
      error: q.error as any,
      raw: res,
    };
  }, [q.data, q.isLoading, q.isFetching, q.isError, q.error]);
}
