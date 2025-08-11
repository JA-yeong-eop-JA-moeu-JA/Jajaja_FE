import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import type { IAddress } from '@/types/address/TAddress';
import type { TCoupons } from '@/types/coupon/TGetCoupons';

import { useModalStore } from '@/stores/modalStore';
import { useGetAddresses } from '@/hooks/address/useAddress';
import { useAppliedCoupon, useCancelCoupon } from '@/hooks/coupon/useCoupons';

import { Button } from '@/components/common/button';
import PageHeader from '@/components/head_bottom/PageHeader';

import Down from '@/assets/icons/down.svg?react';
import KakaoPayIcon from '@/assets/icons/kakaopay.svg?react';
import NaverPayIcon from '@/assets/icons/naverpay.svg?react';
import { orderData } from '@/mocks/orderData';

interface IAddressBlockProps {
  name?: string;
  phone?: string;
  address?: string;
  addressDetail?: string;
  hasAddress: boolean;
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

  const { data: addressesResponse, isLoading: addressesLoading } = useGetAddresses();
  const addresses = (addressesResponse as any)?.data?.result || [];

  const { getAppliedCoupon, calculateDiscount, isApplicable, isExpired, clearAppliedCoupon } = useAppliedCoupon();
  const { mutate: cancelCoupon } = useCancelCoupon();

  const [selectedAddress, setSelectedAddress] = useState<IAddress | null>(null);
  const [appliedCoupon, setAppliedCoupon] = useState<TCoupons | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<'naver' | 'kakao' | null>(null);
  const [selectedDeliveryRequest, setSelectedDeliveryRequest] = useState<string>('');
  const [usedPoints, setUsedPoints] = useState<number>(0);
  const [userPoints] = useState<number>(1382);

  // 기본 주문 금액 (Todo: 장바구니 연동 후 수정)
  const baseOrderAmount = 123122;

  useEffect(() => {
    if (location.state?.selectedAddress) {
      setSelectedAddress(location.state.selectedAddress);
    } else if (addresses.length > 0 && !selectedAddress) {
      const defaultAddr = addresses.find((addr: IAddress) => addr.isDefault) || addresses[0];
      setSelectedAddress(defaultAddr);
    }
  }, [addresses, location.state, selectedAddress]);

  useEffect(() => {
    const coupon = getAppliedCoupon();
    setAppliedCoupon(coupon);
  }, []);

  const currentOrderItems = orderData[0].items;

  // 쿠폰 할인 금액 계산
  const couponDiscount = useMemo(() => {
    if (!appliedCoupon) return 0;
    return calculateDiscount(baseOrderAmount, appliedCoupon);
  }, [appliedCoupon, baseOrderAmount, calculateDiscount]);

  // 쿠폰 적용 가능 여부
  const isCouponApplicable = useMemo(() => {
    if (!appliedCoupon) return true;
    return isApplicable(baseOrderAmount, appliedCoupon) && !isExpired(appliedCoupon);
  }, [appliedCoupon, baseOrderAmount, isApplicable, isExpired]);

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

  const handleCouponClick = () => {
    navigate('/coupon');
  };

  const handleRemoveCoupon = () => {
    if (!appliedCoupon) return;

    cancelCoupon(
      { id: appliedCoupon.couponId },
      {
        onSuccess: () => {
          setAppliedCoupon(null);
          clearAppliedCoupon();
        },
        onError: (err) => {
          console.error('쿠폰 해제 실패:', err);
          alert('쿠폰 해제에 실패했습니다. 다시 시도해주세요.');
        },
      },
    );
  };

  const canProceedPayment = useMemo(() => {
    return selectedAddress && selectedPayment;
  }, [selectedAddress, selectedPayment]);

