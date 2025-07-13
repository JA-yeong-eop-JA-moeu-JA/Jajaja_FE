import { MATCH_STATUS_COLOR_MAP } from '@/constants/product/statusColorMap';

import { SelectButton } from '@/components/common/button';
import PageHeader from '@/components/head_bottom/PageHeader';
import PaymentInfo from '@/components/orderDetail/paymentInfo';
import OrderItem from '@/components/review/orderItem';

import { orderData } from '@/mocks/orderData';

type TMatchStatus = '매칭 중' | '매칭 완료' | '매칭 실패';

const dummyDeliveryData = {
  recipient: '이한비',
  phone: '010-2812-1241',
  address: '서울특별시 강서구 낙성서로12번길 3-12',
};

export default function OrderDetailTeam() {
  const order = orderData[1]; // 더미용 하드코딩 데이터입니다
  const paymentInfo = {
    method: '카카오페이',
    amount: 123122, //합계는 하드코딩중이므로 바뀌지 않는게 정상이고, 나중에 데이터로 불러올 예정입니당
    discount: 1239,
    pointsUsed: 324,
    deliveryFee: 0,
    total: 82233,
  };
  const getOverallMatchStatus = (items: typeof order.items): TMatchStatus => {
    if (items.every((item) => item.matchStatus === '매칭 완료')) return '매칭 완료';
    if (items.some((item) => item.matchStatus === '매칭 중')) return '매칭 중';
    return '매칭 실패';
  };

  const matchStatus = getOverallMatchStatus(order.items);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <PageHeader title="주문 상세" />

      <main className="flex flex-col pt-0 gap-4 text-body-regular text-black">
        {/* 주문일 + 주문번호 */}
        <section className="px-4 border-b border-b-4 border-b-black-1 pb-4">
          <p className="text-subtitle-medium">{order.createdAt}</p>
          <p className="text-small text-black-4">주문번호 1231236346</p>
        </section>
        {/* 주문 상품 */}
        <section className="px-4 pb-4 border-b border-b-4 border-b-black-1 flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h2 className="text-subtitle-medium">주문 상품</h2>
            <span className={`text-small text-body-medium ${MATCH_STATUS_COLOR_MAP[matchStatus]}`}>{matchStatus}</span>
          </div>

          {order.items.map((item) => (
            <div key={item.productId} className="flex flex-col gap-2">
              <OrderItem item={item} show={false} />
              <SelectButton
                kind="select-content"
                leftText="교환/반품"
                rightText="배송 조회"
                leftVariant="outline-orange"
                rightVariant="outline-orange"
                onLeftClick={() => console.log('교환/반품')}
                onRightClick={() => console.log('배송 조회')}
              />
            </div>
          ))}
        </section>

        {/* 배송지 정보 */}
        <section className="px-4 bg-white p-4 pt-0 pb-8 border-b border-b-4 border-b-black-1">
          <h2 className="text-subtitle-medium mb-3">배송지 정보</h2>
          <div className="flex gap-0">
            <div className="flex flex-col gap-2 text-black-4 text-body-regular w-">
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
