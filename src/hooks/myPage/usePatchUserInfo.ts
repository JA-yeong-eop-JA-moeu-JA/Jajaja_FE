import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';

import type { TGetUserInfoResponse } from '@/types/member/TGetUserInfo';
import type { TVariables } from '@/types/member/TPatchUserInfo';
import { QUERY_KEYS } from '@/constants/querykeys/queryKeys';

import { patchUserInfo } from '@/apis/members/members';

import { useCoreMutation } from '@/hooks/customQuery';

export default function usePatchUserInfo() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate } = useCoreMutation<TGetUserInfoResponse, TVariables>(({ memberId, memberData }) => patchUserInfo(memberId, memberData), {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.GET_USER_INFO });
      navigate('/mypage');
    },
  });
  return { mutate };
}
