import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { differenceInCalendarDays } from 'date-fns';

import type { TGetNoti } from '@/types/notifications/TGetNotiList';

import useGetNotiList from '@/hooks/notifications/useGetNotiList';
import useGetNotiUnread from '@/hooks/notifications/useGetNotiUnread';
import usePatchNotiReadAll from '@/hooks/notifications/usePatchNotiReadAll';

import PageHeader from '@/components/head_bottom/PageHeader';
import Loading from '@/components/loading';
import NotiCard from '@/components/notiCard';
import NotiCardSkeleton from '@/components/notiCardSkeleton';

export function getDateCategory(dateString?: string): string {
  if (!dateString) return '이전';

  const date = new Date(dateString);
  const today = new Date();
  const diff = differenceInCalendarDays(today, date);

  if (diff === 0) return '오늘';
  if (diff === 1) return '어제';
  if (diff > 1 && diff < 7) return '최근 일주일';
  return '이전';
}

export default function Notifications() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isPending } = useGetNotiList();
  const { mutate: readAll } = usePatchNotiReadAll();
  const { data: unread } = useGetNotiUnread();
  const hasUnread = (unread?.result.unreadCount ?? 0) > 0;

  const { ref, inView } = useInView({ threshold: 0 });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const notis = data?.pages.flatMap((page) => page.result.notifications) ?? [];

  const categories: Record<string, TGetNoti[]> = {
    '오늘': [],
    '어제': [],
    '최근 일주일': [],
    '이전': [],
  };

  notis.forEach((noti: TGetNoti) => {
    const category = getDateCategory(noti.createdAt);
    categories[category].push(noti);
  });

  const handleAllRead = () => {
    if (hasUnread) readAll(null);
  };

  if (isPending) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <div className="w-full h-screen bg-white">
      <PageHeader title="알림" />
      <div className="w-full flex items-center justify-between px-4 text-small-medium">
        <button className="py-3.5 text-orange disabled:text-black-4" disabled={!hasUnread}>
          ✓ 안 읽음
        </button>
        <button className="py-3.5 text-black " onClick={handleAllRead}>
          모두 읽기
        </button>
      </div>

      <div className="w-full flex flex-col items-start justify-center gap-11">
        {Object.entries(categories).map(
          ([category, list]) =>
            list.length > 0 && (
              <div key={category} className="w-full">
                <p className="text-black text-subtitle-medium px-4 text-start pb-2">{category}</p>
                {list.map((noti) => (
                  <NotiCard key={noti.id} {...noti} />
                ))}

                {isFetchingNextPage && Array.from({ length: 5 }).map((_, i) => <NotiCardSkeleton key={i} />)}
                <div ref={ref} className="h-2" />
              </div>
            ),
        )}
      </div>
    </div>
  );
}
