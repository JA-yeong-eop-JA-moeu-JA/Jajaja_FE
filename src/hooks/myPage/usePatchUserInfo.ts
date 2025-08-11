import type { TGetUserInfoResponse } from '@/types/member/TGetUserInfo';
import type { TVariables } from '@/types/member/TPatchUserInfo';

import { patchUserInfo } from '@/apis/members/members';

import { useCoreMutation } from '@/hooks/customQuery';

export default function usePatchUserInfo() {
  const { mutate } = useCoreMutation<TGetUserInfoResponse, TVariables>(({ memberId, memberData }) => patchUserInfo(memberId, memberData), {
    onSuccess: () => {
      window.location.replace('/mypage');
    },
  });
  return { mutate };
}
