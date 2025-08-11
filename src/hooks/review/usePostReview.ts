import type { TPostReview, TPostReviewRequest } from '@/types/review/myReview';

import { postReview } from '@/apis/review/myReview';

import { useCoreMutation } from '@/hooks/customQuery';

export default function usePostReview() {
  const { mutate } = useCoreMutation<TPostReview, TPostReviewRequest>(
    ({ productId, rating, content, imageKeys }) => postReview({ productId, rating, content, imageKeys }),
    {
      onSuccess: () => {
        window.location.replace('/mypage/review');
      },
    },
  );
  return { mutate };
}
