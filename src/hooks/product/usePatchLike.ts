import { patchLike } from '@/apis/product/like';

import { useCoreMutation } from '@/hooks/customQuery';

export default function usePatchLike() {
  const { mutate } = useCoreMutation(patchLike);
  return { mutate };
}
