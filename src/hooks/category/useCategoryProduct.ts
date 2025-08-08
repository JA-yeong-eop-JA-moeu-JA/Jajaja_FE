// src/hooks/category/useCategoryProducts.ts
import { useMemo } from 'react';

import type { TCategorySort } from '@/types/category';
import { QUERY_KEYS } from '@/constants/querykeys/queryKeys';

import { categoryApi } from '@/apis/category/category';

import { useCoreQuery } from '@/hooks/customQuery';

const SORTS = ['POPULAR', 'NEW', 'PRICE_ASC', 'REVIEW'] as const;
type TSort = (typeof SORTS)[number];
const getSafeSort = (s?: string): TCategorySort => ((SORTS as readonly string[]).includes(s ?? '') ? (s as TSort) : 'NEW');

export function useCategoryProducts(opts: { subcategoryId?: number; sort?: string; page?: number; size?: number }) {
  const { subcategoryId, sort, page = 0, size = 20 } = opts;
  const safeSort = getSafeSort(sort);

  const q = useCoreQuery(
    [QUERY_KEYS.GET_CATEGORY_PRODUCTS, subcategoryId, safeSort, page, size],
    () => categoryApi.getProductsBySubcategory(subcategoryId!, safeSort, page, size),
    { enabled: !!subcategoryId },
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
