import PageHeader from '@/components/head_bottom/PageHeader';
import OrderProductList from '@/components/orderDetail/orderProductList';
import PaymentInfo from '@/components/orderDetail/paymentInfo';

import { orderData } from '@/mocks/orderData';

const dummyDeliveryData = {
  recipient: '이한비',
  phone: '010-2812-1241',
  address: '서울특별시 강서구 낙성서로12번길 3-12',
};

export default function OrderDetailPersonal() {
  const order = orderData[0];
  const paymentInfo = {
    method: '카카오페이',
    amount: 123122,
    discount: 1239,
    pointsUsed: 324,
    deliveryFee: 0,
    total: 82233,
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <PageHeader title="주문 상세" />

      <main className="flex flex-col gap-4 text-body-regular text-black">
        {/* 날짜 및 주문 번호 */}
        <div className="border-b-black-1 border-b-4 pb-4 px-4">
          <p className="text-subtitle-medium">{order.createdAt}</p>
          <p className="text-small text-black-4">주문 번호 개별 확인</p>
        </div>

        {/* 주문 상품 - 컴포넌트로 분리 */}
        <OrderProductList items={order.items} />

        {/* 배송지 정보 */}
        <section className="px-4 bg-white p-4 pt-0 pb-8 border-b-4 border-b-black-1">
          <h2 className="text-subtitle-medium mb-3">배송지 정보</h2>
          <div className="flex gap-0">
            <div className="flex flex-col gap-2 text-black-4 text-body-regular w-18 ">
              <span>받는 분</span>
              <span>주소</span>
              <span>연락처</span>
            </div>
            <div className="flex flex-col gap-2 text-body-regular">
              <span>{dummyDeliveryData.recipient}</span>
              <span>{dummyDeliveryData.phone}</span>
              <span>{dummyDeliveryData.address}</span>
            </div>
          </div>
        </section>

        <PaymentInfo paymentInfo={paymentInfo} />
      </main>
    </div>
  );
}
