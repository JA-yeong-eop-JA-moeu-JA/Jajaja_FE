import { makeTeam } from '@/apis/product/makeTeam';

import { useCoreMutation } from '@/hooks/customQuery';

export default function useMakeTeam() {
  const { mutate } = useCoreMutation(makeTeam);
  return { mutate };
}
