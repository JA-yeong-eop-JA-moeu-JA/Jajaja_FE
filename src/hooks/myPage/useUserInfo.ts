import { QUERY_KEYS } from '@/constants/querykeys/queryKeys';

import { getUserInfo } from '@/apis/myPage/myPage';

import { useCoreQuery } from '@/hooks/customQuery';

export default function useUserInfo() {
  const { data } = useCoreQuery(QUERY_KEYS.GET_USER_INFO, () => getUserInfo());
  return { data };
}
