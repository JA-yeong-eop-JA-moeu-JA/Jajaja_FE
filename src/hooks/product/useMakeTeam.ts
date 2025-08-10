import { useParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/constants/querykeys/queryKeys';

import { makeTeam } from '@/apis/product/makeTeam';

import { useCoreMutation } from '@/hooks/customQuery';

export default function useMakeTeam() {
  const queryClient = useQueryClient();
  const { id } = useParams<{ id: string }>();
  const { mutate } = useCoreMutation(makeTeam, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_PRODUCT_DETAIL, id] });
    },
  });
  return { mutate };
}
