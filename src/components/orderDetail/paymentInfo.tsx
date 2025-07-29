type TPaymentInfoProps = {
  paymentInfo: {
    method: string;
    amount: number;
    discount: number;
    pointsUsed: number;
    deliveryFee: number;
    total: number;
  };
};

export default function PaymentInfo({ paymentInfo }: TPaymentInfoProps) {
  return (
    <section className="px-4 bg-white pt-2 flex flex-col gap-2">
      <h2 className="text-subtitle-medium">결제 정보</h2>
      <div className="flex flex-col gap-1 text-body-regular">
        <div className="flex justify-between">
          <span className="text-black-4">결제 방법</span>
          <span>{paymentInfo.method}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-black-4">결제 금액</span>
          <span>{paymentInfo.amount.toLocaleString()} 원</span>
        </div>
        <div className="flex justify-between">
          <span className="text-black-4">할인 금액</span>
          <span>-{paymentInfo.discount.toLocaleString()} 원</span>
        </div>
        <div className="flex justify-between">
          <span className="text-black-4">적립금 사용</span>
          <span>-{paymentInfo.pointsUsed.toLocaleString()} 원</span>
        </div>
        <div className="flex justify-between pb-4">
          <span className="text-black-4">배송비</span>
          <span>{paymentInfo.deliveryFee === 0 ? '무료' : `${paymentInfo.deliveryFee.toLocaleString()} 원`}</span>
        </div>
        <div className="flex justify-between py-4 text-subtitle-medium border-t border-t-black-1 border-t-1">
          <span>총 결제 금액</span>
          <span className="text-green">{paymentInfo.total.toLocaleString()} 원</span>
        </div>
      </div>
    </section>
  );
}
