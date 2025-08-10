import { useParams } from 'react-router-dom';

import { QUERY_KEYS } from '@/constants/querykeys/queryKeys';

import { getProductDetail } from '@/apis/product/product';

import { useCoreQuery } from '@/hooks/customQuery';

export default function useGetProductDetail() {
  const { id } = useParams<{ id: string }>();
<<<<<<< HEAD
  const { data } = useCoreQuery(QUERY_KEYS.GET_PRODUCT_DETAIL, () => getProductDetail({ productId: Number(id) }));
=======
  const { data } = useCoreQuery([QUERY_KEYS.GET_PRODUCT_DETAIL, id], () => getProductDetail({ productId: Number(id) }));
>>>>>>> 35d2fa690a1b38639e4024b3c18395c5cfd32560
  return { data };
}
