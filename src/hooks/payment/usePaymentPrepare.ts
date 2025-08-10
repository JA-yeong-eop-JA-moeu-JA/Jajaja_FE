import type { TPaymentConfirmRequest, TPaymentPrepareRequest } from '@/types/payment/TPayment';

import { paymentApi } from '@/apis/payment/payment';

import { useCoreMutation } from '@/hooks/customQuery';

export const usePaymentPrepare = () => {
  return useCoreMutation((data: TPaymentPrepareRequest) => paymentApi.prepare(data), {
    onSuccess: (data) => {
      console.log('결제 준비 성공:', data);
      // 성공시 추가 로직?
    },
    onError: (error) => {
      console.error('결제 준비 실패:', error);
    },
  });
};

export const usePaymentConfirm = () => {
  return useCoreMutation((data: TPaymentConfirmRequest) => paymentApi.confirm(data), {
    onSuccess: (data) => {
      console.log('결제 승인 성공:', data);
    },
    onError: (error) => {
      console.error('결제 승인 실패:', error);
    },
  });
};
