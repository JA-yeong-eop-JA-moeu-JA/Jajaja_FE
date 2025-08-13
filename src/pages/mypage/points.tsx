import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

import useInfinitePoints from '@/hooks/points/useInfinitePoints';

import PageHeader from '@/components/head_bottom/PageHeader';
import PointCard from '@/components/pointCard';

export default function Points() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfinitePoints();

  const { ref, inView } = useInView({ threshold: 0 });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const balance = data?.pages[0]?.result.pointBalance ?? 0;
  const points = data?.pages.flatMap((page) => page.result.pointHistories) ?? [];

  return (
    <div className="w-full h-screen">
      <PageHeader title="적립금" />
      <div className="w-full flex flex-col items-center justify-center gap-6 px-4 mb-9">
        <div className="flex flex-col items-center justify-center gap-1 w-full border border-black-1 rounded py-4">
          <p className="text-subtitle-medium text-black">현재 보유 적립금</p>
          <p className="text-green-hover text-title-medium">{balance} 원</p>
        </div>
        <div className="w-full px-1">
          {points.map((point) => (
            <PointCard key={point.id} point={point} />
          ))}
        </div>

        <div ref={ref} className="h-2" />

        {isFetchingNextPage && <p className="text-center py-4 text-gray-500">더 불러오는 중...</p>}
      </div>
    </div>
  );
}
