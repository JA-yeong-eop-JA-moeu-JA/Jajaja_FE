import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

import type { IAddress } from '@/types/address/TAddress';
import type { TPaymentData, TPaymentItem } from '@/types/cart/TCart';
import type { TCoupons } from '@/types/coupon/TGetCoupons';

import { formatPhoneNumberForToss, generateCustomerKey } from '@/utils/paymentUtils';

import { useModalStore } from '@/stores/modalStore';
import { useGetAddresses } from '@/hooks/address/useAddress';
import { useCart } from '@/hooks/cart/useCartQuery';
import { useCartCoupon } from '@/hooks/coupon/useCoupons';
import useInfiniteCoupons from '@/hooks/coupon/useInfiniteCoupons';
import useUserInfo from '@/hooks/myPage/useUserInfo';
import { usePayment } from '@/hooks/payment/usePayment';
import { usePaymentPrepare } from '@/hooks/payment/usePaymentPrepare';
import useInfinitePoints from '@/hooks/points/useInfinitePoints';

import { Button } from '@/components/common/button';
import PageHeader from '@/components/head_bottom/PageHeader';
import Loading from '@/components/loading';
import OrderItem from '@/components/review/orderItem';

import Down from '@/assets/icons/down.svg?react';
import { orderData } from '@/mocks/orderData';

