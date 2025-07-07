import FeedbackPage from '@/components/common/FeedbackPage';

export default function ExchangeCompletePage() {
  return (
    <FeedbackPage
      iconSrc="/src/assets/exchange.svg"
      title="교환 신청이 접수되었습니다."
      leftButtonText="교환 내역"
      onLeftClick={() => (window.location.href = '/exchange/history')}
      rightButtonText="홈으로"
      onRightClick={() => (window.location.href = '/')}
    />
  );
}
