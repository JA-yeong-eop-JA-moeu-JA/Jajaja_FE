import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { toast } from 'sonner';

import type { TCoupons } from '@/types/coupon/TGetCoupons';

import { useCart } from '@/hooks/cart/useCartQuery';
import { useApplyCoupon, useCartCoupon, useUnapplyCoupon } from '@/hooks/coupon/useCoupons';
import useInfiniteCoupons from '@/hooks/coupon/useInfiniteCoupons';

import CouponCard from '@/components/coupon/CouponCard';
import PageHeader from '@/components/head_bottom/PageHeader';
import Loading from '@/components/loading';

export default function CouponPage() {
  const [selectedCoupon, setSelectedCoupon] = useState<TCoupons | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const { data: couponsData, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, error } = useInfiniteCoupons();
  const { mutate: applyCoupon, isPending: isApplying } = useApplyCoupon();
  const { mutate: unapplyCoupon, isPending: isUnapplying } = useUnapplyCoupon();
  const { getAppliedCoupon } = useCartCoupon();
  const { cartData, refetch: refetchCart } = useCart();

  const { ref, inView } = useInView({ threshold: 0 });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  useEffect(() => {
    const appliedCoupon = getAppliedCoupon();
    if (appliedCoupon) {
      setSelectedCoupon(appliedCoupon);
    }
  }, [getAppliedCoupon, cartData]);

  const handleCouponSelect = async (coupon: TCoupons) => {
    if (isProcessing || isApplying || isUnapplying) return;

    setIsProcessing(true);
    const currentAppliedCoupon = cartData?.appliedCoupon;

    try {
      if (currentAppliedCoupon && currentAppliedCoupon.couponId === coupon.couponId) {
        await new Promise<void>((resolve, reject) => {
          unapplyCoupon(undefined, {
            onSuccess: () => {
              setSelectedCoupon(null);
              refetchCart();
              toast.success('쿠폰이 취소되었습니다');
              resolve();
            },
            onError: (err) => {
              toast.error('쿠폰 취소에 실패했습니다');
              reject(err);
            },
          });
        });
        return;
      }

      if (currentAppliedCoupon && currentAppliedCoupon.couponId !== coupon.couponId) {
        await new Promise<void>((resolve, reject) => {
          unapplyCoupon(undefined, {
            onSuccess: () => {
              refetchCart();
              resolve();
            },
            onError: (err) => {
              reject(err);
            },
          });
        });

        await new Promise((resolve) => setTimeout(resolve, 200));
      }

      setSelectedCoupon(coupon);

      await new Promise<void>((resolve, reject) => {
        applyCoupon(coupon.couponId, {
          onSuccess: () => {
            refetchCart();
            toast.success(`${coupon.couponName} 쿠폰이 적용되었습니다`);
            resolve();
          },
          onError: (err: any) => {
            setSelectedCoupon(null);

            let errorMessage = '쿠폰 적용에 실패했습니다';
            if (err.response?.data?.code) {
              switch (err.response.data.code) {
                case 'COUPON4003':
                  errorMessage = '사용할 수 없는 쿠폰입니다'; // Todo: 이미 사용된게 안 없어지고 남아있는 경우
                  break;
                case 'COUPON4001':
                  errorMessage = '이미 사용된 쿠폰입니다';
                  break;
                case 'COUPON4002':
                  errorMessage = '쿠폰 사용 조건을 만족하지 않습니다';
                  break;
                default:
                  errorMessage = err.response.data.message || errorMessage;
              }
            }

            toast.error(errorMessage);
            reject(err);
          },
        });
      });
    } catch (err) {
      console.error('쿠폰 처리 중 오류:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <>
        <PageHeader title="쿠폰" />
        <div className="w-full min-h-screen flex items-center justify-center">
          <Loading />
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <PageHeader title="쿠폰" />
        <div className="w-full h-screen flex justify-center items-center">
          <div className="text-body-regular text-error-3">쿠폰을 불러오는데 실패했습니다</div>
        </div>
      </>
    );
  }

  const coupons = couponsData?.pages.flatMap((page) => page.result.coupons) ?? [];

  return (
    <>
      <PageHeader title="쿠폰" />
      <div className="w-full min-h-screen bg-white">
        <div className="flex flex-col gap-3 px-3 py-4">
          {coupons.length === 0 ? (
            <div className="text-center text-body-regular text-black-4 mt-10">사용 가능한 쿠폰이 없습니다</div>
          ) : (
            <>
              {coupons.map((coupon) => (
                <CouponCard
                  key={coupon.couponId}
                  coupon={coupon}
                  isSelected={selectedCoupon?.couponId === coupon.couponId}
                  onClick={() => handleCouponSelect(coupon)}
                  disabled={isProcessing || isApplying || isUnapplying}
                />
              ))}
            </>
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
