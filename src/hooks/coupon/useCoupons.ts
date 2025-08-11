import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import type { TCoupons } from '@/types/coupon/TGetCoupons';
import { QUERY_KEYS } from '@/constants/querykeys/queryKeys';

import { applyCoupon, cancelCoupon, getCoupons } from '@/apis/coupon/getCoupons';

export const useCoupons = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_COUPONS],
    queryFn: getCoupons,
    staleTime: 5 * 60 * 1000, // 5분
  });
};

export const useApplyCoupon = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: applyCoupon,
    onSuccess: (data) => {
      localStorage.setItem('appliedCoupon', JSON.stringify(data.result.data));

      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_COUPONS] });
    },
    onError: (error) => {
      console.error('쿠폰 적용 실패:', error);
    },
  });
};

export const useCancelCoupon = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cancelCoupon,
    onSuccess: () => {
      localStorage.removeItem('appliedCoupon');

      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_COUPONS] });
    },
    onError: (error) => {
      console.error('쿠폰 적용 취소 실패:', error);
    },
  });
};

export const useAppliedCoupon = () => {
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
    const targetCoupon = coupon || getAppliedCoupon();
    if (!targetCoupon) return 0;

    if (targetCoupon.applicableConditions.minOrderAmount > orderAmount) {
      return 0;
    }

    if (targetCoupon.discountType === 'PERCENTAGE') {
      return Math.floor(orderAmount * (targetCoupon.discountValue / 100));
    } else {
      return targetCoupon.discountValue;
    }
  };

  const isApplicable = (orderAmount: number, coupon?: TCoupons): boolean => {
    const targetCoupon = coupon || getAppliedCoupon();
    if (!targetCoupon) return false;
    return targetCoupon.applicableConditions.minOrderAmount <= orderAmount;
  };

  const isExpired = (coupon?: TCoupons): boolean => {
    const targetCoupon = coupon || getAppliedCoupon();
    if (!targetCoupon) return false;
    const expireDate = new Date(targetCoupon.applicableConditions.expireAt);
    const now = new Date();
    return now > expireDate;
  };

  return {
    getAppliedCoupon,
    clearAppliedCoupon,
    calculateDiscount,
    isApplicable,
    isExpired,
  };
};
