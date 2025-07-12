import { ORDER_PRODUCTS } from '@/constants/order/product';

import PageHeader from '@/components/head_bottom/PageHeader';
import AddressBlock from '@/components/order/Address';
import AgreementNotice from '@/components/order/AgreementNotice';
import PaymentSummary from '@/components/order/PaymentSummary';
import OrderItem from '@/components/review/orderItem';

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
        <p className="text-subtitle-medium mb-4">주문 상품 {ORDER_PRODUCTS.length}개</p>
        {ORDER_PRODUCTS.map((product) => {
          const orderItemData = {
            orderId: 1, // 결제 페이지에서는 임시값
            productId: product.id,
            name: product.name,
            company: product.company,
            price: product.price,
            image: product.imageUrl,
            option: '기본 옵션', // 임시 기본 옵션
            quantity: 1, // 임시 수량
            reviewed: false,
          };

          return (
            <div key={product.id} className="mb-5">
              <OrderItem key={product.id} item={orderItemData} show={false} />
            </div>
          );
        })}
      </section>

      {/* 할인 혜택 */}
      <section className="p-4 mt-3 border-b-4 border-black-1">
        <p className="text-subtitle-medium mb-4">할인 혜택</p>
        <div className="flex justify-between items-center border-1 border-black-3 rounded px-4 py-3 mb-3">
          <p className="text-body-medium">쿠폰</p>
          <div className="flex items-center gap-3">
            <p className="text-body-regular">사용 가능 2장</p>
            <Down className="w-4 h-2 mr-1" />
          </div>
        </div>
        <div className="flex justify-between items-center border-1 border-black-3 rounded px-4 py-3 mb-2">
          <div className="flex items-center gap-2">
            <p className="text-body-medium">포인트</p>
            <p className="text-body-regular">0 원</p>
          </div>
        </div>
        <div className="flex items-center">
          <p className="text-small-medium text-black-4 mb-3 ml-auto">보유 포인트: 1,382 원</p>
        </div>
      </section>

      {/* 결제 수단 */}
      <section className="p-4 border-b-4 border-black-1">
        <p className="text-subtitle-medium py-3">결제 수단</p>
        <div className="flex gap-2 py-2 mb-2.5">
          <button className="flex-1 border-1 border-black-3 py-2.5 rounded flex items-center justify-center gap-1 text-body-regular">
            <NaverPayIcon className="w-5 h-5" />
            네이버페이
          </button>
          <button className="flex-1 border-1 border-black-3 py-2.5 rounded flex items-center justify-center gap-1 text-body-regular">
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
