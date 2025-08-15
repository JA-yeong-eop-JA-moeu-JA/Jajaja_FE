import { QUERY_KEYS } from '@/constants/querykeys/queryKeys';

import { getNotiUnread } from '@/apis/notifications/notifications';

import { useCoreQuery } from '../customQuery';

import { useAuth } from '@/context/AuthContext';

export default function useGetNotiUnread() {
  const { isLoggedIn } = useAuth();
  const { data } = useCoreQuery(QUERY_KEYS.GET_NOTI_UNREAD, () => getNotiUnread(), {
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    enabled: isLoggedIn,
  });
  const count = data?.result?.unreadCount ?? 0;

  return { data, count };
}
