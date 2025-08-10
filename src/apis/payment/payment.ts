import type { TCommonResponse } from '@/types/common';
import type { TPaymentConfirmRequest, TPaymentConfirmResponse, TPaymentPrepareRequest, TPaymentPrepareResponse } from '@/types/payment/TPayment';

import { axiosInstance } from '@/apis/axiosInstance';

export const paymentApi = {
  // 결제 준비
  prepare: async (data: TPaymentPrepareRequest): Promise<TCommonResponse<TPaymentPrepareResponse>> => {
    const response = await axiosInstance.post('/orders/prepare', data);
    return response.data;
  },

  // 결제 승인
  confirm: async (data: TPaymentConfirmRequest): Promise<TCommonResponse<TPaymentConfirmResponse>> => {
    const response = await axiosInstance.post('/orders/confirm', data);
    return response.data;
  },
};
