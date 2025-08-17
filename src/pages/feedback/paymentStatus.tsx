import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

import { SelectButton } from '@/components/common/button/selectButton';
import FeedbackPage from '@/components/common/FeedbackPage';

import paymentCompleteIcon from '/src/assets/paymentComplete.svg';
import paymentFailIcon from '/src/assets/paymentFail.svg';

type TPaymentStatus = 'success' | 'fail';

interface IPaymentStatusPageProps {
  status: TPaymentStatus;
  errorMessage?: string;
}

export default function PaymentStatusPage({ status, errorMessage }: IPaymentStatusPageProps) {
  const navigate = useNavigate();
  const isSuccess = status === 'success';

  const subtitle = isSuccess ? undefined : errorMessage || '잠시 후 다시 시도해주세요.';

  return (
    <>
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
        className="min-h-screen"
      >
        <div>
          <FeedbackPage
            iconSrc={isSuccess ? paymentCompleteIcon : paymentFailIcon}
            title={isSuccess ? '주문이 완료됐습니다.' : '일시적 오류로 결제에 실패했어요.'}
            subtitle={subtitle}
          />

          <div className="fixed bottom-0 left-0 right-0 pb-2 flex justify-center">
            <div className="w-full max-w-[600px] px-4">
              <SelectButton
                kind="select-bottom"
                leftText={isSuccess ? '주문 내역' : '장바구니'}
                rightText="홈으로"
                leftVariant="left-outline"
                rightVariant="right-orange"
                onLeftClick={() => {
                  navigate(isSuccess ? 'mypage/order/orderDetailPersonal' : '/shoppingcart');
                }}
                onRightClick={() => {
                  navigate('/home');
                }}
              />
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}
