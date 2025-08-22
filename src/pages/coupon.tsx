import { useEffect, useMemo, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

import type { TCoupons } from '@/types/coupon/TGetCoupons';
import { QUERY_KEYS } from '@/constants/querykeys/queryKeys';

import { getCartItems } from '@/apis/cart/cart';

import { useApplyCoupon, useUnapplyCoupon } from '@/hooks/coupon/useCoupons';
import useInfiniteCoupons from '@/hooks/coupon/useInfiniteCoupons';

import CouponCard from '@/components/coupon/CouponCard';
import PageHeader from '@/components/head_bottom/PageHeader';
import Loading from '@/components/loading';

type TCouponWithStatus = TCoupons & {
  applicability: 'APPLICABLE' | 'CONDITION_NOT_MET' | 'UNUSABLE';
};

export default function CouponPage() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [failedCoupons, setFailedCoupons] = useState<Set<number>>(new Set());

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

  const {
    data: couponsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isCouponsLoading,
    error: couponsError,
    refetch: refetchCoupons,
  } = useInfiniteCoupons();

  const { data: cartData, isLoading: isCartLoading } = useQuery({
    queryKey: QUERY_KEYS.GET_CART_ITEMS,
    queryFn: getCartItems,
  });

  const { mutateAsync: applyCoupon, isPending: isApplying } = useApplyCoupon();
  const { mutateAsync: unapplyCoupon, isPending: isUnapplying } = useUnapplyCoupon();

  const { ref, inView } = useInView({ threshold: 0 });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleCouponSelect = async (coupon: TCoupons) => {
    if (isProcessing || isApplying || isUnapplying) return;

    if (failedCoupons.has(coupon.couponId)) {
      toast.error('이 쿠폰은 현재 사용할 수 없습니다. 다른 쿠폰을 선택해주세요.');
      return;
    }

    setIsProcessing(true);
    const currentAppliedCoupon = cartData?.result?.appliedCoupon;

    try {
      if (!coupon.couponId || !coupon.couponName) {
        throw new Error('올바르지 않은 쿠폰 정보입니다.');
      }

      if (!coupon.isApplicable) {
        throw new Error('현재 장바구니 상품에는 사용할 수 없는 쿠폰입니다.');
      }

      if (currentAppliedCoupon?.couponId === coupon.couponId) {
        await unapplyCoupon();
        toast.success('쿠폰이 취소되었습니다');
      } else if (currentAppliedCoupon) {
        await unapplyCoupon();
        await applyCoupon(coupon.couponId);
        toast.success(`${coupon.couponName} 쿠폰이 적용되었습니다`);
      } else {
        await applyCoupon(coupon.couponId);
        toast.success(`${coupon.couponName} 쿠폰이 적용되었습니다`);
      }
    } catch (err: any) {
      setFailedCoupons((prev) => new Set([...prev, coupon.couponId]));

      refetchCoupons();
      let errorMessage = '쿠폰 처리에 실패했습니다';

      if (err.response?.data?.code) {
        switch (err.response.data.code) {
          case 'COUPON4001':
            errorMessage = '이미 사용된 쿠폰입니다';
            break;
          case 'COUPON4002':
            errorMessage = '쿠폰 사용 조건을 만족하지 않습니다';
            break;
          case 'COUPON4003':
            errorMessage = '사용할 수 없는 쿠폰입니다';
            break;
          case 'COMMON500':
            errorMessage = '서버에서 쿠폰 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
            break;
          default:
            errorMessage = err.response.data.message || errorMessage;
        }
      } else if (err.message) {
        errorMessage = err.message;
      }

      toast.error(errorMessage);
    } finally {
      setIsProcessing(false);
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
              const isDisabled = !isClickable || isProcessing || isApplying || isUnapplying;
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
        {(isFetchingNextPage || isProcessing) && (
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
