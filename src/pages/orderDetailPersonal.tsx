// src/pages/OrderDetailPersonal.tsx
import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';

import useOrderDetailPersonal from '@/hooks/order/useOrderDetailPersonal';

import PageHeader from '@/components/head_bottom/PageHeader';
import OrderProductList from '@/components/orderDetail/orderProductList';
import PaymentInfo from '@/components/orderDetail/paymentInfo';

type TOrderStatus =
  | '결제 대기' // READY
  | '결제 완료' // DONE
  | '결제 취소' // CANCELED
  | '결제 실패' // ABORTED
  | '거래 취소' // EXPIRED
  | '배송 중' // SHIPPING
  | '배송 완료' // DELIVERED
  | '환불 요청' // REFUND_REQUESTED
  | '환불 실패' // REFUND_FAILED
  | '환불 완료' // REFUNDED
  | '매칭 실패'; // TEAM_MATCHING_FAILED

type TMatchStatus = '매칭 중' | '매칭 완료' | '매칭 실패';

const MATCH_TTL_MINUTES = 600;

// PaymentMethod.java: NORMAL, BILLING, BRANDPAY 만 사용
function formatPayMethod(method: string) {
  switch ((method ?? '').toUpperCase()) {
    case 'NORMAL':
      return '일반 결제';
    case 'BILLING':
      return '자동결제';
    case 'BRANDPAY':
      return '브랜드페이';
    default:
      return method; // 그 외 값은 그대로 노출
  }
}

// BE OrderStatus 키
type TBEOrderStatus =
  | 'READY'
  | 'DONE'
  | 'CANCELED'
  | 'ABORTED'
  | 'EXPIRED'
  | 'SHIPPING'
  | 'DELIVERED'
  | 'REFUND_REQUESTED'
  | 'REFUND_FAILED'
  | 'REFUNDED'
  | 'TEAM_MATCHING_FAILED';

// 1:1 라벨 매핑
const ORDER_STATUS_LABEL_MAP: Record<TBEOrderStatus, TOrderStatus> = {
  READY: '결제 대기',
  DONE: '결제 완료',
  CANCELED: '결제 취소',
  ABORTED: '결제 실패',
  EXPIRED: '거래 취소',
  SHIPPING: '배송 중',
  DELIVERED: '배송 완료',
  REFUND_REQUESTED: '환불 요청',
  REFUND_FAILED: '환불 실패',
  REFUNDED: '환불 완료',
  TEAM_MATCHING_FAILED: '매칭 실패',
};

// 단일 아이템 기준으로 BE 값만 사용 (현재 호출부가 [it] 형태)
const toOrderStatusLabel = (items: Array<{ status?: string }>): TOrderStatus => {
  const code = (items[0]?.status ?? '').toUpperCase() as TBEOrderStatus;
  return ORDER_STATUS_LABEL_MAP[code] ?? '결제 대기';
};

const toMatchStatusLabel = (items: Array<{ teamStatus?: string; matchingStatus?: string }>): TMatchStatus | undefined => {
  const raw = items.map((i) => (i.teamStatus ?? i.matchingStatus ?? '').toUpperCase()).filter(Boolean);
  if (raw.length === 0) return undefined; // 개인 주문: 매칭 상태 없음
  if (raw.some((v) => v === 'MATCHING')) return '매칭 중';
  if (raw.every((v) => v === 'COMPLETED')) return '매칭 완료';
  return '매칭 실패';
};

function getRemainMs(teamCreatedAt: string | null | undefined) {
  if (!teamCreatedAt) return 0;
  const start = new Date(teamCreatedAt).getTime();
  const end = start + MATCH_TTL_MINUTES * 60_000;
  return Math.max(0, end - Date.now());
}
function fmtHMS(ms: number) {
  const hh = String(Math.floor(ms / 3_600_000)).padStart(2, '0');
  const mm = String(Math.floor((ms % 3_600_000) / 60_000)).padStart(2, '0');
  const ss = String(Math.floor((ms % 60_000) / 1_000)).padStart(2, '0');
  return `${hh}:${mm}:${ss}`;
}
function Countdown({ teamCreatedAt }: { teamCreatedAt?: string | null }) {
  const [remain, setRemain] = useState(() => getRemainMs(teamCreatedAt));
  useEffect(() => {
    setRemain(getRemainMs(teamCreatedAt));
    const t = setInterval(() => setRemain(getRemainMs(teamCreatedAt)), 1000);
    return () => clearInterval(t);
  }, [teamCreatedAt]);
  if (!teamCreatedAt) return null;
  return <span className="text-xs text-gray-500">{remain === 0 ? '마감' : fmtHMS(remain)}</span>;
}

