import { deleteRecent } from '@/apis/search/recent';

import { useCoreMutation } from '@/hooks/customQuery';

export default function useDeleteRecent() {
  const { mutate } = useCoreMutation((keywordId: number) => deleteRecent(keywordId));
  return { mutate };
}
