import { postCategory } from '@/apis/onBoarding/onBoarding';

import { useCoreMutation } from '@/hooks/customQuery';

export default function useCategory() {
  const { data, mutate } = useCoreMutation(postCategory);
  return { data, mutate };
}
