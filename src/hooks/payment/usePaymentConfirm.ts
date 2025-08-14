import { useMutation } from '@tanstack/react-query';

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
  return useMutation({
    mutationFn: confirmPaymentWithAuth,
    onSuccess: (data) => {
      console.log('결제 승인 성공:', data);
    },
    onError: (error) => {
      console.error('결제 승인 실패:', error);
    },
  });
};
