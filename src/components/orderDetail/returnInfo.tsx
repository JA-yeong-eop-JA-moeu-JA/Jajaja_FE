type TRefundInfoProps = {
  refundInfo: {
    amount: number;
    discount: number;
    pointsUsed: number;
    deliveryFee: number;
    returnDeliveryFee: number;
    total: number;
    method: string;
  };
};

export default function RefundInfo({ refundInfo }: TRefundInfoProps) {
  return (
    <section className="px-4 bg-white flex flex-col gap-2">
      <h2 className="text-subtitle-medium">환불 금액</h2>
      <div className="flex flex-col gap-1 text-body-regular">
        <div className="flex justify-between pb-1">
          <span className="text-black-4">상품 금액</span>
          <span>{refundInfo.amount.toLocaleString()} 원</span>
        </div>

        <div className="flex justify-between pb-1">
          <span className="text-black-4">배송비</span>
          <span>무료 배송</span>
        </div>

        <div className="flex justify-between pb-1">
          <span className="text-black-4">할인 금액</span>
          <span>-{refundInfo.discount.toLocaleString()} 원</span>
        </div>

        <div className="flex justify-between pb-1">
          <span className="text-black-4">적립금 사용</span>
          <span>-{refundInfo.pointsUsed.toLocaleString()} 원</span>
        </div>

        <div className="flex justify-between pb-1">
          <span className="text-black-4">반품 배송비</span>
          <span>-{refundInfo.returnDeliveryFee.toLocaleString()} 원</span>
        </div>

        <div className="border-t border-black-1 my-2" />

        <div className="flex justify-between text-body-regular">
          <span>환불 예상 금액</span>
          <span style={{ color: 'var(--color-green)' }}>{refundInfo.total.toLocaleString()} 원</span>
        </div>

        <div className="flex justify-between text-black">
          <span className="text-black-4">환불 수단</span>
          <span>{refundInfo.method}</span>
        </div>
      </div>
    </section>
  );
}
