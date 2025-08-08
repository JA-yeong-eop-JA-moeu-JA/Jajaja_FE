import { joinTeam } from '@/apis/product/joinTeam';

import { useCoreMutation } from '@/hooks/customQuery';

export default function useJoinTeam() {
  const { mutate } = useCoreMutation((teamId: number) => joinTeam({ teamId }));
  return { mutate };
}
