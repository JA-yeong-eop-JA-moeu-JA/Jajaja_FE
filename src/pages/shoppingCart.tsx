import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import type { TCartItem } from '@/types/cart/TCart';

import { useModalStore } from '@/stores/modalStore';
import { useProductCheckboxStore } from '@/stores/productCheckboxStore';
import { useCart, useDeleteCartItem } from '@/hooks/cart/useCart';

import { Button } from '@/components/common/button';
import BaseCheckbox from '@/components/common/checkbox';
import BottomBar from '@/components/head_bottom/BottomBar';
import PageHeaderBar from '@/components/head_bottom/PageHeader';

import EmptyCartImage from '@/assets/shoppingCart.svg';

export default function ShoppingCart() {
  const navigate = useNavigate();
  const { openModal } = useModalStore();

  // 장바구니 API 연동
  const { data: cartData, isLoading, error } = useCart();
  const { mutate: deleteCartItem } = useDeleteCartItem();

  const cartList = cartData?.result?.products || []; // data에서 products로 변경
  const cartSummary = cartData?.result?.summary;
  const appliedCoupon = cartData?.result?.appliedCoupon;

  const productIds = cartList.map((item: TCartItem) => item.id.toString());
  const { checkedItems, initialize, toggle, toggleAll, isAllChecked, reset } = useProductCheckboxStore();

  useEffect(() => {
    if (cartList.length > 0) {
      initialize(productIds, false);
    }
  }, [cartList, initialize]);

  // 선택된 상품들의 총 금액 계산
  const calculateSelectedTotal = () => {
    return cartList.reduce((acc: number, item: TCartItem) => {
      if (checkedItems[item.id]) {
        return acc + item.totalPrice;
      }
      return acc;
    }, 0);
  };

  const selectedTotal = calculateSelectedTotal();
  const isAnyChecked = Object.values(checkedItems).some((v) => v);
  const isCartEmpty = cartList.length === 0;

  const handleDeleteSelected = () => {
    const selectedItems = cartList.filter((item: TCartItem) => checkedItems[item.id]);

    // 선택된 상품들을 하나씩 삭제 (productId와 optionId로)
    selectedItems.forEach((item) => {
      deleteCartItem(
        {
          productId: item.productId,
          optionId: item.optionId,
        },
        {
          onSuccess: () => {
            console.log(`상품 ${item.productId} 삭제 완료`);
          },
          onError: (err) => {
            console.error(`상품 ${item.productId} 삭제 실패:`, err);
            alert('상품 삭제에 실패했습니다.');
          },
        },
      );
    });

    reset();
  };

  const handleUpdateCartItem = (updatedItem: TCartItem) => {
    // TODO: 장바구니 아이템 수정 API 호출
    // 현재는 옵션 변경만 모달로 처리
    console.log('상품 옵션 변경:', updatedItem);
  };

  const handleOptionChange = (item: TCartItem) => {
    openModal('cart-option', {
      item,
      onUpdate: handleUpdateCartItem,
    });
  };

  const handleProceedToPayment = () => {
    if (selectedTotal === 0) {
      alert('결제할 상품을 선택해주세요.');
      return;
    }
    navigate('/payment');
  };

  // 로딩 상태
  if (isLoading) {
    return (
      <>
        <PageHeaderBar title="장바구니" />
        <div className="w-full h-screen flex justify-center items-center">
          <div className="text-body-regular text-black-4">장바구니를 불러오는 중...</div>
        </div>
      </>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <>
        <PageHeaderBar title="장바구니" />
        <div className="w-full h-screen flex justify-center items-center">
          <div className="text-body-regular text-error-3">장바구니를 불러오는데 실패했습니다.</div>
        </div>
      </>
    );
  }

  return (
    <>
      <header className="">
        <PageHeaderBar title="장바구니" />
      </header>

      <div className="w-full bg-white text-black pb-32">
        {isCartEmpty ? (
          <section className="flex flex-col items-center justify-center h-[calc(100vh-56px-56px)] pt-20 pb-10 px-4">
            <img src={EmptyCartImage} alt="장바구니 비어 있음" className="w-40 h-40 mb-6" />
            <p className="text-subtitle-medium mb-2">장바구니에 담긴 상품이 없습니다.</p>
            <p className="text-body-regular text-black-4">원하는 상품을 찾아 장바구니를 채워보세요.</p>
          </section>
        ) : (
          <>
            <section className="flex items-center px-4 py-3 border-b-4 border-black-1">
              <BaseCheckbox
                checked={isAllChecked()}
                onClick={() => toggleAll(!isAllChecked())}
                message="전체 선택"
                textClassName="text-small-medium"
                disabled={isCartEmpty}
              />
              <button
                className="ml-auto text-body-regular text-black disabled:text-black-3"
                disabled={!isAnyChecked}
                onClick={() => openModal('alert', { onDelete: handleDeleteSelected, message: '장바구니에서 상품을 삭제할까요?' })}
              >
                선택 삭제
              </button>
            </section>

            {/* 적용된 쿠폰 표시 */}
            {appliedCoupon && (
              <section className="px-4 py-3 bg-green-50 border-b-4 border-black-0">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-small-medium text-green-700">🎫 적용된 쿠폰</p>
                    <p className="text-body-regular text-green-600">{appliedCoupon.couponName}</p>
                  </div>
                  <p className="text-body-medium text-green-600">-{cartSummary?.discountAmount?.toLocaleString() || 0}원</p>
                </div>
              </section>
            )}

            {cartList.map((item: TCartItem) => (
              <section key={item.id} className="w-full px-4 py-5 border-b-4 border-black-0">
                <div className="flex items-start gap-3">
                  <BaseCheckbox checked={checkedItems[item.id] || false} onClick={() => toggle(item.id.toString())} />
                  <div className="flex-1">
                    {/* 상품 정보 표시 */}
                    <div className="flex gap-3">
                      <img src={item.productThumbnail} alt={item.productName} className="w-20 h-20 object-cover rounded" />
                      <div className="flex-1">
                        <p className="text-body-regular font-medium">{item.productName}</p>
                        <p className="text-small-regular text-black-4">{item.brand}</p>
                        <p className="text-small-regular text-black-4">{item.optionName}</p>
                        <p className="text-small-regular text-black-4">수량: {item.quantity}개</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex w-full gap-2 mt-3">
                  <Button kind="select-content" variant="outline-orange" className="flex-1 py-1" disabled={!item.teamAvailable}>
                    {item.teamAvailable ? '팀 참여' : '팀 참여 불가'}
                  </Button>
                  <Button kind="select-content" variant="outline-gray" className="flex-1 py-1" onClick={() => handleOptionChange(item)}>
                    옵션 변경
                  </Button>
                </div>

                <div className="flex justify-end items-baseline gap-2 mt-3 w-full">
                  <p className="text-black-3 text-small-regular line-through">{item.unitPrice.toLocaleString()} 원</p>
                  <p className="text-body-medium">{item.totalPrice.toLocaleString()} 원</p>
                </div>
              </section>
            ))}

            {/* 주문 요약 정보 */}
            {cartSummary && (
              <section className="px-4 py-4 bg-gray-50">
                <div className="space-y-2">
                  <div className="flex justify-between text-small-regular">
                    <span>상품금액</span>
                    <span>{cartSummary.originalAmount.toLocaleString()}원</span>
                  </div>
                  {cartSummary.discountAmount > 0 && (
                    <div className="flex justify-between text-small-regular text-red-500">
                      <span>할인금액</span>
                      <span>-{cartSummary.discountAmount.toLocaleString()}원</span>
                    </div>
                  )}
                  <div className="flex justify-between text-small-regular">
                    <span>배송비</span>
                    <span>{cartSummary.shippingFee === 0 ? '무료' : `${cartSummary.shippingFee.toLocaleString()}원`}</span>
                  </div>
                  <div className="flex justify-between text-body-medium font-semibold pt-2 border-t">
                    <span>총 결제금액</span>
                    <span>{cartSummary.finalAmount.toLocaleString()}원</span>
                  </div>
                </div>
              </section>
            )}
          </>
        )}
      </div>

      {!isCartEmpty && (
        <div className="fixed bottom-14 left-0 right-0 w-full max-w-[600px] mx-auto">
          <Button kind="basic" variant="solid-orange" className="w-full" disabled={selectedTotal === 0} onClick={handleProceedToPayment}>
            {selectedTotal.toLocaleString()} 원 1인 구매하기
          </Button>
        </div>
      )}

      <BottomBar />
    </>
  );
}
