import { useEffect } from 'react';
import axios from 'axios';

import { usePaymentStatus } from '@/hooks/payment/usePaymentStatus';

import Loading from '@/components/loading';

import PaymentStatusPage from './paymentStatus';

export default function PaymentStatusWrapper() {
  const { isConfirming, confirmResult, error } = usePaymentStatus();

  // 디버깅 로그 추가
  useEffect(() => {
    console.log('🔍 PaymentStatusWrapper 마운트됨');
    console.log('🔍 현재 URL:', window.location.href);
    console.log('🔍 URL 파라미터:', new URLSearchParams(window.location.search).toString());
  }, []);

  useEffect(() => {
    console.log('🔍 usePaymentStatus 상태 변화:');
    console.log('  - isConfirming:', isConfirming);
    console.log('  - confirmResult:', confirmResult);
    console.log('  - error:', error);
  }, [isConfirming, confirmResult, error]);

  if (isConfirming) {
    console.log('🔄 결제 확인 중...');
    return (
      <>
        <div className="w-full h-screen flex items-center justify-center">
          <Loading />
        </div>
      </>
    );
  }

  if (error) {
    console.log('❌ 결제 에러 발생:', error);
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
    console.log('✅ 결제 결과 받음:', confirmResult);
    if (confirmResult.isSuccess) {
      console.log('🎉 결제 성공!');
      return <PaymentStatusPage status="success" />;
    } else {
      console.log('❌ 결제 실패:', confirmResult.message);
      return <PaymentStatusPage status="fail" errorMessage={confirmResult.message} />;
    }
  }

  console.log('⏳ 초기 로딩 상태');
  return (
    <>
      <div className="w-full h-screen flex items-center justify-center">
        <Loading />
      </div>
    </>
  );
}