const convertPaymentItemToCartItem = (item: TPaymentItem, orderType: string) => {
  const price = orderType === 'individual' ? item.individualPrice || item.unitPrice : item.teamPrice || item.unitPrice;

  return {
    productId: item.productId,
    productName: item.productName,
    store: item.brand || item.store || '브랜드 정보 없음',
    optionName: item.optionName,
    quantity: item.quantity,
    price: price,
    totalPrice: price * item.quantity,
    imageUrl: item.productThumbnail,
    productThumbnail: item.productThumbnail,
    brand: item.brand || '브랜드 정보 없음',
    id: item.id,
    optionId: item.optionId,
    unitPrice: item.unitPrice,
    originalPrice: item.unitPrice,
    teamAvailable: true,
  };
};

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
  const { cartData, isLoading: cartLoading } = useCart();

  const paymentData = location.state as TPaymentData & {
    isDirectPurchase?: boolean;
    directPurchaseInfo?: {
      products: { productId: number; optionId: number; quantity: number; timestamp: number }[];
      productDetails?: {
        name: string;
        thumbnailUrl: string;
        store: string;
      };
    };
  };

  const [selectedAddress, setSelectedAddress] = useState<IAddress | null>(null);
  const [selectedDeliveryRequest, setSelectedDeliveryRequest] = useState<string>('');
  const [usedPoints, setUsedPoints] = useState<number>(0);
  const [isProcessingPayment, setIsProcessingPayment] = useState<boolean>(false);

  const [backendCalculatedAmount, setBackendCalculatedAmount] = useState<{
    totalAmount: number;
    discountAmount: number;
    pointDiscount: number;
    shippingFee: number;
    finalAmount: number;
  } | null>(null);

  const { data: userInfo, isLoading: userLoading } = useUserInfo();
  const { data: addressesData, isLoading: addressesLoading } = useGetAddresses();
  const { data: pointsData, isLoading: pointsLoading } = useInfinitePoints();
  const { data: couponsData, isLoading: couponsLoading } = useInfiniteCoupons();
  const { calculateDiscount, getAppliedCoupon, getLocalAppliedCoupon, isExpired, isApplicable } = useCartCoupon();
  const paymentPrepareMutation = usePaymentPrepare();

  const user = userInfo?.result;
  const userPoints = pointsData?.pages[0]?.result?.pointBalance ?? 0;
  const addresses: IAddress[] = Array.isArray(addressesData) ? addressesData : [];

  const appliedCoupon: TCoupons | null = (() => {
    const cartCoupon = getAppliedCoupon();
    if (cartCoupon) return cartCoupon;

    const localCoupon = getLocalAppliedCoupon();
    if (localCoupon) return localCoupon;

    return null;
  })();

  const getOrderItemsForDirectPurchase = () => {
    if (!paymentData?.isDirectPurchase || !paymentData?.directPurchaseInfo || !cartData) {
      return paymentData?.selectedItems || orderData[0].items;
    }

    const directProducts = paymentData.directPurchaseInfo.products;
    const productDetails = paymentData.directPurchaseInfo.productDetails;

    const exactMatches = cartData.products.filter((cartItem) => {
      return directProducts.some(
        (directProduct) =>
          directProduct.productId === cartItem.productId && directProduct.optionId === cartItem.optionId && directProduct.quantity === cartItem.quantity,
      );
    });

    if (exactMatches.length > 0) {
      return exactMatches.map((cartItem) => ({
        id: cartItem.id,
        productId: cartItem.productId,
        optionId: cartItem.optionId,
        quantity: cartItem.quantity,
        unitPrice: cartItem.unitPrice,
        teamPrice: cartItem.teamPrice || cartItem.unitPrice,
        individualPrice: cartItem.individualPrice || cartItem.unitPrice,
        productName: cartItem.productName,
        optionName: cartItem.optionName,
        productThumbnail: cartItem.productThumbnail,
        brand: cartItem.brand,
        store: cartItem.brand,
      }));
    }

    const partialMatches = directProducts
      .map((directProduct) => {
        const cartItem = cartData.products.find((item) => item.productId === directProduct.productId && item.optionId === directProduct.optionId);

        if (cartItem) {
          return {
            id: cartItem.id,
            productId: cartItem.productId,
            optionId: cartItem.optionId,
            quantity: directProduct.quantity,
            unitPrice: cartItem.unitPrice,
            teamPrice: cartItem.teamPrice || cartItem.unitPrice,
            individualPrice: cartItem.individualPrice || cartItem.unitPrice,
            productName: productDetails?.name || cartItem.productName,
            optionName: cartItem.optionName,
            productThumbnail: productDetails?.thumbnailUrl || cartItem.productThumbnail,
            brand: productDetails?.store || cartItem.brand,
            store: productDetails?.store || cartItem.brand,
          };
        }
        return null;
      })
      .filter(Boolean);

    return partialMatches;
  };

  const currentOrderItems = getOrderItemsForDirectPurchase().filter((item): item is NonNullable<typeof item> => item !== null);

  const calculateEstimatedAmount = () => {
    if (!currentOrderItems || currentOrderItems.length === 0) return 0;

    return currentOrderItems.reduce((acc, item) => {
      const price = paymentData?.orderType === 'individual' ? item.individualPrice || item.unitPrice : item.teamPrice || item.unitPrice;
      return acc + price * item.quantity;
    }, 0);
  };

  const availableCoupons = couponsData?.pages.flatMap((page) => page.result.coupons || []) ?? [];
  const currentOrderAmount = calculateEstimatedAmount();
  const couponsCount = availableCoupons.filter((coupon) => !isExpired(coupon) && isApplicable(currentOrderAmount, coupon)).length;

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

  const displayAmount = backendCalculatedAmount
    ? {
        originalAmount: backendCalculatedAmount.totalAmount,
        couponDiscount: backendCalculatedAmount.discountAmount,
        pointDiscount: backendCalculatedAmount.pointDiscount,
        shippingFee: backendCalculatedAmount.shippingFee,
        finalAmount: backendCalculatedAmount.finalAmount,
      }
    : {
        originalAmount: calculateEstimatedAmount(),
        couponDiscount: calculateDiscount(calculateEstimatedAmount(), appliedCoupon || undefined),
        pointDiscount: usedPoints,
        shippingFee: 0,
        finalAmount: Math.max(0, calculateEstimatedAmount() - calculateDiscount(calculateEstimatedAmount(), appliedCoupon || undefined) - usedPoints),
      };

  const customerKey = generateCustomerKey(user?.id?.toString() || 'anonymous');

  const {
    payment,
    isLoading: paymentLoading,
    requestPayment,
  } = usePayment({
    customerKey,
  });

  const handlePointsChange = (value: number) => {
    const numValue = Number(value) || 0;

    if (numValue > userPoints) {
      setUsedPoints(userPoints);
      alert(`사용 가능한 적립금은 최대 ${userPoints.toLocaleString()}원입니다.`);
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

    if (!selectedAddress.phone) {
      alert('선택된 배송지에 휴대폰 번호가 없습니다. 배송지를 변경하거나 수정해주세요.');
      return;
    }
    if (!payment) {
      alert('결제 시스템을 초기화하고 있습니다. 잠시 후 다시 시도해주세요.');
      return;
    }

    if (isProcessingPayment) {
      return;
    }

    setIsProcessingPayment(true);

    const formattedPhoneNumber = formatPhoneNumberForToss(selectedAddress.phone);

    if (!/^\d{10,11}$/.test(formattedPhoneNumber)) {
      alert('선택된 배송지의 휴대폰 번호 형식이 올바르지 않습니다.');
      setIsProcessingPayment(false);
      return;
    }

    try {
      const isTeamOrder = paymentData?.orderType !== 'individual';

      const prepareData: any = {
        items: currentOrderItems.map((item) => item.id),
        addressId: selectedAddress.id,
        orderType: isTeamOrder ? 'TEAM' : 'PERSONAL',
        deliveryRequest: selectedDeliveryRequest || '현관문 앞에 놓아주세요.',
        point: usedPoints,
      };

      // 팀 구매일 경우에만 teamId 추가
      if (isTeamOrder) {
        if (!paymentData.teamId) {
          alert('팀 정보가 올바르지 않습니다. 다시 시도해주세요.');
          setIsProcessingPayment(false);
          return;
        }
        prepareData.teamId = paymentData.teamId;
      }

      if (appliedCoupon?.couponId) {
        prepareData.appliedCouponId = appliedCoupon.couponId;
      }

      const prepareResult = await paymentPrepareMutation.mutateAsync(prepareData);

      if (!prepareResult.isSuccess) {
        throw new Error(prepareResult.message || '결제 준비에 실패했습니다.');
      }

      const responseData = prepareResult.result;

      if (!responseData) {
        throw new Error('결제 준비 응답 데이터가 없습니다.');
      }

      const { orderId, orderName, finalAmount } = responseData;

      if (!orderId || !orderName || typeof finalAmount === 'undefined') {
        throw new Error('결제 준비 응답에 필수 데이터가 누락되었습니다.');
      }

      sessionStorage.setItem('finalAmount', finalAmount.toString());

      setBackendCalculatedAmount({
        totalAmount: responseData.totalAmount,
        discountAmount: responseData.discountAmount,
        pointDiscount: responseData.pointDiscount,
        shippingFee: responseData.shippingFee,
        finalAmount,
      });

      if (finalAmount <= 0) {
        alert('결제 금액이 0원입니다. 쿠폰 또는 포인트 사용을 조정해주세요.');
        setIsProcessingPayment(false);
        return;
      }

      const baseUrl = window.location.origin;

      await requestPayment({
        method: 'CARD',
        amount: {
          currency: 'KRW',
          value: finalAmount,
        },
        orderId: String(orderId),
        orderName,
        customerEmail: user.email || '',
        customerName: selectedAddress.name,
        customerMobilePhone: formattedPhoneNumber,
        successUrl: `${baseUrl}/payment/confirm`,
        failUrl: `${baseUrl}/payment/confirm`,
      });
    } catch (error) {
      let errorMessage = '결제 처리 중 오류가 발생했습니다.';

      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any;

        if (axiosError.response?.data?.code) {
          switch (axiosError.response.data.code) {
            case 'POINT4002':
              errorMessage = '사용 가능한 적립금을 초과했습니다. 적립금을 확인해주세요.';
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
          <p className="text-green">{discountAmount === 0 ? '0' : `-${discountAmount.toLocaleString()}`} 원</p>
        </div>
        <div className="flex justify-between text-small-medium mb-2">
          <p>적립금 사용</p>
          <p className="text-green">{pointsUsed === 0 ? '0' : `-${pointsUsed.toLocaleString()}`} 원</p>
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
        <div className="space-y-2 pb-17">
          <p className="underline">서비스 및 이용 약관 동의</p>
          <p className="underline">개인정보 제공 동의</p>
          <p className="underline">결제대행 서비스 이용약관 동의</p>
          <p className="mt-3">자자자는 통신판매중개자로, 업체 배송 상품의 상품/상품정보/거래 등에 대한 책임은 자자자가 아닌 판매자에게 있습니다.</p>
          <p className="mt-3">위 내용을 확인하였으며 결제에 동의합니다.</p>
        </div>
      </section>
    );
  }

  if (userLoading || addressesLoading || pointsLoading || couponsLoading || (paymentData?.isDirectPurchase && cartLoading)) {
    return (
      <>
        <PageHeader title="주문 결제" />
        <Loading />
      </>
    );
  }

  if (!user) {
    return (
      <>
        <PageHeader title="주문 결제" />
        <div className="flex justify-center items-center h-64">
          <p className="text-body-regular text-black-4">사용자 정보를 불러올 수 없습니다.</p>
        </div>
      </>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
        className="min-h-screen"
      >
        <PageHeader title="주문 결제" />

        {paymentData?.orderType !== 'individual' && (
          <section className="p-4 border-b-4 border-black-1">
            <p className="text-subtitle-medium mb-4">팀 구매 정보</p>
            <div className="bg-orange-50 p-3 rounded">
              {paymentData.orderType === 'team_create' && (
                <>
                  <p className="text-body-regular">팀을 생성하고 있습니다</p>
                  <p className="text-body-regular">
                    결제 완료 직후부터 <span className="text-orange">30분간</span> 팀 매칭이 진행됩니다
                  </p>
                </>
              )}
              {paymentData.orderType === 'team_join' && (
                <>
                  <p className="text-small-medium">팀 구매에 참여하고 있습니다.</p>
                  <p className="text-small-regular">결제 확인 후 팀 매칭이 완료됩니다.</p>
                </>
              )}
            </div>
          </section>
        )}

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

        <section className="p-4 border-b-4 border-black-1">
          <p className="text-subtitle-medium mb-4">주문 상품 {currentOrderItems.length}개</p>
          {currentOrderItems.map((item, index) => {
            const convertedItem = convertPaymentItemToCartItem(item, paymentData?.orderType || 'individual');

            return (
              <div key={`order-item-${item.productId || 'unknown'}-${item.optionId || index}`} className="mb-5">
                <OrderItem item={convertedItem} show={false} showPrice={true} />
              </div>
            );
          })}
        </section>

        <section className="p-4 mt-3 border-b-4 border-black-1">
          <p className="text-subtitle-medium mb-4">할인 혜택</p>
          <div className="flex justify-between items-center border-1 border-black-3 rounded px-4 py-3 mb-3" onClick={() => navigate('/coupon')}>
            <p className="text-body-medium">쿠폰</p>
            <div className="flex items-center gap-3">
              <p className="text-body-regular">
                {appliedCoupon && displayAmount.couponDiscount > 0 ? (
                  <span className="text-green">{displayAmount.couponDiscount.toLocaleString()}원 할인</span>
                ) : (
                  `사용 가능 ${couponsCount}장`
                )}
              </p>
              <Down className="w-4 h-2 mr-1" />
            </div>
          </div>
          <div className="flex gap-2 mb-2">
            <div className="flex-1 flex justify-between items-center border-1 border-black-3 rounded px-4 py-3">
              <p className="text-body-medium">적립금</p>
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
            <button
              className="px-4 py-2.5 border-1 border-black-3 text-body-regular rounded whitespace-nowrap"
              onClick={() => setUsedPoints(usedPoints === userPoints ? 0 : userPoints)}
            >
              {usedPoints === userPoints ? '사용 취소' : '모두 사용'}
            </button>
          </div>
          <div className="flex justify-end">
            <p className="text-small-medium text-black-4">보유 적립금: {userPoints.toLocaleString()} 원</p>
          </div>
        </section>

        <PaymentSummarySection
          total={displayAmount.originalAmount}
          discount={displayAmount.couponDiscount}
          pointsUsed={displayAmount.pointDiscount}
          shippingFee={displayAmount.shippingFee}
          finalAmount={displayAmount.finalAmount}
        />

        <AgreementNoticeSection />

        <div className="fixed bottom-2 left-0 right-0 w-full max-w-[600px] mx-auto">
          <Button
            kind="basic"
            variant="solid-orange"
            disabled={displayAmount.finalAmount <= 0 || isProcessingPayment || paymentPrepareMutation.isPending || !selectedAddress || paymentLoading}
            onClick={handlePayment}
            className="w-full"
          >
            {isProcessingPayment || paymentPrepareMutation.isPending ? '결제 처리 중...' : `${displayAmount.finalAmount.toLocaleString()}원 결제하기`}
          </Button>
        </div>
      </motion.div>
    </>
  );
}
