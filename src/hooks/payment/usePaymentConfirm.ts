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
    onSuccess: () => {
      localStorage.removeItem('appliedCoupon');

      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.GET_CART_ITEMS });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_COUPONS_INFINITE] });
      queryClient.removeQueries({ queryKey: [QUERY_KEYS.GET_COUPONS_INFINITE] });
    },
    onError: () => {
      const storedCoupon = localStorage.getItem('appliedCoupon');
      if (storedCoupon) {
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.GET_CART_ITEMS });
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_COUPONS_INFINITE] });
      }
    },
  });
};
