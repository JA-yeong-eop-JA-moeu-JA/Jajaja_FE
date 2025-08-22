import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

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

      const couponDataForStorage: TStoredCouponData = {
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

      localStorage.setItem('appliedCoupon', JSON.stringify(couponDataForStorage));

      queryClient.setQueryData(QUERY_KEYS.GET_CART_ITEMS, (oldData: any) => {
        if (!oldData) return oldData;
        const newData = JSON.parse(JSON.stringify(oldData));
        if (newData.result) {
          newData.result.appliedCoupon = {
            couponId: data.result.couponId,
            couponName: data.result.couponName,
            discountType: couponInfo?.discountType || 'FIXED_AMOUNT',
            discountValue: couponInfo?.discountValue || data.result.discountAmount,
            applicableConditions: couponInfo?.applicableConditions,
          };
        }
        return newData;
      });

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_COUPONS_INFINITE],
        exact: false,
      });

      toast.success(`'${data.result.couponName}' 쿠폰이 적용되었습니다.`);
    },
    onError: (err: any) => {
      localStorage.removeItem('appliedCoupon');
      let errorMessage = '쿠폰 적용에 실패했습니다';
      if (err.response?.data?.code) {
        switch (err.response.data.code) {
          case 'COUPON4001':
            errorMessage = '이미 사용된 쿠폰입니다';
            break;
          case 'COUPON4002':
            errorMessage = '쿠폰 사용 조건을 만족하지 않습니다';
            break;
          case 'COUPON4003':
            errorMessage = '사용할 수 없는 쿠폰입니다';
            break;
          case 'COMMON500':
            errorMessage = '서버에서 쿠폰 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
            break;
          default:
            errorMessage = err.response.data.message || errorMessage;
        }
      } else if (err.message) {
        errorMessage = err.message;
      }
      toast.error(errorMessage);
    },
  });
};

export const useUnapplyCoupon = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cancelCoupon,
    onSuccess: () => {
      localStorage.removeItem('appliedCoupon');

      queryClient.setQueryData(QUERY_KEYS.GET_CART_ITEMS, (oldData: any) => {
        if (!oldData) return oldData;
        const newData = JSON.parse(JSON.stringify(oldData));
        if (newData.result && newData.result.appliedCoupon) {
          newData.result.appliedCoupon = null;
        }
        return newData;
      });

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_COUPONS_INFINITE],
        exact: false,
      });

      toast.success('쿠폰 적용이 취소되었습니다.');
    },
    onError: () => {
      toast.error('쿠폰 취소에 실패했습니다.');
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
  };

  const isCouponStillAvailable = (couponId: number, availableCoupons: TCoupons[]): boolean => {
    return availableCoupons.some((coupon) => coupon.couponId === couponId && coupon.isApplicable);
  };

  const calculateDiscount = (orderAmount: number, coupon?: TCoupons): number => {
    const targetCoupon = coupon || getCartAppliedCoupon() || getLocalAppliedCoupon();
    if (!targetCoupon) return 0;
    if (!targetCoupon.applicableConditions) return 0;
    const minOrderAmount = targetCoupon.applicableConditions.minOrderAmount || 0;
    if (minOrderAmount > orderAmount) return 0;
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
    if (!targetCoupon || !targetCoupon.applicableConditions) return false;
    const minOrderAmount = targetCoupon.applicableConditions.minOrderAmount || 0;
    return minOrderAmount <= orderAmount;
  };

  const isExpired = (coupon?: TCoupons): boolean => {
    const targetCoupon = coupon || getCartAppliedCoupon() || getLocalAppliedCoupon();
    if (!targetCoupon || !targetCoupon.applicableConditions || !targetCoupon.applicableConditions.expireAt) return false;
    const expireDate = new Date(targetCoupon.applicableConditions.expireAt);
    const now = new Date();
    return now > expireDate;
  };

  const syncCouponState = async () => {
    const localCoupon = getLocalAppliedCoupon();
    const cartCoupon = getCartAppliedCoupon();
    if (localCoupon && !cartCoupon) {
      localStorage.removeItem('appliedCoupon');
      return false;
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
    syncCouponState,
  };
};

export const useAppliedCoupon = useCartCoupon;

export const useSafeApplyCoupon = () => {
  const { mutateAsync: applyAsync, isPending: isApplying } = useApplyCoupon();
  const { mutateAsync: unapplyAsync, isPending: isUnapplying } = useUnapplyCoupon();
  const { getAppliedCoupon } = useCartCoupon();

  const safeApplyCoupon = async (couponId: number) => {
    const currentlyAppliedCoupon = getAppliedCoupon();

    if (currentlyAppliedCoupon?.couponId === couponId) {
      return;
    }

    try {
      if (currentlyAppliedCoupon) {
        await unapplyAsync();
      }
      await applyAsync(couponId);
    } catch (error) {
      console.error('쿠폰 처리 중 에러 발생:', error);
    }
  };

  return {
    safeApplyCoupon,
    isLoading: isApplying || isUnapplying,
  };
};
