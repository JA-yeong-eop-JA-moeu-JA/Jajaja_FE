import { useQueryClient } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/constants/querykeys/queryKeys';

import { deleteRecent } from '@/apis/search/recent';

import { useCoreMutation } from '@/hooks/customQuery';

export default function useDeleteRecent() {
  const queryClient = useQueryClient();
  const { mutate } = useCoreMutation((keywordId: number) => deleteRecent(keywordId), {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.GET_RECENT_SEARCH });
    },
  });
  return { mutate };
}
