import { type InfiniteData, useQueryClient } from '@tanstack/react-query';

import type { TCommonResponse } from '@/types/common';
import type { TReviewInfiniteResponse } from '@/types/review/review';
import { QUERY_KEYS } from '@/constants/querykeys/queryKeys';

import { deleteReview } from '@/apis/review/myReview';

import { useCoreMutation } from '../customQuery';

export default function useDeleteReview() {
  const queryClient = useQueryClient();

  const { mutate } = useCoreMutation<TCommonResponse<{}>, number>((reviewId) => deleteReview(reviewId), {
    onMutate: async (reviewId) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.GET_MY_REVIEW });
      const prevData = queryClient.getQueryData<InfiniteData<TReviewInfiniteResponse>>(QUERY_KEYS.GET_MY_REVIEW);

      queryClient.setQueryData<InfiniteData<TReviewInfiniteResponse>>(QUERY_KEYS.GET_MY_REVIEW, (old) => {
        if (!old) return old;

        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            reviews: page.result.reviews.filter((r) => r.review.id !== reviewId),
          })),
        };
      });

      return { prevData };
    },

    onError: (_error, _reviewId, context) => {
      const ctx = context as { prevData?: TReviewInfiniteResponse };
      if (ctx?.prevData) {
        queryClient.setQueryData(QUERY_KEYS.GET_MY_REVIEW, ctx.prevData);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.GET_MY_REVIEW });
    },
  });

  return { mutate };
}
