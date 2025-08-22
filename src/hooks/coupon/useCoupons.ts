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
  isApplicable: true,
});

const convertStoredDataToTCoupons = (storedData: TStoredCouponData): TCoupons => ({
  couponId: storedData.couponId,
  couponName: storedData.couponName,
  discountType: storedData.discountType,
  discountValue: storedData.discountValue,
  applicableConditions: storedData.applicableConditions,
  isApplicable: storedData.isApplicable,
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
        isApplicable: couponInfo?.isApplicable ?? true,
        cartId: data.result.cartId,
        originalAmount: data.result.originalAmount,
        discountAmount: data.result.discountAmount,
        finalAmount: data.result.finalAmount,
        appliedAt: new Date().toISOString(),
      };

      localStorage.setItem('appliedCoupon', JSON.stringify(couponData));

      // 쿠폰 적용 후 관련 쿼리 모두 무효화
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_COUPONS_INFINITE],
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.GET_CART_ITEMS,
        exact: false,
      });

      console.log('쿠폰 적용 완료 - 쿠폰 및 장바구니 캐시 무효화');
    },
    onError: () => {
      localStorage.removeItem('appliedCoupon');
      console.log('쿠폰 적용 실패 - localStorage 정리');
    },
  });
};

export const useUnapplyCoupon = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cancelCoupon,
    onSuccess: () => {
      localStorage.removeItem('appliedCoupon');

      // 쿠폰 취소 후 관련 쿼리 모두 무효화
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_COUPONS_INFINITE],
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.GET_CART_ITEMS,
        exact: false,
      });

      console.log('쿠폰 취소 완료 - localStorage 정리 및 캐시 무효화');
    },
    onError: () => {
      console.log('쿠폰 취소 실패');
    },
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
    queryClient.invalidateQueries({
      queryKey: QUERY_KEYS.GET_CART_ITEMS,
      exact: false,
    });
    queryClient.invalidateQueries({
      queryKey: [QUERY_KEYS.GET_COUPONS_INFINITE],
      exact: false,
    });
    console.log('쿠폰 상태 강제 정리 - localStorage 및 캐시 무효화');
  };

  const isCouponStillAvailable = (couponId: number, availableCoupons: TCoupons[]): boolean => {
    return availableCoupons.some((coupon) => coupon.couponId === couponId && coupon.isApplicable);
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

  const syncCouponState = async () => {
    const localCoupon = getLocalAppliedCoupon();
    const cartCoupon = getCartAppliedCoupon();

    if (localCoupon && !cartCoupon) {
      console.log('사용된 쿠폰 감지 - localStorage 정리');
      localStorage.removeItem('appliedCoupon');
      return false;
    }

    if (cartCoupon && !localCoupon) {
      console.log('장바구니 쿠폰을 localStorage에 동기화');
    }

    return true;
  };

  return {
    getAppliedCoupon: getCartAppliedCoupon,
    getLocalAppliedCoupon,
    clearAppliedCoupon,
    calculateDiscount,
    isApplicable,
    isExpired,
    isCouponStillAvailable,
    syncCouponState, // 새로운 동기화 함수
  };
};

export const useAppliedCoupon = useCartCoupon;
