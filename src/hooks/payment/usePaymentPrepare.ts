import { useMutation } from '@tanstack/react-query';

import type { IPaymentPrepareRequest } from '@/apis/payment/payment';
import { preparePayment } from '@/apis/payment/payment';

export const usePaymentPrepare = () => {
  return useMutation({
    mutationFn: (data: IPaymentPrepareRequest) => preparePayment(data),
    onSuccess: (data) => {
      console.log('결제 준비 성공:', data);
    },
    onError: (error) => {
      console.error('결제 준비 실패:', error);
    },
  });
};
