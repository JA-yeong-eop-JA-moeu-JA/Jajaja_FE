import { useParams } from 'react-router-dom';

import { QUERY_KEYS } from '@/constants/querykeys/queryKeys';

import { getReviewDetail } from '@/apis/review/review';

import { useCoreQuery } from '@/hooks/customQuery';

export default function useGetReviewDetail() {
  const { id } = useParams<{ id: string }>();
  const { data } = useCoreQuery(QUERY_KEYS.GET_PRODUCT_REVIEW, () => getReviewDetail({ productId: Number(id) }));
  return { data };
}
