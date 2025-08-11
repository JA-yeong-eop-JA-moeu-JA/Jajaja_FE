import { axiosInstance } from '@/apis/axiosInstance';

export interface IPaymentConfirmRequest {
  orderId: string;
  paymentKey: string;
  paidAmount: number;
}

export interface IPaymentConfirmResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    orderId: string;
    orderName: string;
    status: string;
  };
}

/**
 * 결제 승인 API 호출
 */
export const confirmPayment = async (data: IPaymentConfirmRequest): Promise<IPaymentConfirmResponse> => {
  const response = await axiosInstance.post<IPaymentConfirmResponse>('/api/orders/confirm', data);
  return response.data;
};
