import { axiosInstance } from '@/apis/axiosInstance';

export interface IPaymentConfirmRequest {
  orderId: string;
  paymentKey: string;
  finalAmount: number;
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

export interface IPaymentPrepareRequest {
  items: number[];
  addressId: number;
  deliveryRequest?: string;
  appliedCouponId?: number;
  point?: number;
}

export interface IPaymentPrepareResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    orderId: number;
    orderName: string;
    totalAmount: number;
    discountAmount: number;
    pointDiscount: number;
    shippingFee: number;
    finalAmount: number;
  };
}

export const preparePayment = async (data: IPaymentPrepareRequest): Promise<IPaymentPrepareResponse> => {
  const response = await axiosInstance.post<IPaymentPrepareResponse>('/api/orders/prepare', data);
  return response.data;
};

export const confirmPayment = async (data: IPaymentConfirmRequest): Promise<IPaymentConfirmResponse> => {
  const response = await axiosInstance.post<IPaymentConfirmResponse>('/api/orders/confirm', data);
  return response.data;
};