  function AddressSection({ name, phone, address, addressDetail, hasAddress }: IAddressBlockProps) {
    if (addressesLoading) {
      return (
        <section className="p-4">
          <div className="flex justify-between items-center mb-2">
            <p className="text-subtitle-medium">배송지</p>
          </div>
          <p className="text-body-regular text-gray-500">배송지 정보를 불러오는 중...</p>
        </section>
      );
    }

    if (!hasAddress) {
      return (
        <section className="">
          <div className="flex justify-between items-center mb-2">
            <p className="px-4 py-3 mb-1 text-subtitle-medium">배송지</p>
          </div>
          <div className="mb-7">
            <Button kind="basic" variant="outline-gray" className="w-full" onClick={() => navigate('/address/change')}>
              + 배송지 추가
            </Button>
          </div>
        </section>
      );
    }

    return (
      <section className="p-4">
        <div className="flex justify-between items-center mb-2">
          <p className="text-subtitle-medium">배송지</p>
          <button className="text-orange text-small-medium" onClick={() => navigate('/address/change')}>
            변경하기
          </button>
        </div>
        <div className="mb-2">
          <p className="text-body-regular font-medium">{name}</p>
          <p className="text-body-regular text-gray-600">{phone}</p>
          <p className="text-body-regular text-gray-600">
            {address} {addressDetail}
          </p>
        </div>
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
          <p>쿠폰 할인</p>
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

  // 최종 결제 금액 계산
  const calculatedFinalAmount = useMemo(() => {
    const shippingFee = 0;
    const actualCouponDiscount = isCouponApplicable ? couponDiscount : 0;
    return baseOrderAmount - actualCouponDiscount - usedPoints + shippingFee;
  }, [baseOrderAmount, couponDiscount, isCouponApplicable, usedPoints]);

  return (
    <>
      <PageHeader title="주문 결제" />

      <section className="border-b-4 border-black-1">
        <div className="w-full">
          <AddressSection
            name={selectedAddress?.name}
            phone={selectedAddress?.phone}
            address={selectedAddress?.address}
            addressDetail={selectedAddress?.addressDetail}
            hasAddress={!!selectedAddress}
          />
        </div>
      </section>

      <section className="p-4 border-b-4 border-black-1">
        <p className="text-subtitle-medium mb-4">주문 상품 {currentOrderItems.length}개</p>
        {currentOrderItems.map((item) => (
          <div key={item.productId} className="mb-5">
            {/* <OrderItem item={item} show={false} /> */}
          </div>
        ))}
      </section>

      <section className="p-4 mt-3 border-b-4 border-black-1">
        <p className="text-subtitle-medium mb-4">할인 혜택</p>

        <div className="mb-3">
          <div className="flex justify-between items-center border-1 border-black-3 rounded px-4 py-3 mb-2" onClick={handleCouponClick}>
            <p className="text-body-medium">쿠폰</p>
            <div className="flex items-center gap-3">
              <Down className="w-4 h-2 mr-1" />
            </div>
          </div>

          {appliedCoupon && (
            <div className={`border rounded-lg p-3 mb-2 ${!isCouponApplicable ? 'border-red-500 bg-red-50' : 'border-green bg-green-50'}`}>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-body-medium text-black font-semibold">{appliedCoupon.couponName}</p>
                  <p className="text-body-small text-black-4">
                    {appliedCoupon.discountType === 'PERCENTAGE'
                      ? `${appliedCoupon.discountValue}% 할인`
                      : `${appliedCoupon.discountValue.toLocaleString()}원 할인`}
                  </p>
                  <p className="text-body-small text-black-4">할인 금액: {isCouponApplicable ? couponDiscount.toLocaleString() : 0}원</p>
                </div>
                <button onClick={handleRemoveCoupon} className="text-body-small text-red-500 underline">
                  해제
                </button>
              </div>

              {!isCouponApplicable && (
                <p className="text-body-small text-error-3 mt-2">{isExpired(appliedCoupon) ? '만료된 쿠폰입니다.' : '최소 주문 금액을 충족하지 않습니다.'}</p>
              )}
            </div>
          )}
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

      <PaymentSummarySection
        total={baseOrderAmount}
        discount={isCouponApplicable ? couponDiscount : 0}
        pointsUsed={usedPoints}
        shippingFee={0}
        finalAmount={calculatedFinalAmount}
      />

      <AgreementNoticeSection />

      <div className="fixed bottom-14 left-0 right-0 w-full max-w-[600px] mx-auto">
        <Button kind="basic" variant="solid-orange" disabled={!canProceedPayment} onClick={() => navigate('/결제')} className="w-full">
          {calculatedFinalAmount.toLocaleString()}원 결제하기
        </Button>
      </div>
    </>
  );
}
