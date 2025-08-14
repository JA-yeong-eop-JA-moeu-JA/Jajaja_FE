import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { TCoupon } from '@/types/cart/TCart';
import type { TCoupons } from '@/types/coupon/TGetCoupons';
import { QUERY_KEYS } from '@/constants/querykeys/queryKeys';

import { applyCoupon, cancelCoupon } from '@/apis/coupon/getCoupons';

const convertTCouponToTCoupons = (coupon: TCoupon): TCoupons => ({
  couponId: coupon.couponId,
  couponName: coupon.couponName,
  discountType: coupon.discountType as 'PERCENTAGE' | 'FIXED_AMOUNT',
  discountValue: coupon.discountValue,
  applicableConditions: {
    ...coupon.applicableConditions,
    type: coupon.applicableConditions.type as 'ALL' | 'BRAND' | 'CATEGORY' | 'FIRST',
  },
});

export const useApplyCoupon = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: applyCoupon,
    onSuccess: (data) => {
      const couponData = {
        couponId: data.result.couponId,
        couponName: data.result.couponName,
        cartId: data.result.cartId,
        originalAmount: data.result.originalAmount,
        discountAmount: data.result.discountAmount,
        finalAmount: data.result.finalAmount,
        appliedAt: new Date().toISOString(),
      };
      localStorage.setItem('appliedCoupon', JSON.stringify(couponData));

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_COUPONS_INFINITE],
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.GET_CART_ITEMS,
        exact: false,
      });
    },
    onError: (error) => {
      console.error('쿠폰 적용 실패:', error);
    },
  });
};

export const useUnapplyCoupon = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cancelCoupon,
    onSuccess: () => {
      localStorage.removeItem('appliedCoupon');

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_COUPONS_INFINITE],
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.GET_CART_ITEMS,
        exact: false,
      });
    },
    onError: (error) => {
      console.error('쿠폰 적용 취소 실패:', error);
    },
  });
};

export const useCartCoupon = () => {
  const queryClient = useQueryClient();

  const getCartAppliedCoupon = (): TCoupons | null => {
    const cartData = queryClient.getQueryData(QUERY_KEYS.GET_CART_ITEMS) as any;
    const cartCoupon: TCoupon | null = cartData?.result?.appliedCoupon || null;

    if (cartCoupon) {
      return convertTCouponToTCoupons(cartCoupon);
    }
    return null;
  };

  const getAppliedCoupon = (): TCoupons | null => {
    const savedCoupon = localStorage.getItem('appliedCoupon');
    if (savedCoupon) {
      try {
        return JSON.parse(savedCoupon);
      } catch (error) {
        console.error('Failed to parse applied coupon:', error);
        localStorage.removeItem('appliedCoupon');
      }
    }
    return null;
  };

  const clearAppliedCoupon = () => {
    localStorage.removeItem('appliedCoupon');
  };

  const calculateDiscount = (orderAmount: number, coupon?: TCoupons): number => {
    const targetCoupon = coupon || getCartAppliedCoupon() || getAppliedCoupon();
    if (!targetCoupon) return 0;

    if (!targetCoupon.applicableConditions) return 0;

    const minOrderAmount = targetCoupon.applicableConditions.minOrderAmount || 0;
    if (minOrderAmount > orderAmount) {
      return 0;
    }

    if (targetCoupon.discountType === 'PERCENTAGE') {
      return Math.floor(orderAmount * (targetCoupon.discountValue / 100));
    } else {
      return targetCoupon.discountValue;
    }
  };

  const isApplicable = (orderAmount: number, coupon?: TCoupons): boolean => {
    const targetCoupon = coupon || getCartAppliedCoupon() || getAppliedCoupon();

    if (!targetCoupon || !targetCoupon.applicableConditions) return false;

    const minOrderAmount = targetCoupon.applicableConditions.minOrderAmount || 0;
    return minOrderAmount <= orderAmount;
  };

  const isExpired = (coupon?: TCoupons): boolean => {
    const targetCoupon = coupon || getCartAppliedCoupon() || getAppliedCoupon();

    if (!targetCoupon || !targetCoupon.applicableConditions || !targetCoupon.applicableConditions.expireAt) {
      return false;
    }

    const expireDate = new Date(targetCoupon.applicableConditions.expireAt);
    const now = new Date();
    return now > expireDate;
  };

  return {
    getAppliedCoupon: getCartAppliedCoupon,
    getLocalAppliedCoupon: getAppliedCoupon,
    clearAppliedCoupon,
    calculateDiscount,
    isApplicable,
    isExpired,
  };
};

export const useAppliedCoupon = useCartCoupon;
