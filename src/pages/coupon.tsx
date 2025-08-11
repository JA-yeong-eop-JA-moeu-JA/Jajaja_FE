import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import type { TCoupons } from '@/types/coupon/TGetCoupons';

import { useAppliedCoupon, useApplyCoupon, useCoupons } from '@/hooks/coupon/useCoupons';

import CouponCard from '@/components/coupon/CouponCard';
import PageHeader from '@/components/head_bottom/PageHeader';

export default function CouponPage() {
  const navigate = useNavigate();
  const [selectedCoupon, setSelectedCoupon] = useState<TCoupons | null>(null);

  const { data: couponsData, isLoading, error } = useCoupons();
  const { mutate: applyCoupon, isPending: isApplying } = useApplyCoupon();
  const { getAppliedCoupon } = useAppliedCoupon();

  useEffect(() => {
    const appliedCoupon = getAppliedCoupon();
    if (appliedCoupon) {
      setSelectedCoupon(appliedCoupon);
    }
  }, []);

  const handleCouponSelect = (coupon: TCoupons) => {
    if (isApplying) return;

    setSelectedCoupon(coupon);

    applyCoupon(coupon.couponId, {
      onSuccess: () => {
        setTimeout(() => {
          navigate(-1);
        }, 2000);
      },
      onError: (err) => {
        console.error('쿠폰 적용 실패:', err);
        setSelectedCoupon(null);
        alert('쿠폰 적용에 실패했습니다. 다시 시도해주세요.');
      },
    });
  };

  if (isLoading) {
    return (
      <>
        <PageHeader title="쿠폰" />
        <div className="w-full h-screen flex justify-center items-center">
          <div className="text-body-regular text-black-4">쿠폰을 불러오는 중...</div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <PageHeader title="쿠폰" />
        <div className="w-full h-screen flex justify-center items-center">
          <div className="text-body-regular text-error-3">쿠폰을 불러오는데 실패했습니다.</div>
        </div>
      </>
    );
  }

  const coupons = couponsData?.result?.coupons || [];

  return (
    <>
      <PageHeader title="쿠폰" />
      <div className="w-full min-h-screen bg-white">
        <div className="flex flex-col gap-3 px-3 py-4">
          {coupons.length === 0 ? (
            <div className="text-center text-body-regular text-black-4 mt-10">사용 가능한 쿠폰이 없습니다.</div>
          ) : (
            <>
              {coupons.map((coupon) => (
                <CouponCard
                  key={coupon.couponId}
                  coupon={coupon}
                  isSelected={selectedCoupon?.couponId === coupon.couponId}
                  onClick={() => handleCouponSelect(coupon)}
                />
              ))}
            </>
          )}
        </div>
      </div>
    </>
  );
}
