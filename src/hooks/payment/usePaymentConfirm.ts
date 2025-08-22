import { useMutation, useQueryClient } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/constants/querykeys/queryKeys';

import { axiosInstance } from '@/apis/axiosInstance';
import type { IPaymentConfirmRequest } from '@/apis/payment/payment';

const confirmPaymentWithAuth = async (data: IPaymentConfirmRequest) => {
  const response = await axiosInstance.post('/api/orders/confirm', data, {
    optionalAuth: true,
    validateStatus: (status) => (status >= 200 && status < 300) || status === 401,
  });
  return response.data;
};

export const usePaymentConfirm = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: confirmPaymentWithAuth,
    onSuccess: (data) => {
      console.log('결제 승인 성공:', data);

      localStorage.removeItem('appliedCoupon');

      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.GET_CART_ITEMS });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_COUPONS_INFINITE] });

      queryClient.removeQueries({ queryKey: [QUERY_KEYS.GET_COUPONS_INFINITE] });

      console.log('쿠폰 상태 정리 완료 - localStorage 제거 및 쿼리 캐시 무효화');
    },
    onError: (error) => {
      console.error('결제 승인 실패:', error);

      const storedCoupon = localStorage.getItem('appliedCoupon');
      if (storedCoupon) {
        console.log('결제 실패 - 쿠폰 상태 유지');
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.GET_CART_ITEMS });
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_COUPONS_INFINITE] });
      }
    },
  });
};
