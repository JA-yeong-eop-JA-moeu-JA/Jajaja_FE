import { useParams } from 'react-router-dom';

import PaymentStatusPage from './paymentStatus';
import { usePaymentStatus } from './PaymentStatusHandler';

export default function PaymentStatusWrapper() {
  const { status } = useParams<{ status: 'success' | 'fail' }>();
  const { isConfirming, error } = usePaymentStatus();

  if (status !== 'success' && status !== 'fail') {
    return <div>잘못된 접근입니다.</div>;
  }

  if (status === 'success' && isConfirming) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange mx-auto mb-4" />
          <p className="text-body-regular">결제를 확인하고 있습니다...</p>
        </div>
      </div>
    );
  }

  if (status === 'success' && error) {
    return <PaymentStatusPage status="fail" />;
  }

  return <PaymentStatusPage status={status} />;
}
