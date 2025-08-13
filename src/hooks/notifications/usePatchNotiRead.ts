import { useQueryClient } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/constants/querykeys/queryKeys';

import { patchNotiRead } from '@/apis/notifications/notifications';

import { useCoreMutation } from '../customQuery';

export default function usePatchNotiRead() {
  const queryClient = useQueryClient();
  const { mutate } = useCoreMutation(patchNotiRead, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.GET_NOTI_LIST });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.GET_NOTI_UNREAD });
    },
  });
  return { mutate };
}
