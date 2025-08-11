import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import type { TOptionBase } from '@/types/optionApply'; // reasonOptions 타입
import type { TOption } from '@/types/product/option';

import { Button, SelectButton } from '@/components/common/button';
import PageHeader from '@/components/head_bottom/PageHeader';
import ApplyDropDown from '@/components/modal/applyDropDown';
import ConfirmModal from '@/components/modal/confirmModal';
import RefundInfo from '@/components/orderDetail/returnInfo';
import OrderItem from '@/components/review/orderItem';

import useOrderDetailPersonal from '@/hooks/order/useOrderDetailPersonal';
import type { IOrderItem } from '@/types/order/orderItem';

//import { axiosInstance } from '@/apis/axiosInstance';
import { useQueryClient } from '@tanstack/react-query';
//import { useCoreMutation } from '@/hooks/customQuery';
import { QUERY_KEYS } from '@/constants/querykeys/queryKeys';

type TApplyType = '교환' | '반품';

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

type TOrderStatus = '배송 중' | '결제 완료' | '결제 취소' | '반품 접수' | '교환 접수';
const toOrderStatusLabel = (items: Array<{ status?: string }>): TOrderStatus => {
  const codes = items.map((i) => (i.status ?? '').toUpperCase());
  if (codes.some((c) => c === 'CANCELED' || c === 'CANCELLED' || c === 'PAYMENT_CANCELED')) return '결제 취소';
  if (codes.some((c) => c === 'RETURN_REQUESTED' || c === 'RETURNING' || c === 'REFUND_REQUESTED')) return '반품 접수';
  if (codes.some((c) => c === 'EXCHANGE_REQUESTED' || c === 'EXCHANGING')) return '교환 접수';
  if (codes.some((c) => c === 'SHIPPING' || c === 'IN_DELIVERY' || c === 'DELIVERING' || c === 'DELIVERED')) return '배송 중';
  return '결제 완료';
};

