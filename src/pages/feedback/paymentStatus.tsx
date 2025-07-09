import { SelectButton } from '@/components/common/button/selectButton';
import FeedbackPage from '@/components/common/FeedbackPage';

type TPaymentStatus = 'success' | 'fail';

interface IPaymentStatusPageProps {
  status: TPaymentStatus;
}

export default function PaymentStatusPage({ status }: IPaymentStatusPageProps) {
  const isSuccess = status === 'success';

  return (
    <div>
      <FeedbackPage
        iconSrc={isSuccess ? '/src/assets/paymentComplete.svg' : '/src/assets/paymentFail.svg'}
        title={isSuccess ? '주문이 완료됐습니다.' : '일시적 오류로 결제에 실패했어요.'}
        subtitle={isSuccess ? undefined : '잠시 후 다시 시도해주세요.'}
      />

      <div className="w-full fixed bottom-0 left-0 right-0 z-10 pb-2">
        <SelectButton
          kind="select-bottom"
          leftText={isSuccess ? '주문 내역' : '장바구니'}
          rightText="홈으로"
          leftVariant="left-outline"
          rightVariant="right-orange"
          onLeftClick={() => {
            window.location.href = isSuccess ? '/주문 내역' : '/장바구니';
          }}
          onRightClick={() => {
            window.location.href = '/home';
          }}
        />
      </div>
    </div>
  );
}
