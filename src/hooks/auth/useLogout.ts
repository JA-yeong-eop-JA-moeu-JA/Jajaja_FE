import type { TCommonResponse } from '@/types/common';

import { logout } from '@/apis/auth/auth';

import { useCoreMutation } from '@/hooks/customQuery';

export default function useLogout() {
  const { mutate } = useCoreMutation<TCommonResponse<{}>, void>(() => logout(), {
    onSuccess: () => {
      window.location.replace('/home');
    },
  });

  return { logout: mutate };
}
