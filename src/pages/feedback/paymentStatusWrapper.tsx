// PaymentStatusWrapper를 확장한 컴포넌트
import { useParams } from 'react-router-dom';

import PaymentStatusPage from './paymentStatus';
import { usePaymentConfirm } from './PaymentStatusHandler';

interface IPaymentStatusWrapper {
  // 결제 성공 시 추가 정보 표시
  orderInfo?: {
    orderId: string;
    orderName: string;
    amount: string;
  };
}

export default function PaymentStatusWrapper() {
  const { status } = useParams<{ status: 'success' | 'fail' }>();
  const { isConfirming, confirmResult, error } = usePaymentConfirm();

  if (status !== 'success' && status !== 'fail') {
    return <div>잘못된 접근입니다.</div>;
  }

  // 성공 페이지에서 결제 승인 진행 중
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

  // 결제 승인 실패 시 실패 페이지로 처리
  if (status === 'success' && error) {
    return <PaymentStatusPage status="fail" />;
  }

  // 정상적인 결제 완료
  return <PaymentStatusPage status={status} />;
}
