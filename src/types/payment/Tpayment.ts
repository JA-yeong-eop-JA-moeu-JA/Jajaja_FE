export interface ITPaymentRequest {
  orderId: string;
  orderName: string;
  customerEmail?: string;
  customerName?: string;
  customerMobilePhone?: string;
  successUrl: string;
  failUrl: string;
}

export interface ITPaymentConfirmRequest {
  orderId: string;
  paymentKey: string;
  paidAmount: number;
}

export interface ITPaymentConfirmResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    orderId: string;
    orderName: string;
    status: string;
  };
}

export interface ITPaymentPrepareRequest {
  items: number[];
  addressId: number;
  deliveryRequest?: string;
  appliedCouponId?: number;
  point?: number;
}

export interface ITPaymentPrepareData {
  orderId: number;
  orderName: string;
  totalAmount: number;
  discountAmount: number;
  pointDiscount: number;
  shippingFee: number;
  finalAmount: number;
}

export interface ITPaymentPrepareResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  data: ITPaymentPrepareData;
}

export interface ITOrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  imageUrl?: string;
}

export interface ITPaymentSummary {
  originalAmount: number;
  discount: number;
  pointsUsed: number;
  shippingFee: number;
  finalAmount: number;
}

export interface ITCustomerInfo {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
}
