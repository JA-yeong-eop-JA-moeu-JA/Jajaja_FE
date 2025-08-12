import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import type { TCoupons } from '@/types/coupon/TGetCoupons';

import { useCart } from '@/hooks/cart/useCart';
import { useAppliedCoupon, useApplyCoupon, useCoupons } from '@/hooks/coupon/useCoupons';

import CouponCard from '@/components/coupon/CouponCard';
import PageHeader from '@/components/head_bottom/PageHeader';

export default function CouponPage() {
  const navigate = useNavigate();
  const [selectedCoupon, setSelectedCoupon] = useState<TCoupons | null>(null);

  const { data: couponsData, isLoading, error } = useCoupons();
  const { mutate: applyCoupon, isPending: isApplying } = useApplyCoupon();
  const { getAppliedCoupon } = useAppliedCoupon();

  const { data: cartData, error: cartError } = useCart();
  // 스웨거 API 구조에 맞춰 수정: products 사용
  const currentOrderAmount = cartError ? 50000 : cartData?.result?.summary?.originalAmount || 0;

  // 디버깅용 로그
  console.log('🔍 쿠폰 페이지 데이터:', couponsData);
  console.log('🛒 장바구니 데이터:', cartData);
  console.log('❌ 장바구니 에러:', cartError);
  console.log('💰 현재 주문 금액:', currentOrderAmount);

  useEffect(() => {
    const appliedCoupon = getAppliedCoupon();
    if (appliedCoupon) {
      setSelectedCoupon(appliedCoupon);
    }
  }, []);

  const isApplicable = (coupon: TCoupons): boolean => {
    // 장바구니가 비어있으면 (0원) 모든 쿠폰 적용 불가
    if (currentOrderAmount === 0) return false;
    return currentOrderAmount >= coupon.applicableConditions.minOrderAmount;
  };

  const handleCouponSelect = (coupon: TCoupons) => {
    if (isApplying) return;

    // 장바구니가 비어있는 경우
    if (currentOrderAmount === 0) {
      alert('장바구니에 상품을 먼저 담아주세요.');
      return;
    }

    // 적용 가능 여부 체크
    if (!isApplicable(coupon)) {
      alert(
        `이 쿠폰은 ${coupon.applicableConditions.minOrderAmount.toLocaleString()}원 이상 구매 시 사용 가능합니다.\n현재 주문 금액: ${currentOrderAmount.toLocaleString()}원`,
      );
      return;
    }

    setSelectedCoupon(coupon);

    applyCoupon(coupon.couponId, {
      onSuccess: () => {
        setTimeout(() => {
          navigate(-1);
        }, 2000);
      },
      onError: (err: any) => {
        console.error('쿠폰 적용 실패:', err);
        setSelectedCoupon(null);

        // 에러 메시지 개선
        const errorData = err?.response?.data;
        if (errorData?.code === 'COUPON4005') {
          alert('최소 주문 금액을 충족하지 않습니다. 장바구니에 상품을 더 추가해주세요.');
        } else {
          alert('쿠폰 적용에 실패했습니다. 다시 시도해주세요.');
        }
      },
    });
  };

  if (isLoading) {
    return (
      <>
        <PageHeader title="쿠폰" />
        <div className="w-full h-screen flex justify-center items-center">
          <div className="text-body-regular text-black-4">쿠폰을 불러오는 중...</div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <PageHeader title="쿠폰" />
        <div className="w-full h-screen flex justify-center items-center">
          <div className="text-body-regular text-error-3">쿠폰을 불러오는데 실패했습니다.</div>
        </div>
      </>
    );
  }

  const coupons = couponsData?.result?.coupons || [];

  return (
    <>
      <PageHeader title="쿠폰" />
      <div className="w-full min-h-screen bg-white">
        <div className="flex flex-col gap-3 px-3 py-4">
          {/* 장바구니가 비어있을 때 안내 메시지 */}
          {currentOrderAmount === 0 && (
            <div className="bg-yellow-50 p-3 rounded mb-3 border border-yellow-200">
              <p className="text-body-small text-yellow-700">⚠️ 장바구니에 상품을 먼저 담아주세요.</p>
              <p className="text-body-small text-yellow-600">쿠폰을 사용하려면 상품을 장바구니에 추가해야 합니다.</p>
            </div>
          )}

          {coupons.length === 0 ? (
            <div className="text-center text-body-regular text-black-4 mt-10">사용 가능한 쿠폰이 없습니다.</div>
          ) : (
            <>
              {coupons.map((coupon: TCoupons) => (
                <CouponCard
                  key={coupon.couponId}
                  coupon={coupon}
                  isSelected={selectedCoupon?.couponId === coupon.couponId}
                  onClick={() => handleCouponSelect(coupon)}
                />
              ))}
            </>
          )}
        </div>
      </div>
    </>
  );
}
