import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { TCoupon } from '@/types/cart/TCart';
import type { TCoupons, TStoredCouponData } from '@/types/coupon/TGetCoupons';
import { QUERY_KEYS } from '@/constants/querykeys/queryKeys';

import { applyCoupon, cancelCoupon } from '@/apis/coupon/getCoupons';

const convertTCouponToTCoupons = (coupon: TCoupon): TCoupons => ({
  couponId: coupon.couponId,
  couponName: coupon.couponName,
  discountType: coupon.discountType as 'PERCENTAGE' | 'FIXED_AMOUNT',
  discountValue: coupon.discountValue,
  applicableConditions: {
    type: coupon.applicableConditions.type === 'SPECIFIC' ? 'ALL' : (coupon.applicableConditions.type as 'ALL' | 'BRAND' | 'CATEGORY' | 'FIRST'),
    values: coupon.applicableConditions.values,
    minOrderAmount: coupon.applicableConditions.minOrderAmount,
    expireAt: coupon.applicableConditions.expireAt,
  },
});

const convertStoredDataToTCoupons = (storedData: TStoredCouponData): TCoupons => ({
  couponId: storedData.couponId,
  couponName: storedData.couponName,
  discountType: storedData.discountType,
  discountValue: storedData.discountValue,
  applicableConditions: storedData.applicableConditions,
});

export const useApplyCoupon = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: applyCoupon,
    onSuccess: (data) => {
      const couponsData = queryClient.getQueryData([QUERY_KEYS.GET_COUPONS_INFINITE]) as any;
      let couponInfo: TCoupons | null = null;

      if (couponsData?.pages) {
        for (const page of couponsData.pages) {
          const foundCoupon = page.result.coupons.find((c: TCoupons) => c.couponId === data.result.couponId);
          if (foundCoupon) {
            couponInfo = foundCoupon;
            break;
          }
        }
      }

      const couponData: TStoredCouponData = {
        couponId: data.result.couponId,
        couponName: data.result.couponName,
        discountType: couponInfo?.discountType || 'FIXED_AMOUNT',
        discountValue: couponInfo?.discountValue || data.result.discountAmount,
        applicableConditions: couponInfo?.applicableConditions || {
          type: 'ALL',
          values: [],
          minOrderAmount: 0,
          expireAt: '',
        },
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
    onError: () => {
      localStorage.removeItem('appliedCoupon');
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
    onError: () => {},
  });
};

export const useCartCoupon = () => {
  const queryClient = useQueryClient();

  const getCartAppliedCoupon = (): TCoupons | null => {
    try {
      const cartData = queryClient.getQueryData(QUERY_KEYS.GET_CART_ITEMS) as any;
      const cartCoupon: TCoupon | null = cartData?.result?.appliedCoupon || null;

      if (cartCoupon) {
        return convertTCouponToTCoupons(cartCoupon);
      }

      return null;
    } catch {
      return null;
    }
  };

  const getLocalAppliedCoupon = (): TCoupons | null => {
    try {
      const savedCoupon = localStorage.getItem('appliedCoupon');
      if (savedCoupon) {
        const parsedCoupon: TStoredCouponData = JSON.parse(savedCoupon);
        return convertStoredDataToTCoupons(parsedCoupon);
      }

      return null;
    } catch {
      localStorage.removeItem('appliedCoupon');
      return null;
    }
  };

  const clearAppliedCoupon = () => {
    localStorage.removeItem('appliedCoupon');
  };

  const isCouponStillAvailable = (couponId: number, availableCoupons: TCoupons[]): boolean => {
    return availableCoupons.some((coupon) => coupon.couponId === couponId);
  };

  const calculateDiscount = (orderAmount: number, coupon?: TCoupons): number => {
    const targetCoupon = coupon || getCartAppliedCoupon() || getLocalAppliedCoupon();
    if (!targetCoupon) {
      return 0;
    }

    if (!targetCoupon.applicableConditions) {
      return 0;
    }

    const minOrderAmount = targetCoupon.applicableConditions.minOrderAmount || 0;
    if (minOrderAmount > orderAmount) {
      return 0;
    }

    let discount = 0;
    if (targetCoupon.discountType === 'PERCENTAGE') {
      discount = Math.floor(orderAmount * (targetCoupon.discountValue / 100));
    } else {
      discount = targetCoupon.discountValue;
    }

    return discount;
  };

  const isApplicable = (orderAmount: number, coupon?: TCoupons): boolean => {
    const targetCoupon = coupon || getCartAppliedCoupon() || getLocalAppliedCoupon();

    if (!targetCoupon || !targetCoupon.applicableConditions) {
      return false;
    }

    const minOrderAmount = targetCoupon.applicableConditions.minOrderAmount || 0;
    return minOrderAmount <= orderAmount;
  };

  const isExpired = (coupon?: TCoupons): boolean => {
    const targetCoupon = coupon || getCartAppliedCoupon() || getLocalAppliedCoupon();

    if (!targetCoupon || !targetCoupon.applicableConditions || !targetCoupon.applicableConditions.expireAt) {
      return false;
    }

    const expireDate = new Date(targetCoupon.applicableConditions.expireAt);
    const now = new Date();
    return now > expireDate;
  };

  return {
    getAppliedCoupon: getCartAppliedCoupon,
    getLocalAppliedCoupon,
    clearAppliedCoupon,
    calculateDiscount,
    isApplicable,
    isExpired,
    isCouponStillAvailable,
  };
};

export const useAppliedCoupon = useCartCoupon;
