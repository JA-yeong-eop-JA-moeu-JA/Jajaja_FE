import { QUERY_KEYS } from '@/constants/querykeys/queryKeys';

import { getUserInfo } from '@/apis/members/members';

import { useCoreQuery } from '@/hooks/customQuery';

export default function useUserInfo() {
  const { data } = useCoreQuery(QUERY_KEYS.GET_USER_INFO, () => getUserInfo(), {
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    staleTime: 0,
  });
  return { data };
}
