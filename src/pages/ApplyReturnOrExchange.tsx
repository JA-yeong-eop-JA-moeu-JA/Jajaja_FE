import { useState } from 'react';

import { Button, SelectButton } from '@/components/common/button';
import PageHeader from '@/components/head_bottom/PageHeader';
import RefundInfo from '@/components/orderDetail/returnInfo';
import OrderItem from '@/components/review/orderItem';

import { orderData } from '@/mocks/orderData';

export default function ApplyReturnOrExchange() {
  const order = orderData[0];
  const item = order.items[0];

  // ✅ 하드코딩된 배송지 정보
  const dummyDeliveryData = {
    recipient: '이한비',
    phone: '010-2812-1241',
    address: '서울특별시 강서구 낙성서로12번길 3-12',
  };

  // ✅ 하드코딩된 결제 정보
  const dummyRefundInfo = {
    amount: 12090,
    discount: 1239,
    pointsUsed: 324,
    deliveryFee: 0,
    returnDeliveryFee: 6000,
    total: 82233,
    method: '카카오페이',
  };

  const [selectedType, setSelectedType] = useState<'교환' | '반품' | null>(null);
  const [selectedReason, setSelectedReason] = useState('');
  const [deliveryRequest, setDeliveryRequest] = useState('');

  const isFormValid = selectedType !== null && selectedReason !== '';

  const handleSubmit = () => {
    alert(`${selectedType} 신청 완료`);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <PageHeader title="교환/반품 신청" />

      <main className="flex flex-col gap-6 pb-24">
        {/* 상품 정보 */}
        <section className="flex flex-col gap-2 py-6 border-b border-b-black-1 border-b-4">
          <div className="px-4">
            <h2 className="text-subtitle-medium pb-4">상품 정보</h2>
            <OrderItem item={item} show={false} />
          </div>
        </section>

        {/* 해결 방법 */}
        <section className="flex flex-col text-body-regular gap-2">
          <h2 className="text-subtitle-medium px-4">해결 방법</h2>
          <div className="mx-0 px-0 h-[56px]">
            <SelectButton
              kind="select-content"
              leftText="교환"
              rightText="반품"
              leftVariant={selectedType === '교환' ? 'outline-orange' : 'outline-gray'}
              rightVariant={selectedType === '반품' ? 'outline-orange' : 'outline-gray'}
              onLeftClick={() => setSelectedType('교환')}
              onRightClick={() => setSelectedType('반품')}
            />
          </div>
        </section>

        {/* (임시) 사유 선택 - 나중에 채채님 컴포넌트로 대체 예정*/}
        <section className="flex flex-col gap-2 px-4 pb-8 border-b border-b-black-1 border-b-4">
          <h2 className="text-subtitle-medium pb-2">사유</h2>
          <select value={selectedReason} onChange={(e) => setSelectedReason(e.target.value)} className="border border-black-3 rounded-md p-2 text-body-regular">
            <option value="">옵션 선택</option>
            {selectedType === '반품' && (
              <>
                <option value="고객 단순 변심">고객 단순 변심</option>
                <option value="상품 불량">상품 불량</option>
                <option value="상품 파손">상품 파손</option>
                <option value="상품 구성품 누락">상품 구성품 누락</option>
                <option value="상품이 설명과 다름">상품이 설명과 다름</option>
                <option value="상품 오배송">상품 오배송</option>
              </>
            )}
            {selectedType === '교환' && (
              <>
                <option value="상품 불량">상품 불량</option>
                <option value="상품 파손">상품 파손</option>
                <option value="상품 구성품 누락">상품 구성품 누락</option>
                <option value="상품이 설명과 다름">상품이 설명과 다름</option>
                <option value="상품 오배송">상품 오배송</option>
              </>
            )}
          </select>
        </section>

        {/* 회수지 정보 - 항상 표시 + 변경하기 버튼 */}
        <section className="flex flex-col gap-2 px-4">
          <div className="flex justify-between items-center">
            <h2 className="text-subtitle-medium">회수지 정보</h2>
            <button className="text-small-medium h-[16px]" style={{ color: 'var(--color-orange)' }}>
              변경하기
            </button>
          </div>
          <div className="flex flex-col gap-[2px] text-sm text-black">
            <p>{dummyDeliveryData.recipient}</p>
            <p>{dummyDeliveryData.phone}</p>
            <p>{dummyDeliveryData.address}</p>
          </div>
          <select
            value={deliveryRequest}
            onChange={(e) => setDeliveryRequest(e.target.value)}
            className="border border-black-3 rounded-md p-2 text-black-4 text-small-medium"
          >
            <option value="">배송 요청사항을 선택해주세요</option>
            <option value="문 앞에 놔주세요">문 앞에 놔주세요</option>
            <option value="직접 전달해주세요">직접 전달해주세요</option>
            <option value="경비실에 맡겨주세요">경비실에 맡겨주세요</option>
            <option value="전화 후 전달해주세요">전화 후 전달해주세요</option>
          </select>
        </section>

        {/* 환불 정보 - 반품일 때만 표시 */}
        {selectedType === '반품' && <RefundInfo refundInfo={dummyRefundInfo} />}
      </main>

      {/* 하단 고정 접수 버튼 */}
      <div className="fixed bottom-0 left-0 right-0 z-10 bg-white border-t border-black-1">
        <Button kind="basic" variant="solid-orange" disabled={!isFormValid} onClick={handleSubmit}>
          접수
        </Button>
      </div>
    </div>
  );
}
