import { useParams } from 'react-router-dom';

import { QUERY_KEYS } from '@/constants/querykeys/queryKeys';

import { getOptionList } from '@/apis/product/option';

import { useCoreQuery } from '@/hooks/customQuery';

export default function useGetOption() {
  const { id } = useParams<{ id: string }>();

  const { data } = useCoreQuery(QUERY_KEYS.GET_PRODUCT_OPTIONS(Number(id)), () => getOptionList({ productId: Number(id) }), {
    enabled: !!id,
  });

  return { data };
}
