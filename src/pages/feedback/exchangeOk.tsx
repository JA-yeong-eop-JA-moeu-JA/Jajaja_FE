import { SelectButton } from '@/components/common/button/selectButton';
import FeedbackPage from '@/components/common/FeedbackPage';

export default function ExchangeCompletePage() {
  return (
    <div>
      <FeedbackPage iconSrc="/src/assets/exchange.svg" title="교환 신청이 접수되었습니다." />

      <div
        className="fixed bottom-0 left-0 right-0 z-10 pb-2
                  w-full max-w-screen-sm mx-auto"
      >
        <SelectButton
          kind="select-bottom"
          leftText="교환 내역"
          rightText="홈으로"
          leftVariant="left-outline"
          rightVariant="right-orange"
          onLeftClick={() => {
            window.location.href = '/exchange/history';
          }}
          onRightClick={() => {
            window.location.href = '/home';
          }}
        />
      </div>
    </div>
  );
}
