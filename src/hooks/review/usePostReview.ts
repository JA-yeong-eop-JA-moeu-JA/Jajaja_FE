import { useQueryClient } from '@tanstack/react-query';

import type { TPostReview, TPostReviewRequest } from '@/types/review/myReview';
import { QUERY_KEYS } from '@/constants/querykeys/queryKeys';

import { postReview } from '@/apis/review/myReview';

import { useCoreMutation } from '@/hooks/customQuery';

export default function usePostReview() {
  const queryClient = useQueryClient();
  const { mutate } = useCoreMutation<TPostReview, TPostReviewRequest>(
    ({ productId, rating, content, imageKeys }) => postReview({ productId, rating, content, imageKeys }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.GET_REVIEWABLE });
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.GET_MY_REVIEW });
      },
    },
  );
  return { mutate };
}
