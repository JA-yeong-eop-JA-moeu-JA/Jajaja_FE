import FeedbackPage from '@/components/common/FeedbackPage';

export default function ReturnCompletePage() {
  return (
    <FeedbackPage
      iconSrc="/src/assets/exchange.svg"
      title="반품 신청이 접수되었습니다."
      leftButtonText="반품 내역"
      onLeftClick={() => (window.location.href = '/return/history')}
      rightButtonText="홈으로"
      onRightClick={() => (window.location.href = '/')}
    />
  );
}
