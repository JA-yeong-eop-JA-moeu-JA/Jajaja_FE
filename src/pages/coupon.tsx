import { useEffect, useMemo, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import type { TGetCartResponse } from '@/types/cart/TCart';
import type { TCoupons } from '@/types/coupon/TGetCoupons';
import { QUERY_KEYS } from '@/constants/querykeys/queryKeys';

import { getCartItems } from '@/apis/cart/cart';

import { useApplyCoupon, useUnapplyCoupon } from '@/hooks/coupon/useCoupons';
import useInfiniteCoupons from '@/hooks/coupon/useInfiniteCoupons';

import CouponCard from '@/components/coupon/CouponCard';
import PageHeader from '@/components/head_bottom/PageHeader';
import Loading from '@/components/loading';

export default function CouponPage() {
  const [selectedCoupon, setSelectedCoupon] = useState<TCoupons | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const {
    data: couponsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isCouponsLoading,
    error: couponsError,
    refetch: refetchCoupons,
  } = useInfiniteCoupons();

  const { data: cartData } = useQuery({
    queryKey: QUERY_KEYS.GET_CART_ITEMS,
    queryFn: getCartItems,
    staleTime: 5 * 60 * 1000,
  });

  const queryClient = useQueryClient();
  const getAppliedCoupon = () => {
    const data = queryClient.getQueryData<TGetCartResponse>(QUERY_KEYS.GET_CART_ITEMS);
    return data?.result?.appliedCoupon ?? null;
  };

  const { mutate: applyCoupon, isPending: isApplying } = useApplyCoupon();
  const { mutate: unapplyCoupon, isPending: isUnapplying } = useUnapplyCoupon();

  const { ref, inView } = useInView({ threshold: 0 });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  useEffect(() => {
    const appliedCoupon = getAppliedCoupon();
    if (appliedCoupon) {
      setSelectedCoupon(appliedCoupon as any);
    } else {
      setSelectedCoupon(null);
    }
  }, [cartData]);

  const handleCouponSelect = async (coupon: TCoupons) => {
    if (isProcessing || isApplying || isUnapplying) return;

    setIsProcessing(true);
    const currentAppliedCoupon = getAppliedCoupon();

    try {
      if (currentAppliedCoupon && currentAppliedCoupon.couponId === coupon.couponId) {
        await new Promise<void>((resolve, reject) => {
          unapplyCoupon(undefined, {
            onSuccess: () => toast.success('쿠폰이 취소되었습니다'),
            onError: (err) => reject(err),
            onSettled: () => resolve(),
          });
        });
        return;
      }

      await new Promise<void>((resolve, reject) => {
        applyCoupon(coupon.couponId, {
          onSuccess: () => toast.success(`${coupon.couponName} 쿠폰이 적용되었습니다`),
          onError: (err: any) => {
            refetchCoupons();
            let errorMessage = '쿠폰 적용에 실패했습니다';
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
                default:
                  errorMessage = err.response.data.message || errorMessage;
              }
            }
            toast.error(errorMessage);
            reject(err);
          },
          onSettled: () => resolve(),
        });
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const processedCoupons = useMemo(() => {
    const cartTotalAmount = cartData?.result?.summary?.originalAmount || 0;

    const allCoupons = couponsData?.pages.flatMap((page) => page.result.coupons).filter(Boolean) ?? [];

    const couponsWithStatus = allCoupons.map((coupon) => {
      const isExpired = new Date(coupon.applicableConditions.expireAt) <= new Date();
      const isMinAmountMet = cartTotalAmount >= coupon.applicableConditions.minOrderAmount;

      let applicability: 'APPLICABLE' | 'CONDITION_NOT_MET' | 'UNUSABLE';
      if (isExpired) {
        applicability = 'UNUSABLE';
      } else if (!isMinAmountMet) {
        applicability = 'CONDITION_NOT_MET';
      } else {
        applicability = 'APPLICABLE';
      }
      return { ...coupon, applicability };
    });

    couponsWithStatus.sort((a, b) => {
      const order = { APPLICABLE: 0, CONDITION_NOT_MET: 1, UNUSABLE: 2 };
      if (order[a.applicability] !== order[b.applicability]) {
        return order[a.applicability] - order[b.applicability];
      }
      const typeOrder = { FIXED_AMOUNT: 0, PERCENTAGE: 1 };
      if (typeOrder[a.discountType] !== typeOrder[b.discountType]) {
        return typeOrder[a.discountType] - typeOrder[b.discountType];
      }
      return b.discountValue - a.discountValue;
    });

    return couponsWithStatus;
  }, [couponsData, cartData]);

  if (isCouponsLoading) return <LoadingPage />;
  if (couponsError) return <ErrorPage />;

  return (
    <>
      <PageHeader title="쿠폰" />
      <div className="w-full min-h-screen bg-white">
        <div className="flex flex-col gap-3 px-3 py-4">
          {processedCoupons.length === 0 ? (
            <div className="text-center text-body-regular text-black-4 mt-10">사용 가능한 쿠폰이 없습니다</div>
          ) : (
            processedCoupons.map((coupon) => {
              const isClickable = coupon.applicability === 'APPLICABLE';
              const isDisabled = !isClickable || isProcessing || isApplying || isUnapplying;
              const isSelectedNow = selectedCoupon?.couponId === coupon.couponId;

              return (
                <CouponCard
                  key={coupon.couponId}
                  coupon={coupon}
                  isSelected={isSelectedNow}
                  onClick={() => handleCouponSelect(coupon)}
                  disabled={isDisabled}
                  applicability={coupon.applicability}
                />
              );
            })
          )}
        </div>
        <div ref={ref} className="h-2" />
        {(isFetchingNextPage || isApplying || isUnapplying || isProcessing) && (
          <p className="text-center py-4 text-black-4">{isFetchingNextPage ? '더 불러오는 중...' : '쿠폰 처리 중...'}</p>
        )}
      </div>
    </>
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
