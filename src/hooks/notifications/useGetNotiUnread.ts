import { QUERY_KEYS } from '@/constants/querykeys/queryKeys';

import { getNotiUnread } from '@/apis/notifications/notifications';

import { useCoreQuery } from '../customQuery';

export default function useGetNotiUnread() {
  const { data } = useCoreQuery(QUERY_KEYS.GET_NOTI_UNREAD, () => getNotiUnread());
  return { data };
}
