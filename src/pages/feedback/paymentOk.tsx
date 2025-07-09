import { SelectButton } from '@/components/common/button/selectButton';
import FeedbackPage from '@/components/common/FeedbackPage';

export default function PaymentCompletePage() {
  return (
    <div>
      <FeedbackPage iconSrc="/src/assets/paymentComplete.svg" title="주문이 완료됐습니다." />

      <div className="w-full fixed bottom-0 left-0 right-0 z-10 pb-2">
        <SelectButton
          kind="select-bottom"
          leftText="주문 내역"
          rightText="홈으로"
          leftVariant="left-outline"
          rightVariant="right-orange"
          onLeftClick={() => {
            window.location.href = '/주문 내역';
          }}
          onRightClick={() => {
            window.location.href = '/home';
          }}
        />
      </div>
    </div>
  );
}
