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

type TRegion = '일반' | '제주도' | '도서산간';

const KRW = new Intl.NumberFormat('ko-KR');
const formatKRW = (n: number) => `${KRW.format(n)} 원`;

const METHOD_LABEL: Record<string, string> = {
  NORMAL: '일반 결제',
  BILLING: '자동 결제',
  BRANDPAY: '간편결제',
};

function getRegionByAddress(address?: string): TRegion {
  const text = (address ?? '').trim();
  if (/제주/.test(text)) return '제주도';
  if (/울릉|독도|백령|거문|연평|추자/.test(text)) return '도서산간';
  return '일반';
}

// 정책 상수
const RETURN_FEE = {
  일반: -6000,
  제주도: -14000,
  도서산간: -18000,
} as const;

const PICKUP_SURCHARGE = {
  제주도: 4000,
  도서산간: 6000,
} as const;

// 고객 단순 변심이면 음수(공제), 하자/오배송이면 0 또는 일부 지역 추가비용(+)
function calculateReturnFee(region: TRegion, reason?: string): number {
  const isSimpleChange = (reason ?? '').trim() === '고객 단순 변심';
  if (isSimpleChange) return RETURN_FEE[region] ?? 0;
  if (region === '제주도') return PICKUP_SURCHARGE.제주도;
  if (region === '도서산간') return PICKUP_SURCHARGE.도서산간;
  return 0;
}

export default function RefundInfo({ refundInfo }: TRefundInfoProps) {
  const region = getRegionByAddress(refundInfo.address);
  const returnFee = calculateReturnFee(region, refundInfo.reason);

  // 총 환불 예상 금액 = 상품금액 - 할인 - 포인트 ± 반품/회수 비용
  const total = refundInfo.amount - refundInfo.discount - refundInfo.pointsUsed + returnFee;

  const deliveryFeeText = refundInfo.deliveryFee > 0 ? `+${formatKRW(refundInfo.deliveryFee)}` : '무료';

  const methodLabel = METHOD_LABEL[refundInfo.method] ?? refundInfo.method;

  return (
    <section className="px-4 bg-white flex flex-col gap-2">
      <h2 className="text-subtitle-medium">환불 금액</h2>
      <div className="flex flex-col gap-1 text-body-regular">
        <div className="flex justify-between pb-1">
          <span className="text-black-4">상품 금액</span>
          <span>{formatKRW(refundInfo.amount)}</span>
        </div>

        <div className="flex justify-between pb-1">
          <span className="text-black-4">배송비</span>
          <span>{deliveryFeeText}</span>
        </div>

        <div className="flex justify-between pb-1">
          <span className="text-black-4">할인 금액</span>
          <span>-{formatKRW(refundInfo.discount)}</span>
        </div>

        <div className="flex justify-between pb-1">
          <span className="text-black-4">적립금 사용</span>
          <span>-{formatKRW(refundInfo.pointsUsed)}</span>
        </div>

        <div className="flex justify-between pb-1">
          <span className="text-black-4">반품 배송비</span>
          <span className={returnFee > 0 ? 'text-red-500' : ''}>
            {returnFee > 0 ? '+' : ''}
            {formatKRW(Math.abs(returnFee))}
          </span>
        </div>

        <div className="flex justify-between border-t-1 border-black-1 text-base text-body-regular pt-3">
          <span>환불 예상 금액</span>
          <span className="text-green">{formatKRW(total)}</span>
        </div>

        <div className="flex justify-between text-black">
          <span className="text-black-4">환불 수단</span>
          <span>{methodLabel}</span>
        </div>
      </div>
    </section>
  );
}
