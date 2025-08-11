import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

import useInfiniteCoupons from '@/hooks/coupon/useInfiniteCoupons';

import CouponCard from '@/components/coupon/CouponCard';
import PageHeader from '@/components/head_bottom/PageHeader';

export default function Coupons() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteCoupons();

  const { ref, inView } = useInView({ threshold: 0 });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const coupons = data?.pages.flatMap((page) => page.result.coupons) ?? [];

  return (
    <>
      <PageHeader title="쿠폰" />
      <div className="w-full h-screen bg-white">
        <div className="flex flex-col gap-3 px-3">
          {coupons.map((coupon) => (
            <CouponCard key={coupon.couponId} coupon={coupon} isSelected={false} onClick={() => {}} />
          ))}
        </div>

        <div ref={ref} className="h-2" />

        {isFetchingNextPage && <p className="text-center py-4 text-gray-500">더 불러오는 중...</p>}
      </div>
    </>
  );
}
