import { useParams } from 'react-router-dom';

import { QUERY_KEYS } from '@/constants/querykeys/queryKeys';

import { getProductDetail } from '@/apis/product/product';

import { useCoreQuery } from '@/hooks/customQuery';

export default function useGetProductDetail() {
  const { id } = useParams<{ id: string }>();
  const { data } = useCoreQuery(QUERY_KEYS.GET_PRODUCT_DETAIL, () => getProductDetail({ productId: Number(id) }));
  return { data };
}
