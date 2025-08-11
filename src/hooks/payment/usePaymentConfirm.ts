import { useMutation } from '@tanstack/react-query';

import type { IPaymentConfirmRequest } from '@/apis/payment/payment';
import { confirmPayment } from '@/apis/payment/payment';

export const usePaymentConfirm = () => {
  return useMutation({
    mutationFn: (data: IPaymentConfirmRequest) => confirmPayment(data),
    onSuccess: (data) => {
      console.log('결제 승인 성공:', data);
    },
    onError: (error) => {
      console.error('결제 승인 실패:', error);
    },
  });
};
