import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import type { TPaymentRequestData } from '@/types/toss/tossPayments';

import { calculateFinalAmount, formatPhoneNumber, generateCustomerKey, generateOrderId } from '@/utils/paymentUtils';

import { useModalStore } from '@/stores/modalStore';
import { usePaymentWidget } from '@/hooks/payment/usePaymentWidget';

import { Button } from '@/components/common/button';
import PageHeader from '@/components/head_bottom/PageHeader';
import OrderItem from '@/components/review/orderItem';

import Down from '@/assets/icons/down.svg?react';
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

  // 결제 관련 상태
  const [selectedDeliveryRequest, setSelectedDeliveryRequest] = useState<string>('');
  const [usedPoints, setUsedPoints] = useState<number>(0);
  const [userPoints] = useState<number>(1382);

  // 결제 금액 계산
  const originalAmount = 123122;
  const discount = 1239;
  const shippingFee = 0;
  const finalAmount = calculateFinalAmount(originalAmount, discount, usedPoints, shippingFee);

  // 고객키 생성 (실제로는 로그인한 사용자 ID를 사용)
  const customerKey = generateCustomerKey('user123'); // 실제 사용자 ID로 변경

  // 결제위젯 훅 사용
  const {
    paymentWidget,
    isLoading: widgetLoading,
    error: widgetError,
    renderPaymentMethods,
    renderAgreement,
    requestPayment,
  } = usePaymentWidget({
    customerKey,
    amount: finalAmount,
  });

  // 결제위젯 렌더링
  useEffect(() => {
    if (!widgetLoading && paymentWidget) {
      // DOM이 준비된 후 약간의 지연을 두고 렌더링
      const timer = setTimeout(() => {
        console.log('🎨 결제위젯 렌더링 시작...');

        // 결제 수단 렌더링
        const paymentMethodsElement = document.querySelector('#payment-methods');
        const agreementElement = document.querySelector('#payment-agreement');

        console.log('📍 결제 수단 요소:', paymentMethodsElement);
        console.log('📍 약관 요소:', agreementElement);

        if (paymentMethodsElement) {
          renderPaymentMethods('#payment-methods');
        } else {
          console.error('❌ #payment-methods 요소를 찾을 수 없습니다.');
        }

        if (agreementElement) {
          renderAgreement('#payment-agreement');
        } else {
          console.error('❌ #payment-agreement 요소를 찾을 수 없습니다.');
        }
      }, 100); // 100ms 지연

      return () => clearTimeout(timer);
    }
  }, [widgetLoading, paymentWidget, renderPaymentMethods, renderAgreement]);

  const handlePointsChange = (value: number) => {
    if (value > userPoints) {
      setUsedPoints(userPoints);
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

  const handlePayment = async () => {
    if (!paymentWidget) {
      alert('결제 시스템을 초기화하고 있습니다. 잠시 후 다시 시도해주세요.');
      return;
    }

    if (finalAmount <= 0) {
      alert('결제 금액이 올바르지 않습니다.');
      return;
    }

    try {
      const orderId = generateOrderId();
      const baseUrl = window.location.origin;

      await requestPayment({
        orderId,
        orderName: `${currentOrderItems[0]?.productName || '상품'} 외 ${currentOrderItems.length - 1}건`,
        customerEmail: 'customer@example.com', // 실제 고객 이메일로 변경
        customerName: '이한비', // 실제 고객명으로 변경
        customerMobilePhone: formatPhoneNumber('010-2812-1241'), // 실제 휴대폰 번호로 변경
        successUrl: `${baseUrl}/payment/success`,
        failUrl: `${baseUrl}/payment/fail`,
      } as TPaymentRequestData);
    } catch (error) {
      console.error('결제 요청 실패:', error);
      alert('결제 요청 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
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

  function PaymentSummarySection({ total, discount: discountAmount, pointsUsed, shippingFee: shipping, finalAmount: final }: IPaymentSummaryProps) {
    return (
      <section className="p-4">
        <p className="text-subtitle-medium py-3 mb-1">결제 금액</p>
        <div className="flex justify-between text-small-medium mb-2">
          <p>결제 금액</p>
          <p>{total.toLocaleString()} 원</p>
        </div>
        <div className="flex justify-between text-small-medium mb-2">
          <p>할인 금액</p>
          <p className="text-green">-{discountAmount.toLocaleString()} 원</p>
        </div>
        <div className="flex justify-between text-small-medium mb-2">
          <p>적립금 사용</p>
          <p className="text-green">-{pointsUsed.toLocaleString()} 원</p>
        </div>
        <div className="flex justify-between text-small-medium mb-3">
          <p>배송비</p>
          <p className="text-green">{shipping === 0 ? '무료' : `${shipping.toLocaleString()} 원`}</p>
        </div>
        <div className="flex justify-between border-t-1 border-black-1 text-base text-body-regular pt-3 pb-10">
          <p>총 결제 금액</p>
          <p>{final.toLocaleString()} 원</p>
        </div>
      </section>
    );
  }

  // 로딩 상태 표시
  if (widgetLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange mx-auto mb-4" />
          <p className="text-body-regular">결제 시스템을 초기화하고 있습니다...</p>
        </div>
      </div>
    );
  }

  // 에러 상태 표시
  if (widgetError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center p-4">
          <p className="text-red-500 mb-4">결제 시스템 초기화 중 오류가 발생했습니다.</p>
          <p className="text-small-regular text-gray-600 mb-4">{widgetError}</p>
          <Button kind="basic" variant="solid-orange" onClick={() => window.location.reload()}>
            새로고침
          </Button>
        </div>
      </div>
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
            <OrderItem item={item} show={false} />
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
          <p className="text-small-medium text-black-4">보유 포인트: {userPoints.toLocaleString()} 원</p>
        </div>
      </section>

      {/* 토스페이먼츠 결제 수단 위젯 */}
      <section className="p-4 border-b-4 border-black-1">
        <p className="text-subtitle-medium py-3 mb-4">결제 수단</p>
        <div id="payment-methods" className="min-h-[200px]">
          {/* 토스페이먼츠 결제위젯이 여기에 렌더링됩니다 */}
        </div>
      </section>

      <PaymentSummarySection total={originalAmount} discount={discount} pointsUsed={usedPoints} shippingFee={shippingFee} finalAmount={finalAmount} />

      {/* 토스페이먼츠 약관 위젯 */}
      <section className="p-4 bg-black-0">
        <div id="payment-agreement" className="min-h-[100px]">
          {/* 토스페이먼츠 약관위젯이 여기에 렌더링됩니다 */}
        </div>
      </section>

      <div className="fixed bottom-14 left-0 right-0 w-full max-w-[600px] mx-auto">
        <Button kind="basic" variant="solid-orange" disabled={finalAmount <= 0} onClick={handlePayment} className="w-full">
          {finalAmount.toLocaleString()}원 결제하기
        </Button>
      </div>
    </>
  );
}
