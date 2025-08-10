// src/pages/OrderDetailTeam.tsx
import PageHeader from '@/components/head_bottom/PageHeader';
import OrderProductList from '@/components/orderDetail/orderProductList';
import PaymentInfo from '@/components/orderDetail/paymentInfo';
import { useParams } from 'react-router-dom';

import useOrderDetailPersonal from '@/hooks/order/useOrderDetailPersonal';

import type { IOrderItem } from '@/types/order/orderItem';

type TMatchStatus = '매칭 중' | '매칭 완료' | '매칭 실패';
type TOrderStatus = '배송 중' | '결제 완료' | '결제 취소' | '반품 접수' | '교환 접수';

const toOrderStatusLabel = (items: Array<{ status?: string }>): TOrderStatus => {
  const codes = items.map((i) => (i.status ?? '').toUpperCase());

  // 우선순위: 취소 > 반품 > 교환 > 배송중 > 결제완료
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

const toMatchStatusLabel = (items: Array<{ teamStatus?: string; matchingStatus?: string }>): TMatchStatus => {
  const ts = items.map((i) => (i.teamStatus ?? i.matchingStatus ?? '').toUpperCase());
  if (ts.some((v) => v === 'MATCHING')) return '매칭 중';
  if (ts.every((v) => v === 'MATCHED')) return '매칭 완료';
  return '매칭 실패';
};

function formatPayMethod(method: string) {
  if (method === 'KAKAO') return '카카오페이';
  return method;
}

export default function OrderDetailTeam() {
  const { orderId } = useParams<{ orderId: string }>();
  const id = Number(orderId);
  const { data } = useOrderDetailPersonal(id); // { data }만 사용

  // 유효하지 않은 ID 처리
  if (!orderId || Number.isNaN(id)) {
    return <p className="p-4 text-error-3">유효하지 않은 주문입니다.</p>;
  }

  // 데이터 로딩 중 or 실패 시 처리
  if (!data) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <PageHeader title="주문 상세" />
        <p className="p-4 text-black-3">주문정보를 불러오는 중입니다...</p>
      </div>
    );
  }

  const { date, orderNumber, items, delivery, payment } = data;

  const mappedItems: IOrderItem[] = items.map((it) => ({
    orderId: it.orderProductId,
    productId: it.product.id,
    name: it.product.name,
    company: it.product.store,
    option: it.product.option,
    quantity: it.product.quantity,
    image: it.product.image,
    price: it.price,
    reviewed: false, // API에 없으므로 기본값
  }));

  const orderStatus: TOrderStatus = toOrderStatusLabel(items);
  const hasAfterSales = items.some(({ status }) =>
    ['RETURN_REQUESTED', 'EXCHANGE_REQUESTED'].includes((status ?? '').toUpperCase())
  );

  const matchStatus: TMatchStatus | undefined = hasAfterSales
    ? undefined
    : toMatchStatusLabel(items);

  // PaymentInfo 컴포넌트 prop에 맞게 매핑
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

      <main className="flex flex-col pt-0 gap-4 text-body-regular text-black">
        <div className="border-b-black-1 border-b-4 pb-4 px-4">
          <p className="text-subtitle-medium">
            {new Date(date).toLocaleString('ko-KR')}
          </p>
          <p className="text-small text-black-4">주문 번호 {orderNumber}</p>
        </div>

        <h2 className="text-subtitle-medium px-4">주문 상품</h2>

        <OrderProductList items={mappedItems} orderStatus={orderStatus} matchStatus={matchStatus} />

        <section className="px-4 bg-white p-4 pt-0 pb-8 border-b-4 border-b-black-1">
          <h2 className="text-subtitle-medium mb-3">배송지 정보</h2>
          <div className="flex gap-0">
            <div className="flex flex-col gap-2 text-black-4 text-body-regular w-18 ">
              <span>받는 분</span>
              <span>주소</span>
              <span>연락처</span>
            </div>
            <div className="flex flex-col gap-2 text-body-regular">
              <span>{delivery.name}</span>
              <span>{delivery.address}</span>
              <span>{delivery.phone}</span>
            </div>
          </div>
        </section>

        <PaymentInfo paymentInfo={paymentInfo} />
      </main>
    </div>
  );
}
