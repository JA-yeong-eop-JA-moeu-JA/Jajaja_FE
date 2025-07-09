import { SelectButton } from '@/components/common/button/selectButton';
import FeedbackPage from '@/components/common/FeedbackPage';

export default function PaymentFailPage() {
  return (
    <div>
      <FeedbackPage iconSrc="/src/assets/paymentFail.svg" title="일시적 오류로 결제에 실패했어요." subtitle="잠시 후 다시 시도해주세요." />

      <div className="w-full fixed bottom-0 left-0 right-0 z-10 pb-2">
        <SelectButton
          kind="select-bottom"
          leftText="장바구니"
          rightText="홈으로"
          leftVariant="left-outline"
          rightVariant="right-orange"
          onLeftClick={() => {
            window.location.href = '/장바구니';
          }}
          onRightClick={() => {
            window.location.href = '/home';
          }}
        />
      </div>
    </div>
  );
}
