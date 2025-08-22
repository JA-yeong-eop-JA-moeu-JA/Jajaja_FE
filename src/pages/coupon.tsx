import { useEffect, useMemo, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { useQuery } from '@tanstack/react-query';

import type { TCoupons } from '@/types/coupon/TGetCoupons';
import { QUERY_KEYS } from '@/constants/querykeys/queryKeys';

import { getCartItems } from '@/apis/cart/cart';

import { useSafeApplyCoupon, useUnapplyCoupon } from '@/hooks/coupon/useCoupons';
import useInfiniteCoupons from '@/hooks/coupon/useInfiniteCoupons';

import CouponCard from '@/components/coupon/CouponCard';
import PageHeader from '@/components/head_bottom/PageHeader';
import Loading from '@/components/loading';

type TCouponWithStatus = TCoupons & {
  applicability: 'APPLICABLE' | 'CONDITION_NOT_MET' | 'UNUSABLE';
};

export default function CouponPage() {
  const [failedCoupons] = useState<Set<number>>(new Set());

  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }

    const resetScroll = () => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };

    resetScroll();
    requestAnimationFrame(resetScroll);

    return () => {
      if ('scrollRestoration' in history) {
        history.scrollRestoration = 'auto';
      }
    };
  }, []);

  const { data: couponsData, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading: isCouponsLoading, error: couponsError } = useInfiniteCoupons();

  const { data: cartData, isLoading: isCartLoading } = useQuery({
    queryKey: QUERY_KEYS.GET_CART_ITEMS,
    queryFn: getCartItems,
  });

  const { safeApplyCoupon, isLoading: isSafeApplying } = useSafeApplyCoupon();
  const { mutate: unapplyCoupon, isPending: isUnapplying } = useUnapplyCoupon();

  const { ref, inView } = useInView({ threshold: 0 });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleCouponSelect = (coupon: TCoupons) => {
    const isCurrentlyApplied = cartData?.result?.appliedCoupon?.couponId === coupon.couponId;

    if (isCurrentlyApplied) {
      unapplyCoupon();
    } else {
      safeApplyCoupon(coupon.couponId);
    }
  };

  const processedCoupons = useMemo(() => {
    if (!couponsData || !cartData) return [];

    const allCoupons = couponsData.pages.flatMap((page) => page.result.coupons).filter(Boolean);
    const orderAmount = cartData.result.summary.originalAmount;

    const couponsWithStatus = allCoupons.map((coupon): TCouponWithStatus => {
      if (!coupon || !coupon.couponId || !coupon.applicableConditions) {
        return { ...coupon, applicability: 'UNUSABLE' };
      }

      if (!coupon.isApplicable) {
        if (orderAmount < coupon.applicableConditions.minOrderAmount) {
          return { ...coupon, applicability: 'CONDITION_NOT_MET' };
        }
        return { ...coupon, applicability: 'UNUSABLE' };
      }

      if (orderAmount < coupon.applicableConditions.minOrderAmount) {
        return { ...coupon, applicability: 'CONDITION_NOT_MET' };
      }

      return { ...coupon, applicability: 'APPLICABLE' };
    });

    couponsWithStatus.sort((a, b) => {
      const order = { APPLICABLE: 0, CONDITION_NOT_MET: 1, UNUSABLE: 2 };
      const statusDiff = order[a.applicability] - order[b.applicability];

      if (statusDiff !== 0) {
        return statusDiff;
      }

      if (a.applicability === 'APPLICABLE') {
        const aDiscount = a.discountType === 'PERCENTAGE' ? Math.floor(orderAmount * (a.discountValue / 100)) : a.discountValue;
        const bDiscount = b.discountType === 'PERCENTAGE' ? Math.floor(orderAmount * (b.discountValue / 100)) : b.discountValue;
        return bDiscount - aDiscount;
      }

      return b.discountValue - a.discountValue;
    });

    return couponsWithStatus;
  }, [couponsData, cartData]);

  if (isCouponsLoading || isCartLoading) return <LoadingPage />;
  if (couponsError) return <ErrorPage />;

  return (
    <div className="w-full min-h-screen bg-white">
      <PageHeader title="쿠폰" />
      <div className="w-full min-h-screen bg-white">
        <div className="flex flex-col gap-3 px-3 py-4">
          {processedCoupons.length === 0 ? (
            <div className="text-center text-body-regular text-black-4 mt-10">사용 가능한 쿠폰이 없습니다</div>
          ) : (
            processedCoupons.map((coupon) => {
              const isClickable = coupon.applicability === 'APPLICABLE' && !failedCoupons.has(coupon.couponId);
              const isDisabled = !isClickable || isSafeApplying || isUnapplying;
              const isSelectedNow = cartData?.result?.appliedCoupon?.couponId === coupon.couponId;
              const hasFailed = failedCoupons.has(coupon.couponId);

              return (
                <div key={coupon.couponId} className="relative">
                  <CouponCard
                    coupon={coupon}
                    isSelected={isSelectedNow}
                    onClick={() => handleCouponSelect(coupon)}
                    disabled={isDisabled}
                    applicability={hasFailed ? 'UNUSABLE' : coupon.applicability}
                  />
                </div>
              );
            })
          )}
        </div>
        <div ref={ref} className="h-2" />
        {(isFetchingNextPage || isSafeApplying || isUnapplying) && (
          <p className="text-center py-4 text-black-4">{isFetchingNextPage ? '더 불러오는 중...' : '쿠폰 처리 중...'}</p>
        )}
      </div>
    </div>
  );
}

function LoadingPage() {
  return (
    <>
      <PageHeader title="쿠폰" />
      <div className="w-full min-h-screen flex items-center justify-center">
        <Loading />
      </div>
    </>
  );
}

function ErrorPage() {
  return (
    <>
      <PageHeader title="쿠폰" />
      <div className="w-full h-screen flex justify-center items-center">
        <div className="text-body-regular text-error-3">쿠폰을 불러오는데 실패했습니다</div>
      </div>
    </>
  );
}
