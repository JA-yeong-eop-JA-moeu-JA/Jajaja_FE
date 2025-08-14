import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import type { TGetNoti } from '@/types/notifications/TGetNotiList';
import type { TGetNotiUnread } from '@/types/notifications/TGetNotiUnread';
import { QUERY_KEYS } from '@/constants/querykeys/queryKeys';

import { useModalStore } from '@/stores/modalStore';

export default function Subscriber() {
  const qc = useQueryClient();
  const seenIdsRef = useRef<Set<number>>(new Set());
  const esRef = useRef<EventSource | null>(null);
  const { openModal } = useModalStore();

  useEffect(() => {
    if (esRef.current) return;
    const es = new EventSource('/api/notifications/subscribe', { withCredentials: true });
    esRef.current = es;

    const onAlarm = (evt: Event) => {
      try {
        const n = JSON.parse((evt as MessageEvent).data) as TGetNoti;
        console.log('[SSE] alarm:', n);

        if (n.isRead === false && !seenIdsRef.current.has(n.id)) {
          seenIdsRef.current.add(n.id);

          qc.setQueryData<TGetNotiUnread>(QUERY_KEYS.GET_NOTI_UNREAD, (prev) => {
            const cur = prev?.result?.unreadCount ?? 0;
            return prev
              ? { ...prev, result: { unreadCount: cur + 1 } }
              : ({ isSuccess: true, code: 'OK', message: 'local', result: { unreadCount: 1 } } as TGetNotiUnread);
          });
        }
        if (n.type === 'MATCHING') {
          openModal('confirm', { matching: n });
        }
      } catch (e) {
        console.warn('[SSE] alarm parse error:', evt, e);
      }
    };

    es.addEventListener('alarm', onAlarm);

    es.onopen = () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.GET_NOTI_UNREAD });
    };

    es.onerror = (err) => {
      console.log('[SSE] error', err);
    };

    const onVis = () => {
      if (document.visibilityState === 'visible') {
        qc.invalidateQueries({ queryKey: QUERY_KEYS.GET_NOTI_UNREAD });
      }
    };
    document.addEventListener('visibilitychange', onVis);

    return () => {
      document.removeEventListener('visibilitychange', onVis);
      es.removeEventListener('alarm', onAlarm as any);
      es.close();
      esRef.current = null;
    };
  }, [qc]);

  return null;
}
