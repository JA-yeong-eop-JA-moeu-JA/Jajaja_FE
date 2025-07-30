import { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import type { ICoupon } from '@/constants/coupon/coupons';

import { CouponStore } from '@/stores/couponStore';

import CouponCard from '@/components/coupon/CouponCard';
import PageHeader from '@/components/head_bottom/PageHeader';

export default function CouponsPage() {
  const navigate = useNavigate();
  const { ownedCoupons, selectedCouponId, selectCoupon, issueSignupCoupons } = CouponStore();

  useEffect(() => {
    if (ownedCoupons.length === 0) {
      issueSignupCoupons();
    }
  }, [ownedCoupons.length, issueSignupCoupons]);

  const handleSelect = useCallback(
    (id: number) => {
      selectCoupon(id);
      setTimeout(() => {
        navigate(-1);
      }, 200);
    },
    [selectCoupon, navigate],
  );

  return (
    <>
      <PageHeader title="쿠폰" />
      <div className="w-full min-h-screen">
        <div className="flex flex-col gap-3 px-3">
          {ownedCoupons.map((coupon: ICoupon) => (
            <CouponCard key={coupon.id} coupon={coupon} isSelected={selectedCouponId === coupon.id} onClick={() => handleSelect(coupon.id)} />
          ))}
        </div>
      </div>
    </>
  );
}
