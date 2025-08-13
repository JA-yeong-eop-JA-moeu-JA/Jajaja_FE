// src/pages/OrderDetailPersonal.tsx
import { useParams, useSearchParams } from 'react-router-dom';

// mocks 의존 피하려면 이렇게 쓰는 걸 추천 (없으면 기존 경로 유지해도 됨)
//import type { IOrderItem } from '@/types/order/orderItem';
import useOrderDetailPersonal from '@/hooks/order/useOrderDetailPersonal';

import PageHeader from '@/components/head_bottom/PageHeader';
import OrderProductList from '@/components/orderDetail/orderProductList';
import PaymentInfo from '@/components/orderDetail/paymentInfo';

type TOrderStatus = '배송 중' | '결제 완료' | '결제 취소' | '반품 접수' | '교환 접수';
type TMatchStatus = '매칭 중' | '매칭 완료' | '매칭 실패';

function formatPayMethod(method: string) {
  if (method === 'KAKAO') return '카카오페이';
  return method;
}

const toOrderStatusLabel = (items: Array<{ status?: string }>): TOrderStatus => {
  const codes = items.map((i) => (i.status ?? '').toUpperCase());
  if (codes.some((c) => c === 'CANCELED' || c === 'CANCELLED' || c === 'PAYMENT_CANCELED')) {
    return '결제 취소';
  }
  if (codes.some((c) => c === 'RETURN_REQUESTED' || c === 'RETURNING' || c === 'REFUND_REQUESTED')) {
    return '반품 접수';
  }
  if (codes.some((c) => c === 'EXCHANGE_REQUESTED' || c === 'EXCHANGING')) {
    return '교환 접수';
  }
  if (codes.some((c) => c === 'SHIPPING' || c === 'IN_DELIVERY' || c === 'DELIVERING' || c === 'DELIVERED')) {
    return '배송 중';
  }
  return '결제 완료';
};

const toMatchStatusLabel = (items: Array<{ teamStatus?: string; matchingStatus?: string }>): TMatchStatus | undefined => {
  const raw = items.map((i) => (i.teamStatus ?? i.matchingStatus ?? '').toUpperCase()).filter(Boolean);
  if (raw.length === 0) return undefined; // 개인 주문: 매칭 상태 없음
  if (raw.some((v) => v === 'MATCHING')) return '매칭 중';
  if (raw.every((v) => v === 'MATCHED')) return '매칭 완료';
  return '매칭 실패';
};

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
  const mappedItems = items.map((it) => {
    const isAfterSales = ['RETURN_REQUESTED', 'EXCHANGE_REQUESTED'].includes((it.status ?? '').toUpperCase());

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

        <h2 className="text-subtitle-medium px-5">주문 상품</h2>

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
