import { ORDER_PRODUCTS } from '@/constants/order/product';

import PageHeader from '@/components/head_bottom/PageHeader';
import AddressBlock from '@/components/order/Address';
import AgreementNotice from '@/components/order/AgreementNotice';
import OrderItem from '@/components/order/OrderItem';
import PaymentMethods from '@/components/order/PaymentMethods';
import PaymentSummary from '@/components/order/PaymentSummary';

import Down from '@/assets/icons/down.svg?react';
import KakaoPayIcon from '@/assets/icons/kakaopay.svg?react';
import NaverPayIcon from '@/assets/icons/naverpay.svg?react';

export default function Payment() {
  return (
    <>
      <PageHeader title="주문 결제" />
      <section className="border-b-4 border-black-1">
        <div className="w-full max-w-[500px] mx-auto bg-white">
          <AddressBlock name="이한비" phone="010-2812-1241" address="서울특별시 강서구 낙섬서로12번길 3-12" />
        </div>
      </section>

      <section className="p-4 border-b-4 border-black-1">
        <p className="font-medium mb-3">주문 상품 {ORDER_PRODUCTS.length}개</p>
        {ORDER_PRODUCTS.map((item) => (
          <OrderItem key={item.id} name={item.name} price={item.price} company={item.company} imageUrl={item.imageUrl} />
        ))}
      </section>

      {/* 할인 혜택 */}
      <section className="p-4 border-b-4 border-black-1">
        <p className="font-medium mb-3">할인 혜택</p>

        {/* 쿠폰 선택 영역 */}
        <div className="flex justify-between items-center border-1 border-black-3 rounded px-4 py-3 mb-3">
          <p className="text-sm">쿠폰</p>
          <div className="flex items-center gap-1">
            <p className="text-sm text-gray-600">사용 가능 2장</p>
            <Down />
          </div>
        </div>

        <div className="flex border-1 border-black-3 rounded px-4 py-3 items-center justify-between">
          {/* 왼쪽 그룹 */}
          <div className="flex items-center gap-2">
            <p className="text-sm">포인트</p>
            <p className="text-sm">{}원</p>
          </div>
        </div>
      </section>

      {/* 결제 수단 */}
      <section className="p-4 border-b-4 border-black-1">
        <p className="font-medium mb-3">결제 수단</p>
        <div className="flex gap-2">
          <button className="flex-1 border border-gray-300 py-2 rounded flex items-center justify-center gap-1 text-sm">
            <NaverPayIcon className="w-5 h-5" />
            네이버페이
          </button>
          <button className="flex-1 border border-gray-300 py-2 rounded flex items-center justify-center gap-1 text-sm">
            <KakaoPayIcon className="w-5 h-5" />
            카카오페이
          </button>
        </div>
      </section>

      <PaymentSummary total={123122} discount={1239} pointsUsed={324} shippingFee={0} finalAmount={82233} />

      <AgreementNotice />
    </>
  );
}
