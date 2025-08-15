import { SelectButton } from '@/components/common/button/selectButton';
import FeedbackPage from '@/components/common/FeedbackPage';

import exchangeIcon from '@/assets/exchange.svg';

export default function ReturnCompletePage() {
  return (
    <div>
      <FeedbackPage iconSrc={exchangeIcon} title="반품 신청이 접수되었습니다." />

      <div
        className="fixed bottom-0 left-0 right-0 z-10 pb-2
                  w-full max-w-screen-sm mx-auto"
      >
        <SelectButton
          kind="select-bottom"
          leftText="반품 내역"
          rightText="홈으로"
          leftVariant="left-outline"
          rightVariant="right-orange"
          onLeftClick={() => {
            window.location.href = '/return/history';
          }}
          onRightClick={() => {
            window.location.href = '/home';
          }}
        />
      </div>
    </div>
  );
}