export default function OrderDetailPersonal() {
  const params = useParams<{ orderId?: string }>();
  const [searchParams] = useSearchParams();

  const orderIdStr = params.orderId ?? searchParams.get('orderId') ?? '';
  const id = Number(orderIdStr);

  const { data } = useOrderDetailPersonal(id);

  if (!Number.isFinite(id) || id <= 0) {
    return <p className="p-4 text-error-3">유효하지 않은 주문입니다.</p>;
  }

  if (!data) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <PageHeader title="주문 상세" />
        <p className="p-4 text-black-3">주문정보를 불러오는 중입니다...</p>
      </div>
    );
  }

  const { date, orderNumber, items, delivery, payment } = data;

  const firstMatching = items.find((it) => (it.teamStatus ?? it.matchingStatus ?? '').toUpperCase() === 'MATCHING');
  const teamCreatedAt = firstMatching?.teamCreatedAt;

  const mappedItems = items.map((it) => {
    const isAfterSales = ['REFUND_REQUESTED'].includes((it.status ?? '').toUpperCase());
    return {
      orderId: id,
      orderProductId: it.orderProductId,
      productId: it.product.id,
      name: it.product.name,
      company: it.product.store,
      option: it.product.option,
      quantity: it.product.quantity,
      image: it.product.image,
      price: it.price,
      reviewed: false,

      orderStatus: toOrderStatusLabel([it]),
      matchStatus: isAfterSales ? undefined : toMatchStatusLabel([it]),
      // teamCreatedAt: it.teamCreatedAt ?? null,
    };
  });

  const paymentInfo = {
    method: formatPayMethod(payment.method),
    amount: payment.amount,
    discount: payment.discount,
    pointsUsed: payment.pointUsed,
    deliveryFee: payment.shippingFee,
    total: payment.finalAmount,
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <PageHeader title="주문 상세" />

      <main className="flex flex-col gap-4 text-body-regular text-black">
        <div className="border-b-black-1 border-b-4 pb-4 px-4">
          <p className="text-subtitle-medium">{new Date(date).toLocaleString('ko-KR')}</p>
          <p className="text-body-regular text-black-4">주문 번호 {orderNumber}</p>
        </div>

        {/* 주문 상품 헤더 + 우측에 매칭 상태/카운트다운 */}
        <div className="px-6 flex items-center justify-between">
          <h2 className="text-subtitle-medium">주문 상품</h2>
          {firstMatching && (
            <div className="flex items-center gap-2">
              <span className="text-xs">매칭 중</span>
              <Countdown teamCreatedAt={teamCreatedAt} />
            </div>
          )}
        </div>

        {/* 팀/개인 공용: 개인은 matchStatus가 표시되지 않음 */}
        <OrderProductList items={mappedItems} parentOrderId={id} />

        <section className="px-4 bg-white p-4 pt-0 pb-8 border-b-4 border-b-black-1">
          <h2 className="text-subtitle-medium mb-3">배송지 정보</h2>
          <div className="flex gap-0">
            <div className="flex flex-col gap-2 text-black-4 text-body-regular w-18">
              <span>받는 분</span>
              <span>연락처</span>
              <span>주소</span>
            </div>
            <div className="flex flex-col gap-2 text-body-regular">
              <span>{delivery.name}</span>
              <span>{delivery.phone}</span>
              <span>{delivery.address}</span>
            </div>
          </div>
        </section>

        <PaymentInfo paymentInfo={paymentInfo} />
      </main>
    </div>
  );
}
