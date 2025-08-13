export interface ITossPaymentsInstance {
  widgets: (options: { customerKey: string }) => IPaymentWidgetInstance;
  payment: (options: { customerKey: string }) => IPaymentInstance;
  brandpay: (options: { customerKey: string; redirectUrl?: string }) => IBrandPayInstance;
}

export interface IPaymentWidgetInstance {
  setAmount: (amount: { currency: string; value: number }) => Promise<void>;
  renderPaymentMethods: (options: { selector: string; variantKey?: string }) => IPaymentMethodWidget;
  renderAgreement: (options: { selector: string; variantKey?: string }) => IAgreementWidget;
  requestPayment: (paymentData: TPaymentRequestData) => Promise<void>;
}

export interface IPaymentMethodWidget {
  on: (eventName: 'paymentMethodSelect', callback: (data: any) => void) => void;
  getSelectedPaymentMethod: () => any;
  destroy: () => void;
}

export interface IAgreementWidget {
  on: (eventName: 'agreementStatusChange', callback: (data: any) => void) => void;
  destroy: () => void;
}

export interface IPaymentInstance {
  requestPayment: (paymentData: TPaymentRequestData) => Promise<void>;
}

export interface IBrandPayInstance {
  requestPayment: (paymentData: TBrandPayRequestData) => Promise<void>;
  addPaymentMethod: () => void;
  openSettings: () => void;
  changePassword: () => void;
  changeOneTouchPay: (enabled: boolean) => void;
  isOneTouchPayEnabled: () => { isEnabled: boolean };
}

export type TPaymentRequestData = {
  orderId: string;
  orderName: string;
  customerEmail?: string;
  customerName?: string;
  customerMobilePhone?: string;
  successUrl: string;
  failUrl: string;
  taxFreeAmount?: number;
  windowTarget?: 'self' | 'iframe';
  metadata?: Record<string, string>;
  card?: {
    taxExemptionAmount?: number;
    appScheme?: string;
  };
  transfer?: {
    useEscrow?: boolean;
    escrowProducts?: TEscrowProduct[];
  };
  virtualAccount?: {
    useEscrow?: boolean;
    escrowProducts?: TEscrowProduct[];
    cashReceipt?: {
      type: '소득공제' | '지출증빙' | '미발행';
    };
  };
};

export type TBrandPayRequestData = {
  amount: {
    currency: 'KRW';
    value: number;
  };
  orderId: string;
  orderName: string;
  customerEmail?: string;
  customerName?: string;
  taxFreeAmount?: number;
  methodId?: string;
  metadata?: Record<string, string>;
  successUrl: string;
  failUrl: string;
};

export type TEscrowProduct = {
  id: string;
  name: string;
  code: string;
  unitPrice: number;
  quantity: number;
};
