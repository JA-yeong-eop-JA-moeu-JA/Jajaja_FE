// src/hooks/category/useCategoryProducts.ts
import { useMemo } from 'react';
import { useCoreQuery } from '@/hooks/customQuery';
import { categoryApi} from '@/apis/category/category';
import { QUERY_KEYS } from '@/constants/querykeys/queryKeys';
import type { CategorySort } from '@/types/category';

const SORTS = ['POPULAR', 'NEW', 'PRICE_ASC', 'REVIEW'] as const;
type Sort = typeof SORTS[number];
const getSafeSort = (s?: string): CategorySort =>
  (SORTS as readonly string[]).includes(s ?? '') ? (s as Sort) : 'NEW';

export function useCategoryProducts(opts: {
  subcategoryId?: number;
  sort?: string;
  page?: number;
  size?: number;
}) {
  const { subcategoryId, sort, page = 0, size = 20 } = opts;
  const safeSort = getSafeSort(sort);

  const q = useCoreQuery(
    [QUERY_KEYS.GET_CATEGORY_PRODUCTS, subcategoryId, safeSort, page, size],
    () => categoryApi.getProductsBySubcategory(subcategoryId!, safeSort, page, size),
    { enabled: !!subcategoryId }
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
