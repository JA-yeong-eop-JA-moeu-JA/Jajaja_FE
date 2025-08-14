import axios from 'axios';

import { usePaymentStatus } from '@/hooks/payment/usePaymentStatus';

import Loading from '@/components/loading';

import PaymentStatusPage from './paymentStatus';

export default function PaymentStatusWrapper() {
  const { isConfirming, confirmResult, error } = usePaymentStatus();

  if (isConfirming) {
    return <Loading />;
  }

  if (error) {
    let errorMessage = '알 수 없는 오류가 발생했습니다.';

    if (error instanceof Error) {
      if (axios.isAxiosError(error) && error.response) {
        errorMessage = error.response.data.message || error.message;
      } else {
        errorMessage = error.message;
      }
    }

    return <PaymentStatusPage status="fail" errorMessage={errorMessage} />;
  }

  if (confirmResult) {
    if (confirmResult.isSuccess) {
      return <PaymentStatusPage status="success" />;
    } else {
      return <PaymentStatusPage status="fail" errorMessage={confirmResult.message} />;
    }
  }

  return <Loading />;
}
