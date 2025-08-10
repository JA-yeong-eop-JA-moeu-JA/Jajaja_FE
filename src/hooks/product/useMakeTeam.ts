<<<<<<< HEAD
=======
import { useParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/constants/querykeys/queryKeys';

>>>>>>> 35d2fa690a1b38639e4024b3c18395c5cfd32560
import { makeTeam } from '@/apis/product/makeTeam';

import { useCoreMutation } from '@/hooks/customQuery';

export default function useMakeTeam() {
<<<<<<< HEAD
  const { mutate } = useCoreMutation(makeTeam);
=======
  const queryClient = useQueryClient();
  const { id } = useParams<{ id: string }>();
  const { mutate } = useCoreMutation(makeTeam, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_PRODUCT_DETAIL, id] });
    },
  });
>>>>>>> 35d2fa690a1b38639e4024b3c18395c5cfd32560
  return { mutate };
}
