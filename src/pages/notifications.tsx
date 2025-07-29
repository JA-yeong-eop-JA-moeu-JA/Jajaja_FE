import { useState } from 'react';

import PageHeader from '@/components/head_bottom/PageHeader';
import NotiCard from '@/components/notiCard';

import { notiData as initialNotiData } from '@/mocks/notiData';

function getDateCategory(dateStr: string) {
  const now = new Date();
  const target = new Date(dateStr.replace(' ', 'T'));
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const targetDay = new Date(target.getFullYear(), target.getMonth(), target.getDate());
  const diff = (today.getTime() - targetDay.getTime()) / (1000 * 60 * 60 * 24);

  if (diff === 0) return '오늘';
  if (diff === 1) return '어제';
  if (diff > 1 && diff < 7) return '최근 일주일';
  return '이전';
}

export default function Notifications() {
  const [notiData, setNotiData] = useState(initialNotiData);
  const hasUnread = notiData.some((noti) => !noti.isRead);

  const categories = {
    '오늘': [] as typeof notiData,
    '어제': [] as typeof notiData,
    '최근 일주일': [] as typeof notiData,
    '이전': [] as typeof notiData,
  };

  notiData.forEach((noti) => {
    const category = getDateCategory(noti.createdAt);
    categories[category].push(noti);
  });

  const handleAllRead = () => {
    setNotiData(notiData.map((noti) => ({ ...noti, isRead: true })));
  };

  const handleRead = (id: number) => {
    setNotiData((notis) => notis.map((noti) => (noti.id === id ? { ...noti, isRead: true } : noti)));
  };

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
                  <NotiCard key={noti.id} {...noti} onRead={handleRead} />
                ))}
              </div>
            ),
        )}
      </div>
    </div>
  );
}
