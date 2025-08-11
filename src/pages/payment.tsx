import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useModalStore } from '@/stores/modalStore';

import { Button } from '@/components/common/button';
import PageHeader from '@/components/head_bottom/PageHeader';

import Down from '@/assets/icons/down.svg?react';
import KakaoPayIcon from '@/assets/icons/kakaopay.svg?react';
import NaverPayIcon from '@/assets/icons/naverpay.svg?react';
import { orderData } from '@/mocks/orderData';

interface IAddressBlockProps {
  name: string;
  phone: string;
  address: string;
}

interface IPaymentSummaryProps {
  total: number;
  discount: number;
  pointsUsed: number;
  shippingFee: number;
  finalAmount: number;
}

export default function Payment() {
  const navigate = useNavigate();
  const { openModal } = useModalStore();
  const currentOrderItems = orderData[0].items;
  const [selectedPayment, setSelectedPayment] = useState<'naver' | 'kakao' | null>(null);
  const [selectedDeliveryRequest, setSelectedDeliveryRequest] = useState<string>('');
  const [usedPoints, setUsedPoints] = useState<number>(0);
  const [userPoints] = useState<number>(1382);
  const handlePointsChange = (value: number) => {
    if (value > userPoints) {
      setUsedPoints(userPoints); // 보유 포인트보다 크면 전체 사용하도록
    } else if (value < 0) {
      setUsedPoints(0);
    } else {
      setUsedPoints(value);
    }
  };
  const handleDeliveryRequestClick = () => {
    openModal('delivery', {
      onSelect: (text: string) => setSelectedDeliveryRequest(text),
    });
  };

  function AddressSection({ name, phone, address }: IAddressBlockProps) {
    return (
      <section className="p-4">
        <div className="flex justify-between items-center mb-2">
          <p className="text-subtitle-medium">배송지</p>
          <button className="text-orange text-small-medium" onClick={() => navigate('/addresschange')}>
            변경하기
          </button>
        </div>
        <p className="text-body-regular mb-1">{name}</p>
        <p className="text-body-regular">{phone}</p>
        <p className="text-body-regular">{address}</p>
        <button
          className="w-full flex items-center justify-between border border-black-3 text-small-medium rounded mt-3 mb-4 px-4 py-3"
          onClick={handleDeliveryRequestClick}
        >
          <span className={selectedDeliveryRequest ? 'text-black' : 'text-black-4'}>{selectedDeliveryRequest || '배송 요청 사항을 선택해주세요.'}</span>
          <Down className="w-4 h-2" />
        </button>
      </section>
    );
  }

  function PaymentSummarySection({ total, discount, pointsUsed, shippingFee, finalAmount }: IPaymentSummaryProps) {
    return (
      <section className="p-4">
        <p className="text-subtitle-medium py-3 mb-1">결제 금액</p>
        <div className="flex justify-between text-small-medium mb-2">
          <p>결제 금액</p>
          <p>{total.toLocaleString()} 원</p>
        </div>
        <div className="flex justify-between text-small-medium mb-2">
          <p>할인 금액</p>
          <p className="text-green">-{discount.toLocaleString()} 원</p>
        </div>
        <div className="flex justify-between text-small-medium mb-2">
          <p>적립금 사용</p>
          <p className="text-green">-{pointsUsed.toLocaleString()} 원</p>
        </div>
        <div className="flex justify-between text-small-medium mb-3">
          <p>배송비</p>
          <p className="text-green">{shippingFee === 0 ? '무료' : `${shippingFee.toLocaleString()} 원`}</p>
        </div>
        <div className="flex justify-between border-t-1 border-black-1 text-base text-body-regular pt-3 pb-10">
          <p>총 결제 금액</p>
          <p>{finalAmount.toLocaleString()} 원</p>
        </div>
      </section>
    );
  }

  function AgreementNoticeSection() {
    return (
      <section className="p-4 text-small-regular text-black-4 leading-5 bg-black-0">
        <div className="space-y-2 pb-30">
          <p className="underline">서비스 및 이용 약관 동의</p>
          <p className="underline">개인정보 제공 동의</p>
          <p className="underline">결제대행 서비스 이용약관 동의</p>
          <p className="mt-3">자자자는 통신판매중개자로, 업체 배송 상품의 상품/상품정보/거래 등에 대한 책임은 자자자가 아닌 판매자에게 있습니다.</p>
          <p className="mt-3">위 내용을 확인하였으며 결제에 동의합니다.</p>
        </div>
      </section>
    );
  }

  return (
    <>
      <PageHeader title="주문 결제" />

      <section className="border-b-4 border-black-1">
        <div className="w-full">
          <AddressSection name="이한비" phone="010-2812-1241" address="서울특별시 강서구 낙섬서로12번길 3-12" />
        </div>
      </section>

      <section className="p-4 border-b-4 border-black-1">
        <p className="text-subtitle-medium mb-4">주문 상품 {currentOrderItems.length}개</p>
        {currentOrderItems.map((item) => (
          <div key={item.productId} className="mb-5">
            {/*             <OrderItem item={item} show={false} />
             */}
          </div>
        ))}
      </section>

      <section className="p-4 mt-3 border-b-4 border-black-1">
        <p className="text-subtitle-medium mb-4">할인 혜택</p>
        <div className="flex justify-between items-center border-1 border-black-3 rounded px-4 py-3 mb-3" onClick={() => navigate('/coupon')}>
          <p className="text-body-medium">쿠폰</p>
          <div className="flex items-center gap-3">
            <p className="text-body-regular">사용 가능 2장</p>
            <Down className="w-4 h-2 mr-1" />
          </div>
        </div>
        <div className="flex gap-2 mb-2">
          <div className="flex-1 flex justify-between items-center border-1 border-black-3 rounded px-4 py-3">
            <p className="text-body-medium">포인트</p>
            <div className="flex items-center gap-2">
              <input
                type="number"
                className="w-16 text-right text-body-regular bg-transparent outline-none"
                placeholder="0"
                value={usedPoints || ''}
                onChange={(e) => handlePointsChange(Number(e.target.value) || 0)}
                min="0"
                max={userPoints}
              />
              <span className="text-body-regular">원</span>
            </div>
          </div>

          <button className="px-4 py-2.5 border-1 border-black-3 text-body-regular rounded whitespace-nowrap" onClick={() => setUsedPoints(userPoints)}>
            모두 사용
          </button>
        </div>

        <div className="flex justify-end">
          <p className="text-small-medium text-black-4">보유 포인트: 1,382 원</p>
        </div>
      </section>

      <section className="p-4 border-b-4 border-black-1">
        <p className="text-subtitle-medium py-3">결제 수단</p>
        <div className="flex gap-2 py-2 mb-2.5">
          <button
            className={`flex-1 border-1 py-2.5 rounded flex items-center justify-center gap-1 text-body-regular ${
              selectedPayment === 'naver' ? 'border-orange' : 'border-black-3'
            }`}
            onClick={() => setSelectedPayment('naver')}
          >
            <NaverPayIcon className="w-5 h-5" />
            네이버페이
          </button>
          <button
            className={`flex-1 border-1 py-2.5 rounded flex items-center justify-center gap-1 text-body-regular ${
              selectedPayment === 'kakao' ? 'border-orange' : 'border-black-3'
            }`}
            onClick={() => setSelectedPayment('kakao')}
          >
            <KakaoPayIcon className="w-5 h-5" />
            카카오페이
          </button>
        </div>
      </section>

      <PaymentSummarySection total={123122} discount={1239} pointsUsed={324} shippingFee={0} finalAmount={82233} />

      <AgreementNoticeSection />
      <div className="fixed bottom-14 left-0 right-0 w-full max-w-[600px] mx-auto">
        <Button kind="basic" variant="solid-orange" /*disabled={주소지 추가 안했을 경우로 수정}*/ onClick={() => navigate('/결제')} className="w-full">
          0원 결제하기
        </Button>
      </div>
    </>
  );
}