export default function ApplyReturnOrExchange() {
  const { orderId, orderProductId } = useParams<{ orderId: string; orderProductId?: string }>();
  const id = Number(orderId);

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [selectedType, setSelectedType] = useState<TApplyType | null>(null);
  const [selectedReason, setSelectedReason] = useState('');
  const [ , setDeliveryRequest] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dropdownKey, setDropdownKey] = useState(0);

  // 주문 상세 API
  const { data } = useOrderDetailPersonal(id);

  // 유효성/로딩
  if (!orderId || Number.isNaN(id)) return <p className="p-4 text-error-3">유효하지 않은 주문입니다.</p>;
  if (!data) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <PageHeader title="교환/반품 신청" />
        <p className="p-4 text-black-3">주문정보를 불러오는 중입니다...</p>
      </div>
    );
  }

  const { items, delivery, payment, orderNumber, date } = data;

  // API → OrderItem 카드용으로 매핑
  const mappedItems: IOrderItem[] = items.map((it) => ({
    orderId: it.orderProductId,
    productId: it.product.id,
    name: it.product.name,
    company: it.product.store,
    option: it.product.option,
    quantity: it.product.quantity,
    image: it.product.image,
    price: it.price,
    reviewed: false,
  }));

  // 특정 주문상품(파라미터 우선)
  const selectedOrderItem =
    mappedItems.find((m) => String(m.orderId) === orderProductId) ?? mappedItems[0];

  // 상단 결제/주문 상태 라벨
  const orderStatus: TOrderStatus = toOrderStatusLabel(items);

  const isFormValid = selectedType !== null && selectedReason !== '' && !!selectedOrderItem;
  const reasonOptions: TOptionBase[] = selectedType === '반품' ? RETURN_REASONS : EXCHANGE_REASONS;

  // 환불 정보(반품 시 표시)
  const refundInfo = {
    amount: selectedOrderItem?.price ?? payment.finalAmount,
    discount: payment.discount,
    pointsUsed: payment.pointUsed,
    deliveryFee: payment.shippingFee,
    method: payment.method === 'KAKAO' ? '카카오페이' : payment.method,
    reason: selectedReason || '',
    address: delivery.address,
  };

  // 캐시 타입 (암시적 any 방지)
  type OrderDetailResult = NonNullable<typeof data>;

  const handleSubmit = (): boolean => {
    if (!selectedType || !selectedOrderItem) return false;

    // 1) 상세 캐시 낙관적 업데이트 (접수 상태 + 팀 매칭 라벨 비우기)
    queryClient.setQueryData<OrderDetailResult>(
      QUERY_KEYS.GET_ORDER_DETAIL_PERSONAL,
      (current: OrderDetailResult | undefined) => {
        if (!current) return current;

        const nextItems = current.items.map((it) =>
          it.orderProductId === selectedOrderItem.orderId
            ? {
                ...it,
                status: selectedType === '반품' ? 'RETURN_REQUESTED' : 'EXCHANGE_REQUESTED',
                teamStatus: '', // 매칭 상태 숨김 (CSS 자리 유지용)
              }
            : it
        );

        return { ...current, items: nextItems };
      }
    );

    // 2) 완료 페이지 이동 (네가 준 라우트에 맞춤)
    if (selectedType === '반품') {
      navigate('/mypage/order/return/complete');
    } else {
      navigate('/mypage/order/exchange/complete');
    }
    return true;
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <PageHeader title="교환/반품 신청" />

      <main className="flex flex-col gap-6 pb-24">
        {/* 헤더(주문일/번호/상태) */}
        <section className="px-4 pt-2">
          <p className="text-small text-black-4">
            {new Date(date).toLocaleString('ko-KR')} · 주문번호 {orderNumber} · {orderStatus}
          </p>
        </section>

        {/* 상품 정보 */}
        <section className="flex flex-col gap-2 py-6 border-b-black-1 border-b-4">
          <div className="px-4">
            <h2 className="text-subtitle-medium pb-4">상품 정보</h2>
            {selectedOrderItem && <OrderItem item={selectedOrderItem} show={false} />}
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

        {/* 사유 */}
        <section className="flex flex-col gap-2 px-4 pb-8 border-b border-b-black-1 border-b-4">
          <h2 className="text-subtitle-medium pb-2">사유</h2>
          <ApplyDropDown
            key={dropdownKey}
            options={reasonOptions as TOption[]}
            onChange={({ id }) => {
              const selected = reasonOptions.find((r) => r.id === id);
              if (selected) setSelectedReason(selected.name);
            }}
          />
        </section>

        {/* 회수지 정보 + 요청사항 */}
        <section className="flex flex-col gap-2 px-4">
          <div className="flex justify-between items-center">
            <h2 className="text-subtitle-medium">회수지 정보</h2>
            <button className="text-small-medium h-[16px] text-orange">변경하기</button>
          </div>
          <div className="flex flex-col gap-[2px] text-body-regular text-black">
            <p>{delivery.name}</p>
            <p>{delivery.phone}</p>
            <p>{delivery.address}</p>
          </div>
          <ApplyDropDown
            options={DELIVERY_REQUEST_OPTIONS as TOption[]}
            onChange={({ id }) => {
              const selected = DELIVERY_REQUEST_OPTIONS.find((o) => o.id === id);
              setDeliveryRequest(selected?.id === 0 ? '' : (selected?.name ?? ''));
            }}
          />
        </section>

        {/* 환불 정보 - 반품일 때만 표시 */}
        {selectedType === '반품' && <RefundInfo refundInfo={refundInfo} />}
      </main>

      {/* 하단 고정 접수 버튼 */}
      <div className="fixed bottom-0 left-0 right-0 z-10 bg-white max-w-screen-sm mx-auto w-full">
        <Button
          kind="basic"
          variant="solid-orange"
          disabled={!isFormValid}
          onClick={() => setIsModalOpen(true)}
        >
          접수
        </Button>
      </div>

      {/* 확인 모달 */}
      <ConfirmModal
        open={isModalOpen}
        message={`${selectedType ?? ''} 신청하시겠어요?`}
        onCancel={() => setIsModalOpen(false)}
        onConfirm={() => {
          const ok = handleSubmit();
          setIsModalOpen(false);
          if (!ok) navigate('/not-found');
        }}
      />
    </div>
  );
}
