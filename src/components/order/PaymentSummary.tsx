interface IPaymentSummaryProps {
  total: number;
  discount: number;
  pointsUsed: number;
  shippingFee: number;
  finalAmount: number;
}

export default function PaymentSummary({ total, discount, pointsUsed, shippingFee, finalAmount }: IPaymentSummaryProps) {
  return (
    <section className="p-4">
      <p className="text-subtitle-medium mb-3">결제 금액</p>
      <div className="flex justify-between text-small-medium mb-2">
        <p>결제 금액</p>
        <p>{total.toLocaleString()} 원</p>
      </div>
      <div className="flex justify-between text-small-medium mb-2">
        <p>할인 금액</p>
        <p className="text-green">-{discount.toLocaleString()} 원</p>
      </div>
      <div className="flex justify-between text-small-medium mb-2">
        <p>적립금 사용</p>
        <p className="text-green">-{pointsUsed.toLocaleString()} 원</p>
      </div>
      <div className="flex justify-between text-small-medium mb-2">
        <p>배송비</p>
        <p className="text-green">{shippingFee === 0 ? '무료' : `${shippingFee.toLocaleString()} 원`}</p>
      </div>
      <div className="flex justify-between border-t-1 border-black-1 text-base text-body-regular mt-1 pt-3">
        <p>총 결제 금액</p>
        <p>{finalAmount.toLocaleString()} 원</p>
      </div>
    </section>
  );
}
