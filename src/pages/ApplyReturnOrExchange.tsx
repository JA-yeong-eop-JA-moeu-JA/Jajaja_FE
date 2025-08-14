import { useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { TOptionBase } from '@/types/optionApply';
import type { IOrderItem } from '@/types/order/orderItem';
import type { TOption } from '@/types/product/option';
import type { TReviewableOrderItem } from '@/types/review/myReview';
import { QUERY_KEYS } from '@/constants/querykeys/queryKeys';

import { axiosInstance } from '@/apis/axiosInstance';

import useOrderDetailPersonal from '@/hooks/order/useOrderDetailPersonal';

import { Button, SelectButton } from '@/components/common/button';
import PageHeader from '@/components/head_bottom/PageHeader';
import ApplyDropDown from '@/components/modal/applyDropDown';
import ConfirmModal from '@/components/modal/confirmModal';
import RefundInfo from '@/components/orderDetail/returnInfo';
import OrderItem from '@/components/review/orderItem';

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

//type TOrderStatus = '배송 중' | '결제 완료' | '결제 취소' | '반품 접수' | '교환 접수';
/*
const toOrderStatusLabel = (items: Array<{ status?: string }>): TOrderStatus => {
  const codes = items.map((i) => (i.status ?? '').toUpperCase());
  if (codes.some((c) => c === 'CANCELED' || c === 'CANCELLED' || c === 'PAYMENT_CANCELED')) return '결제 취소';
  if (codes.some((c) => c === 'RETURN_REQUESTED' || c === 'RETURNING' || c === 'REFUND_REQUESTED')) return '반품 접수';
  if (codes.some((c) => c === 'EXCHANGE_REQUESTED' || c === 'EXCHANGING')) return '교환 접수';
  if (codes.some((c) => c === 'SHIPPING' || c === 'IN_DELIVERY' || c === 'DELIVERING' || c === 'DELIVERED')) return '배송 중';
  return '결제 완료';
};
*/

type TMutationVars = {
  orderId: number;
  orderProductId: number;
  type: TApplyType;
  reason: string;
};

async function submitAfterSales({ orderId, orderProductId, type, reason }: TMutationVars) {
  const path = type === '반품' ? 'returns' : 'exchanges';
  return axiosInstance.post(`/api/orders/${orderId}/${path}`, { orderProductId, reason });
}

export default function ApplyReturnOrExchange() {
  const params = useParams<{ orderId?: string; orderProductId?: string }>();
  const [sp] = useSearchParams();
  const orderIdStr = params.orderId ?? sp.get('orderId') ?? '';
  const orderProductIdStr = params.orderProductId ?? sp.get('orderProductId') ?? '';
  const id = Number(orderIdStr);

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [selectedType, setSelectedType] = useState<TApplyType | null>(null);
  const [selectedReason, setSelectedReason] = useState('');
  const [, setDeliveryRequest] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dropdownKey, setDropdownKey] = useState(0);

  const { data } = useOrderDetailPersonal(id);

  if (!Number.isFinite(id) || id <= 0) {
    return <p className="p-4 text-error-3">유효하지 않은 주문입니다.</p>;
  }
  if (!data) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <PageHeader title="교환/반품 신청" />
        <p className="p-4 text-black-3">주문정보를 불러오는 중입니다...</p>
      </div>
    );
  }

  const { items, delivery, payment } = data;

  const mappedItems: (IOrderItem & { orderProductId: number; orderId: number })[] = items.map((it) => ({
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
  }));

  const selectedOrderItem = mappedItems.find((m) => String(m.orderProductId) === orderProductIdStr) ?? mappedItems[0];

  const isFormValid = selectedType !== null && selectedReason !== '' && !!selectedOrderItem;
  const reasonOptions: TOptionBase[] = selectedType === '반품' ? RETURN_REASONS : EXCHANGE_REASONS;

  type TPaymentMethod = 'NORMAL' | 'BILLING' | 'BRANDPAY';

  const METHOD_LABEL: Record<TPaymentMethod, string> = {
    NORMAL: '일반 결제',
    BILLING: '자동 결제',
    BRANDPAY: '간편결제',
  };
  const refundInfo = {
    amount: selectedOrderItem?.price ?? payment.finalAmount,
    discount: payment.discount,
    pointsUsed: payment.pointUsed,
    deliveryFee: payment.shippingFee,
    method: METHOD_LABEL[payment.method as TPaymentMethod] ?? payment.method,
    reason: selectedReason || '',
    address: delivery.address,
  };

  const toReviewable = (it: IOrderItem, orderDate?: string): TReviewableOrderItem => ({
    orderId: it.orderId,
    orderDate: orderDate ?? (it as any).orderDate ?? '',
    orderProductId: (it as any).orderProductId ?? 0,
    productId: it.productId,
    productName: it.name,
    store: it.company,
    optionName: it.option,
    imageUrl: it.image,
    price: it.price,
    quantity: it.quantity,
    isReviewWritten: it.reviewed,
  });

  const mutation = useMutation({
    mutationFn: submitAfterSales,
    onMutate: async (vars: TMutationVars) => {
      const key = [...QUERY_KEYS.GET_ORDER_DETAIL_PERSONAL, id] as const;
      await queryClient.cancelQueries({ queryKey: key });

      const prev = queryClient.getQueryData(key);

      queryClient.setQueryData(key, (current: any) => {
        const base = current ?? data;
        if (!base || !Array.isArray(base.items)) return base ?? current;
        const nextItems = base.items.map((it: any) =>
          it.orderProductId === vars.orderProductId
            ? {
                ...it,
                status: vars.type === '반품' ? 'RETURN_REQUESTED' : 'EXCHANGE_REQUESTED',
                teamStatus: '',
              }
            : it,
        );
        return { ...base, items: nextItems };
      });

      return { prev, key };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev && ctx?.key) queryClient.setQueryData(ctx.key, ctx.prev);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...QUERY_KEYS.GET_ORDER_DETAIL_PERSONAL, id] });
      queryClient.invalidateQueries({ queryKey: [...QUERY_KEYS.GET_MY_ORDERS] });
    },
  });

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <PageHeader title="교환/반품" />

      <main className="flex flex-col gap-6 pb-24">
        {/* 상품 정보 */}
        <section className="flex flex-col gap-2 py-4 border-b-black-1 border-b-4">
          <div className="px-4">
            <h2 className="text-subtitle-medium pb-4">상품 정보</h2>
            {selectedOrderItem && <OrderItem item={toReviewable(selectedOrderItem)} show={false} />}
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
          {selectedType && (
            <ApplyDropDown
              key={dropdownKey}
              options={reasonOptions as TOption[]}
              onChange={({ id: reasonId }) => {
                const selected = reasonOptions.find((r) => r.id === reasonId);
                if (selected) setSelectedReason(selected.name);
              }}
            />
          )}
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
            onChange={({ id: requestId }) => {
              const selected = DELIVERY_REQUEST_OPTIONS.find((o) => o.id === requestId);
              setDeliveryRequest(selected?.id === 0 ? '' : (selected?.name ?? ''));
            }}
          />
        </section>

        {/* 환불 정보 - 반품일 때만 표시 */}
        {selectedType === '반품' && <RefundInfo refundInfo={refundInfo} />}
      </main>

      {/* 하단 고정 접수 버튼 */}
      <div className="fixed bottom-0 left-0 right-0 z-10 bg-white max-w-screen-sm mx-auto w-full">
        <Button kind="basic" variant="solid-orange" disabled={!isFormValid} onClick={() => setIsModalOpen(true)}>
          접수
        </Button>
      </div>

      <ConfirmModal
        open={isModalOpen}
        message={`${selectedType ?? ''} 신청하시겠어요?`}
        onCancel={() => setIsModalOpen(false)}
        onConfirm={async () => {
          if (!selectedType || !selectedOrderItem) return;

          const vars = {
            orderId: id,
            orderProductId: (selectedOrderItem as any).orderProductId,
            type: selectedType,
            reason: selectedReason,
          };

          try {
            await mutation.mutateAsync(vars); 
            setIsModalOpen(false);
            navigate(selectedType === '반품' ? '/mypage/order/return/complete' : '/mypage/order/exchange/complete');
          } catch (e: any) {
            setIsModalOpen(false);
            if (e?.response?.status === 401) {
              console.error('인증 필요', e?.response?.data);
            } else {
              console.error('신청 실패', e);
            }
          }
        }}
      />
    </div>
  );
}
