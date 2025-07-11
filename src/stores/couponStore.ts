import { create } from 'zustand';

import type { ICoupon } from '@/constants/coupon/coupons';
import { coupons } from '@/constants/coupon/coupons';

interface ICouponState {
  ownedCoupons: ICoupon[];
  issueSignupCoupons: () => void;
  selectCoupon: (id: number) => void;
  selectedCouponId: number | null;
}

export const CouponStore = create<ICouponState>((set) => ({
  ownedCoupons: [],
  selectedCouponId: null,
  issueSignupCoupons: () => set({ ownedCoupons: coupons }),
  selectCoupon: (id) => set({ selectedCouponId: id }),
}));
