import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

import useInfiniteCoupons from '@/hooks/coupon/useInfiniteCoupons';

import CouponCard from '@/components/coupon/CouponCard';
import CouponCardSkeleton from '@/components/coupon/CouponCardSkeleton';
import PageHeader from '@/components/head_bottom/PageHeader';
import Loading from '@/components/loading';

export default function Coupons() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isPending } = useInfiniteCoupons();

  const { ref, inView } = useInView({ threshold: 0 });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const coupons = data?.pages.flatMap((page) => page.result.coupons).filter(Boolean) ?? [];

  if (isPending) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <>
      <PageHeader title="쿠폰" />
      <div className="w-full min-h-screen bg-white">
        <div className="flex flex-col gap-3 px-3">
          {coupons.map((coupon) => (
            <CouponCard key={coupon.couponId} coupon={coupon} isSelected={false} onClick={() => {}} applicability="APPLICABLE" disabled={true} />
          ))}

          {isFetchingNextPage && Array.from({ length: 3 }).map((_, i) => <CouponCardSkeleton key={`skeleton-${i}`} />)}
        </div>

        <div ref={ref} className="h-2" />
      </div>
    </>
  );
}
