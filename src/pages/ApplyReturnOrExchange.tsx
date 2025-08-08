import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import type { TOptionBase } from '@/types/optionApply'; // reasonOptions 타입
import type { TOption } from '@/types/product/option';

import { Button, SelectButton } from '@/components/common/button';
import PageHeader from '@/components/head_bottom/PageHeader';
import ConfirmModal from '@/components/modal/confirmModal';
import ApplyDropDown from '@/components/modal/applyDropDown';
import RefundInfo from '@/components/orderDetail/returnInfo';
import OrderItem from '@/components/review/orderItem';

import { orderData } from '@/mocks/orderData';

export default function ApplyReturnOrExchange() {
  const order = orderData[0];
  const item = order.items[0];

  const dummyDeliveryData = {
    recipient: '이한비',
    phone: '010-2812-1241',
    address: '서울특별시 강서구 낙성서로12번길 3-12',
  };

  const dummyRefundInfo = {
    amount: 23920,
    discount: 1239,
    pointsUsed: 324,
    deliveryFee: 0,
    method: '카카오페이',
    reason: '고객 단순 변심',
    address: '서울특별시 강서구 낙성서로12번길 3-12',
  };

  const RETURN_REASONS = [
    { id: 1, name: '고객 단순 변심' },
    { id: 2, name: '상품 불량' },
    { id: 3, name: '상품 파손' },
    { id: 4, name: '상품 구성품 누락' },
    { id: 5, name: '상품이 설명과 다름' },
    { id: 6, name: '상품 오배송' },
  ];

  const EXCHANGE_REASONS = [
    { id: 2, name: '상품 불량' },
    { id: 3, name: '상품 파손' },
    { id: 4, name: '상품 구성품 누락' },
    { id: 5, name: '상품이 설명과 다름' },
    { id: 6, name: '상품 오배송' },
  ];

  const DELIVERY_REQUEST_OPTIONS = [
    { id: 1, name: '문 앞에 놔주세요' },
    { id: 2, name: '직접 전달해주세요' },
    { id: 3, name: '경비실에 맡겨주세요' },
    { id: 4, name: '전화 후 전달해주세요' },
  ];

  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState<'교환' | '반품' | null>(null);
  const [selectedReason, setSelectedReason] = useState('');
  const [, setDeliveryRequest] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dropdownKey, setDropdownKey] = useState(0);

  const isFormValid = selectedType !== null && selectedReason !== '';
  const reasonOptions: TOptionBase[] = selectedType === '반품' ? RETURN_REASONS : EXCHANGE_REASONS;

  const handleSubmit = async (): Promise<boolean> => {
    try {
      console.log(`${selectedType} 신청 완료`);
      // TODO: 실제 API 요청이 들어간다면 이곳에 작성
      return true;
    } catch (err) {
      console.error('신청 실패', err);
      return false;
    }
  };
  {
    /** Api 연동 시
      import axios from 'axios';

  const handleSubmit = async (): Promise<boolean> => {
    try {
      const response = await axios.post('/api/exchange-or-return', {
        type: selectedType,
        // 다른 필요한 데이터들 함께 전송
      });

      return response.status === 200;
    } catch (err) {
      console.error('신청 실패', err);
      return false;
    }
  };

    */
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <PageHeader title="교환/반품 신청" />

      <main className="flex flex-col gap-6 pb-24">
        {/* 상품 정보 */}
        <section className="flex flex-col gap-2 py-6 border-b-black-1 border-b-4">
          <div className="px-4">
            <h2 className="text-subtitle-medium pb-4">상품 정보</h2>
            <OrderItem item={item} show={false} />
          </div>
        </section>

        {/* 해결 방법 */}
        <section className="flex flex-col text-body-regular gap-2">
          <h2 className="text-subtitle-medium px-4">해결 방법</h2>
          <div className="h-14">
            <SelectButton
              kind="select-content"
              leftText="교환"
              rightText="반품"
              leftVariant={selectedType === '교환' ? 'outline-orange' : 'outline-gray'}
              rightVariant={selectedType === '반품' ? 'outline-orange' : 'outline-gray'}
              onLeftClick={() => {
                setSelectedType('교환');
                setDropdownKey((prev) => prev + 1);
              }}
              onRightClick={() => {
                setSelectedType('반품');
                setDropdownKey((prev) => prev + 1);
              }}
            />
          </div>
        </section>

        <section className="flex flex-col gap-2 px-4 pb-8 border-b border-b-black-1 border-b-4">
          <h2 className="text-subtitle-medium pb-2">사유</h2>
          <ApplyDropDown
            key={dropdownKey}
            options={reasonOptions as TOption[]}
            onChange={({ id }) => {
              const selected = reasonOptions.find((reason) => reason.id === id);
              if (selected) {
                setSelectedReason(selected.name);
              }
            }}
            defaultLabel="사유 선택"
          />
        </section>

        {/* 회수지 정보 - 항상 표시 + 변경하기 버튼 */}
        <section className="flex flex-col gap-2 px-4">
          <div className="flex justify-between items-center">
            <h2 className="text-subtitle-medium">회수지 정보</h2>

            <button className="text-small-medium h-[16px] text-orange">변경하기</button>
          </div>
          <div className="flex flex-col gap-[2px] text-body-regular text-black">
            <p>{dummyDeliveryData.recipient}</p>
            <p>{dummyDeliveryData.phone}</p>
            <p>{dummyDeliveryData.address}</p>
          </div>
          <ApplyDropDown
            options={DELIVERY_REQUEST_OPTIONS as TOption[]}
            onChange={({ id }) => {
              const selected = DELIVERY_REQUEST_OPTIONS.find((option) => option.id === id);
              setDeliveryRequest(selected?.id === 0 ? '' : (selected?.name ?? ''));
            }}
            defaultLabel="배송 요청사항을 선택해주세요"
          />
        </section>

        {/* 환불 정보 - 반품일 때만 표시 */}
        {selectedType === '반품' && <RefundInfo refundInfo={dummyRefundInfo} />}
      </main>

      {/* 하단 고정 접수 버튼 */}
      <div className="fixed bottom-0 left-0 right-0 z-10 bg-white max-w-screen-sm mx-auto w-full">
        <Button
          kind="basic"
          variant="solid-orange"
          disabled={!isFormValid}
          onClick={() => {
            setIsModalOpen(true);
          }}
        >
          접수
        </Button>
      </div>

      <ConfirmModal
        open={isModalOpen}
        message={`${selectedType} 신청하시겠어요?`}
        onCancel={() => setIsModalOpen(false)}
        onConfirm={async () => {
          const isSuccess = await handleSubmit();
          setIsModalOpen(false);

          if (!isSuccess) {
            navigate('/not-found');
            return;
          }

          if (selectedType === '교환') {
            navigate('/exchange/complete');
          } else if (selectedType === '반품') {
            navigate('/return/complete');
          }
        }}
      />
    </div>
  );
}
