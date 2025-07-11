import { useEffect } from 'react';

import type { ICoupon } from '@/constants/coupon/coupons';

import { CouponStore } from '@/stores/couponStore';

import CouponCard from '@/components/coupon/CouponCard';
import PageHeader from '@/components/head_bottom/PageHeader';

export default function Coupons() {
  const { ownedCoupons, issueSignupCoupons } = CouponStore();

  useEffect(() => {
    if (ownedCoupons.length === 0) {
      issueSignupCoupons();
    }
  }, []);

  return (
    <>
      <PageHeader title="쿠폰" />
      <div className="w-full h-screen bg-white">
        <div className="flex flex-col gap-3 px-3">
          {ownedCoupons.map((coupon: ICoupon) => (
            <CouponCard key={coupon.id} coupon={coupon} />
          ))}
        </div>
      </div>
    </>
  );
}
