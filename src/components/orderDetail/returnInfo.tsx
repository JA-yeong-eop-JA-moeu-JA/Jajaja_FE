type TRefundInfoProps = {
  refundInfo: {
    amount: number;
    discount: number;
    pointsUsed: number;
    deliveryFee: number;
    method: string;
    reason: string;
    address: string;
  };
};

function getRegionByAddress(address: string): '일반' | '제주도' | '도서산간' {
  if (/제주/.test(address)) return '제주도';
  if (/울릉|독도|백령|거문|연평|추자/.test(address)) return '도서산간';
  return '일반';
}

function calculateReturnFee(region: string, reason: string): number {
  const isSimpleChange = reason === '고객 단순 변심';
  if (isSimpleChange) {
    if (region === '일반') return -6000;
    if (region === '제주도') return -14000;
    if (region === '도서산간') return -18000;
  } else {
    if (region === '제주도') return 4000;
    if (region === '도서산간') return 6000;
  }
  return 0;
}

export default function RefundInfo({ refundInfo }: TRefundInfoProps) {
  const region = getRegionByAddress(refundInfo.address);
  const returnFee = calculateReturnFee(region, refundInfo.reason);
  const total = refundInfo.amount - refundInfo.discount - refundInfo.pointsUsed + returnFee;

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

          <span className={returnFee > 0 ? 'text-red-500' : ''}>
            {returnFee > 0 ? '+' : ''}
            {Math.abs(returnFee).toLocaleString()} 원
          </span>
        </div>

        <div className="flex justify-between text-body-regular border-t border-t-black-1 pt-2">
          <span>환불 예상 금액</span>
          <span className="text-green">{total.toLocaleString()} 원</span>
        </div>

        <div className="flex justify-between text-black">
          <span className="text-black-4">환불 수단</span>
          <span>{refundInfo.method}</span>
        </div>
      </div>
    </section>
  );
}
