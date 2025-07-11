import { useParams } from 'react-router-dom';

import PaymentStatusPage from './paymentStatus';

export default function PaymentStatusWrapper() {
  const { status } = useParams<{ status: 'success' | 'fail' }>();

  if (status !== 'success' && status !== 'fail') {
    return <div>잘못된 접근입니다.</div>;
  }

  return <PaymentStatusPage status={status} />;
}
