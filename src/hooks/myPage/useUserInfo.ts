import { QUERY_KEYS } from '@/constants/querykeys/queryKeys';

import { getUserInfo } from '@/apis/members/members';

import { useCoreQuery } from '@/hooks/customQuery';

type TOptions = {
  enabled?: boolean;
};

export default function useUserInfo(options?: TOptions) {
  const { enabled = true } = options ?? {};
  const { data, isError, isLoading, refetch } = useCoreQuery(QUERY_KEYS.GET_USER_INFO, () => getUserInfo(), {
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    staleTime: 0,
    enabled,
    retry: false,
  });
  return { data, isError, isLoading, refetch };
}
