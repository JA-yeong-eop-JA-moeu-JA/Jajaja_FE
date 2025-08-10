export type TPaymentPrepareRequest = {
  items: number[];
  addressId: number;
  deliveryRequest: string;
  appliedCouponId?: number;
  point: number;
};

export type TPaymentPrepareResponse = {
  orderId: number;
  orderName: string;
  totalAmount: number;
  discountAmount: number;
  pointDiscount: number;
  shippingFee: number;
  finalAmount: number;
};

export type TPaymentConfirmRequest = {
  orderId: string;
  paymentKey: string;
  paidAmount: number;
};

export type TPaymentConfirmResponse = {
  orderId: string;
  orderName: string;
  status: 'PAYMENT_COMPLETED' | 'PAYMENT_FAILED';
  requestedAt: string;
  approvedAt: string;
};

export type TTossPaymentOptions = {
  clientKey: string;
  customerKey?: string;
  amount: number;
  orderId: string;
  orderName: string;
  successUrl: string;
  failUrl: string;
};
