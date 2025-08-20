import { toast } from 'sonner';

import { joinTeam } from '@/apis/product/joinTeam';

import { useCoreMutation } from '@/hooks/customQuery';

export default function useJoinTeam() {
  return useCoreMutation((teamId: number) => joinTeam({ teamId }), {
    onError: (error: any) => {
      console.error('Team join failed:', error);
      if (error?.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('팀 참여에 실패했습니다. 잠시 후 다시 시도해주세요.');
      }
    },
  });
}
