import type { TCommonResponse } from '@/types/common';

import { deleteReview } from '@/apis/review/myReview';

import { useCoreMutation } from '../customQuery';

export default function useDeleteReview() {
  const { mutate } = useCoreMutation<TCommonResponse<{}>, number>((reviewId) => deleteReview(reviewId));
  return { mutate };
}
