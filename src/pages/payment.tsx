import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import type { IAddress } from '@/types/address/TAddress';
import type { TPaymentData } from '@/types/cart/TCart';
import type { TCoupons } from '@/types/coupon/TGetCoupons';
import type { TPaymentRequestData } from '@/types/toss/tossPayments';

import { calculateFinalAmount, formatPhoneNumber, generateCustomerKey } from '@/utils/paymentUtils';

import { useModalStore } from '@/stores/modalStore';
import { useGetAddresses } from '@/hooks/address/useAddress';
import { useAppliedCoupon } from '@/hooks/coupon/useCoupons';
import useUserInfo from '@/hooks/myPage/useUserInfo';
import { usePaymentPrepare } from '@/hooks/payment/usePaymentPrepare';
import { usePaymentWidget } from '@/hooks/payment/usePaymentWidget';
import useInfinitePoints from '@/hooks/points/useInfinitePoints';

import { Button } from '@/components/common/button';
import PageHeader from '@/components/head_bottom/PageHeader';

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
  const location = useLocation();
  const { openModal } = useModalStore();

  const paymentData = location.state as TPaymentData;
  const currentOrderItems = paymentData?.selectedItems || orderData[0].items;

  const [selectedAddress, setSelectedAddress] = useState<IAddress | null>(null);
  const [selectedDeliveryRequest, setSelectedDeliveryRequest] = useState<string>('');
  const [usedPoints, setUsedPoints] = useState<number>(0);
  const [isProcessingPayment, setIsProcessingPayment] = useState<boolean>(false);

  const { data: userInfo, isLoading: userLoading } = useUserInfo();
  const { data: addressesData, isLoading: addressesLoading } = useGetAddresses();
  const { data: pointsData, isLoading: pointsLoading } = useInfinitePoints();
  const { getAppliedCoupon, calculateDiscount } = useAppliedCoupon();
  const paymentPrepareMutation = usePaymentPrepare();

  const user = userInfo?.result;
  const userPoints = pointsData?.pages[0]?.result?.pointBalance ?? 0;
  const addresses: IAddress[] = Array.isArray(addressesData) ? addressesData : [];
  const appliedCoupon: TCoupons | null = getAppliedCoupon();

  useEffect(() => {
    if (location.state?.selectedAddress) {
      setSelectedAddress(location.state.selectedAddress);
    } else if (location.state?.updatedAddressId && addresses.length > 0) {
      const updatedAddress = addresses.find((addr: IAddress) => addr.id === location.state.updatedAddressId);
      if (updatedAddress) {
        setSelectedAddress(updatedAddress);
      }
    } else if (addresses.length > 0 && !selectedAddress) {
      const defaultAddr = addresses.find((addr: IAddress) => addr.isDefault) || addresses[0];
      setSelectedAddress(defaultAddr);
    }
  }, [addresses, location.state, selectedAddress]);

  const calculateAmount = () => {
    if (!paymentData?.selectedItems) return 123122;

    return paymentData.selectedItems.reduce((acc, item) => {
      const price = paymentData.orderType === 'individual' ? item.individualPrice || item.unitPrice : item.teamPrice || item.unitPrice;
      return acc + price * item.quantity;
    }, 0);
  };

  const originalAmount = calculateAmount();
  const couponDiscount = calculateDiscount(originalAmount, appliedCoupon || undefined);
  const shippingFee = 0;
  const finalAmount = calculateFinalAmount(originalAmount, couponDiscount, usedPoints, shippingFee);

  const customerKey = generateCustomerKey(user?.id?.toString() || 'anonymous');

  const {
    paymentWidget,
    isLoading: widgetLoading,
    renderPaymentMethods,
    renderAgreement,
    requestPayment,
  } = usePaymentWidget({
    customerKey,
    amount: finalAmount,
  });

  useEffect(() => {
    if (!widgetLoading && paymentWidget && finalAmount > 0 && user) {
      const timer = setTimeout(() => {
        const paymentMethodsElement = document.querySelector('#payment-methods');
        const agreementElement = document.querySelector('#payment-agreement');

        if (paymentMethodsElement) {
          paymentMethodsElement.innerHTML = '';
          renderPaymentMethods('#payment-methods');
        }

        if (agreementElement) {
          agreementElement.innerHTML = '';
          renderAgreement('#payment-agreement');
        }
      }, 100);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [widgetLoading, paymentWidget, renderPaymentMethods, renderAgreement, finalAmount, user]);

  const handlePointsChange = (value: number) => {
    const numValue = Number(value) || 0;

    if (numValue > userPoints) {
      setUsedPoints(userPoints);
      alert(`사용 가능한 포인트는 최대 ${userPoints.toLocaleString()}원입니다.`);
    } else if (numValue < 0) {
      setUsedPoints(0);
    } else {
      setUsedPoints(numValue);
    }
  };

  const handleDeliveryRequestClick = () => {
    openModal('delivery', {
      onSelect: (text: string) => setSelectedDeliveryRequest(text),
    });
  };

  const handleAddressChangeClick = () => {
    navigate('/address/change', {
      state: {
        returnPath: '/payment',
        paymentData,
        selectedAddress,
      },
    });
  };

  const handlePayment = async () => {
    if (!user) {
      alert('사용자 정보를 불러오는 중입니다. 잠시 후 다시 시도해주세요.');
      return;
    }

    if (!selectedAddress) {
      alert('배송지를 선택해주세요.');
      return;
    }

    if (!paymentWidget) {
      alert('결제 시스템을 초기화하고 있습니다. 잠시 후 다시 시도해주세요.');
      return;
    }

    if (finalAmount <= 0) {
      alert('결제 금액이 올바르지 않습니다.');
      return;
    }

    if (isProcessingPayment) {
      return;
    }

    setIsProcessingPayment(true);

    try {
      const prepareData = {
        items: paymentData?.selectedItems.map((item) => item.id) || [1, 2, 3],
        addressId: selectedAddress?.id || 1,
        deliveryRequest: selectedDeliveryRequest || '현관문 앞에 놓아주세요.',
        appliedCouponId: appliedCoupon?.couponId || 0,
        point: usedPoints,
        orderType: paymentData?.orderType === 'individual' ? 'PERSONAL' : 'TEAM',
        ...(paymentData?.teamId && { teamId: paymentData.teamId }),
      };

      const prepareResult = await paymentPrepareMutation.mutateAsync(prepareData);

      if (!prepareResult.isSuccess) {
        throw new Error(prepareResult.message || '결제 준비에 실패했습니다.');
      }

      const { orderId, orderName, finalAmount: preparedAmount } = prepareResult.data;

      await paymentWidget.setAmount({
        currency: 'KRW',
        value: preparedAmount,
      });

      const baseUrl = window.location.origin;

      await requestPayment({
        orderId: orderId.toString(),
        orderName,
        customerEmail: user.email,
        customerName: user.name,
        customerMobilePhone: formatPhoneNumber(user.phone),
        successUrl: `${baseUrl}/payment/success`,
        failUrl: `${baseUrl}/payment/fail`,
      } as TPaymentRequestData);
    } catch (error) {
      let errorMessage = '결제 처리 중 오류가 발생했습니다.';

      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any;

        if (axiosError.response?.data?.code) {
          switch (axiosError.response.data.code) {
            case 'POINT4002':
              errorMessage = '사용 가능한 포인트를 초과했습니다. 포인트를 확인해주세요.';
              setUsedPoints(0);
              break;
            case 'COUPON4003':
              errorMessage = '선택한 쿠폰을 사용할 수 없습니다.\n쿠폰이 만료되었거나 이미 사용되었을 수 있습니다.\n쿠폰을 다시 선택해주세요.';
              break;
            case 'COUPON_INVALID':
              errorMessage = '선택한 쿠폰을 사용할 수 없습니다.';
              break;
            case 'ADDRESS_NOT_FOUND':
              errorMessage = '배송지 정보를 확인할 수 없습니다.';
              break;
            case 'ITEM_NOT_AVAILABLE':
              errorMessage = '주문하신 상품이 품절되었습니다.';
              break;
            default:
              errorMessage = axiosError.response.data.message || errorMessage;
          }
        } else if (axiosError.response?.data?.message) {
          errorMessage = axiosError.response.data.message;
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      alert(errorMessage + ' 다시 시도해주세요.');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  function AddressSection({ name, phone, address }: IAddressBlockProps) {
    return (
      <section className="p-4">
        <div className="flex justify-between items-center mb-2">
          <p className="text-subtitle-medium">배송지</p>
          <button className="text-orange text-small-medium" onClick={handleAddressChangeClick}>
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

  if (userLoading || addressesLoading || pointsLoading) {
    return (
      <>
        <PageHeader title="주문 결제" />
        <div className="flex justify-center items-center h-64">
          <p>결제 정보를 불러오는 중...</p>
        </div>
      </>
    );
  }

  if (!user) {
    return (
      <>
        <PageHeader title="주문 결제" />
        <div className="flex justify-center items-center h-64">
          <p>사용자 정보를 불러올 수 없습니다.</p>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader title="주문 결제" />

      <section className="border-b-4 border-black-1">
        <div className="w-full">
          {selectedAddress ? (
            <AddressSection
              name={selectedAddress.name}
              phone={selectedAddress.phone}
              address={`${selectedAddress.address} ${selectedAddress.addressDetail}`.trim()}
            />
          ) : (
            <div className="p-4">
              <div className="flex justify-between items-center mb-2">
                <p className="text-subtitle-medium">배송지</p>
                <button className="text-orange text-small-medium" onClick={handleAddressChangeClick}>
                  변경하기
                </button>
              </div>
              <div className="text-center py-8">
                <p className="text-body-regular text-black-4 mb-4">등록된 배송지가 없습니다</p>
                <Button kind="basic" variant="solid-orange" onClick={() => navigate('/address/add')} className="px-6 py-2">
                  배송지 추가
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>

      {paymentData?.orderType !== 'individual' && (
        <section className="p-4 border-b-4 border-black-1">
          <p className="text-subtitle-medium mb-4">팀 구매 정보</p>
          <div className="bg-orange-50 p-3 rounded">
            {paymentData.orderType === 'team_create' && (
              <>
                <p className="text-small-medium">팀을 생성하고 있습니다</p>
                <p className="text-small-regular">결제 완료 후 30분간 팀원 모집이 시작됩니다</p>
              </>
            )}
            {paymentData.orderType === 'team_join' && (
              <>
                <p className="text-small-medium">팀 구매에 참여합니다</p>
                <p className="text-small-regular">팀 구매가로 할인받으세요!</p>
              </>
            )}
          </div>
        </section>
      )}

      <section className="p-4 border-b-4 border-black-1">
        <p className="text-subtitle-medium mb-4">주문 상품 {currentOrderItems.length}개</p>
        {currentOrderItems.map((item, index) => (
          <div key={`order-item-${item.productId || 'unknown'}-${index}`} className="mb-5">
            {/* <OrderItem item={item} show={false} /> */}
          </div>
        ))}
      </section>

      <section className="p-4 mt-3 border-b-4 border-black-1">
        <p className="text-subtitle-medium mb-4">할인 혜택</p>
        <div className="flex justify-between items-center border-1 border-black-3 rounded px-4 py-3 mb-3" onClick={() => navigate('/coupon')}>
          <p className="text-body-medium">쿠폰</p>
          <div className="flex items-center gap-3">
            <p className="text-body-regular">{appliedCoupon ? `${appliedCoupon.couponName} 적용` : '사용 가능한 쿠폰 선택'}</p>
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

      <section className="border-b-4 border-black-1">
        <div id="payment-methods" className="min-h-[200px]" />
      </section>

      <PaymentSummarySection total={originalAmount} discount={couponDiscount} pointsUsed={usedPoints} shippingFee={shippingFee} finalAmount={finalAmount} />

      <AgreementNoticeSection />

      <div className="fixed bottom-14 left-0 right-0 w-full max-w-[600px] mx-auto">
        <Button
          kind="basic"
          variant="solid-orange"
          disabled={finalAmount <= 0 || isProcessingPayment || paymentPrepareMutation.isPending || !selectedAddress}
          onClick={handlePayment}
          className="w-full"
        >
          {isProcessingPayment || paymentPrepareMutation.isPending ? '결제 처리 중...' : `${finalAmount.toLocaleString()}원 결제하기`}
        </Button>
      </div>
    </>
  );
}
