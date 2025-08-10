import { QUERY_KEYS } from '@/constants/querykeys/queryKeys';

import { getNotiList } from '@/apis/notifications/notifications';

import { useCoreQuery } from '../customQuery';

export default function useGetNotiList() {
  const { data } = useCoreQuery(QUERY_KEYS.GET_NOTI_LIST, () => getNotiList());
  return { data };
}
