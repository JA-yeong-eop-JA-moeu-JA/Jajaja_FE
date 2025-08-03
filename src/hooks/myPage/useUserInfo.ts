import { QUERY_KEYS } from '@/constants/querykeys/queryKeys';

import { getUserInfo } from '@/apis/myPage/myPage';

import { useCoreQuery } from '@/hooks/customQuery';

export default function useUserInfo(options?: { enabled?: boolean }) {
  const { data } = useCoreQuery(QUERY_KEYS.GET_USER_INFO, () => getUserInfo(), {
    enabled: options?.enabled ?? true,
  });
  return { data };
}
