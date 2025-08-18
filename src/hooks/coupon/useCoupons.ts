import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { TCoupon } from '@/types/cart/TCart';
import type { TCoupons, TStoredCouponData } from '@/types/coupon/TGetCoupons';
import { QUERY_KEYS } from '@/constants/querykeys/queryKeys';

import { applyCoupon, cancelCoupon } from '@/apis/coupon/getCoupons';

// TCoupon (장바구니)을 TCoupons (쿠폰 목록)로 변환
const convertTCouponToTCoupons = (coupon: TCoupon): TCoupons => ({
  couponId: coupon.couponId,
  couponName: coupon.couponName,
  discountType: coupon.discountType as 'PERCENTAGE' | 'FIXED_AMOUNT',
  discountValue: coupon.discountValue,
  applicableConditions: {
    // TCoupon의 'SPECIFIC'을 TCoupons의 'ALL'로 매핑
    type: coupon.applicableConditions.type === 'SPECIFIC' ? 'ALL' : (coupon.applicableConditions.type as 'ALL' | 'BRAND' | 'CATEGORY' | 'FIRST'),
    values: coupon.applicableConditions.values,
    minOrderAmount: coupon.applicableConditions.minOrderAmount,
    expireAt: coupon.applicableConditions.expireAt,
  },
});

// TStoredCouponData를 TCoupons로 변환
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
      // 쿠폰 목록에서 해당 쿠폰 정보 찾기
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

      // localStorage에 저장할 데이터 구성
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
        // API 응답 추가 정보
        cartId: data.result.cartId,
        originalAmount: data.result.originalAmount,
        discountAmount: data.result.discountAmount,
        finalAmount: data.result.finalAmount,
        appliedAt: new Date().toISOString(),
      };

      localStorage.setItem('appliedCoupon', JSON.stringify(couponData));

      // 캐시 무효화
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

      // 캐시 무효화
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
      // 에러 발생 시에도 localStorage 정리할 수 있음
    },
  });
};

export const useCartCoupon = () => {
  const queryClient = useQueryClient();

  // 장바구니에서 적용된 쿠폰 가져오기 (서버 상태)
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

  // localStorage에서 적용된 쿠폰 가져오기 (클라이언트 상태)
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

  // 쿠폰이 현재 사용 가능한지 확인하는 함수 추가
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
    // Payment.tsx에서 사용하는 함수명에 맞춤
    getAppliedCoupon: getCartAppliedCoupon,
    getLocalAppliedCoupon,
    clearAppliedCoupon,
    calculateDiscount,
    isApplicable,
    isExpired,
    isCouponStillAvailable, // 새로 추가
  };
};

export const useAppliedCoupon = useCartCoupon;
