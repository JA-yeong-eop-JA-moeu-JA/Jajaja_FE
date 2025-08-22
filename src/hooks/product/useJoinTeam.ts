import { toast } from 'sonner';

import type { TJoinRequest } from '@/types/product/joinTeam';

import { joinTeam } from '@/apis/product/joinTeam';

import { useCoreMutation } from '@/hooks/customQuery';

export default function useJoinTeam() {
  return useCoreMutation((params: TJoinRequest) => joinTeam(params), {
    onSuccess: (data) => {
      console.log('팀 참여 성공:', data);
    },
    onError: (error: any) => {
      console.error('Team join failed:', error);
      console.error('Error details:', {
        status: error?.response?.status,
        data: error?.response?.data,
        message: error?.message,
      });

      if (error?.response?.status === 500) {
        toast.error('서버에 일시적인 문제가 발생했습니다. 잠시 후 다시 시도해주세요.');
      } else if (error?.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('팀 참여에 실패했습니다. 잠시 후 다시 시도해주세요.');
      }
    },
  });
}
