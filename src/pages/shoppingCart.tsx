import { useCallback, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import type { TCartItem } from '@/types/cart/Tcart';

import { useModalStore } from '@/stores/modalStore';
import { useProductCheckboxStore } from '@/stores/productCheckboxStore';
import { useCart } from '@/hooks/cart/useCart';

import { Button } from '@/components/common/button';
import BaseCheckbox from '@/components/common/checkbox';
import BottomBar from '@/components/head_bottom/BottomBar';
import PageHeaderBar from '@/components/head_bottom/PageHeader';
import OrderItem from '@/components/review/orderItem';

import EmptyCartImage from '@/assets/shoppingCart.svg';

export default function ShoppingCart() {
  const { openModal } = useModalStore();
  const navigate = useNavigate();

  const { cartItems, isEmpty, updateCartItem, deleteMultipleItems, isUpdating, isDeleting } = useCart();

  const productIds = useMemo(() => cartItems.map((item) => item.productId.toString()), [cartItems]);
  const { checkedItems, initialize, toggle, toggleAll, isAllChecked, reset } = useProductCheckboxStore();

  useEffect(() => {
    if (productIds.length > 0) {
      initialize(productIds, false);
    }
  }, [productIds, initialize]);

  const selectedItemsTotal = useMemo(() => {
    return cartItems.reduce((acc, item) => {
      if (checkedItems[item.productId]) {
        return acc + item.totalPrice;
      }
      return acc;
    }, 0);
  }, [cartItems, checkedItems]);

  const isAnyChecked = useMemo(() => Object.values(checkedItems).some((v) => v), [checkedItems]);

  const handleDeleteSelected = useCallback(async () => {
    const selectedProductIds = cartItems.filter((item) => checkedItems[item.productId]).map((item) => item.productId);

    if (selectedProductIds.length === 0) return;

    await deleteMultipleItems(selectedProductIds);
    reset();
  }, [cartItems, checkedItems, deleteMultipleItems, reset]);

  const handleUpdateCartItem = useCallback(
    (updatedData: { productId: number; optionId: number; quantity: number }) => {
      updateCartItem(updatedData);
    },
    [updateCartItem],
  );

  const handleOptionChange = useCallback(
    (item: TCartItem) => {
      openModal('cart-option', {
        item,
        onUpdate: (updatedData: { optionId: number; quantity: number }) => {
          handleUpdateCartItem({
            productId: item.productId,
            ...updatedData,
          });
        },
      });
    },
    [openModal, handleUpdateCartItem],
  );

  const handleGoToPayment = useCallback(() => {
    const selectedItems = cartItems.filter((item) => checkedItems[item.productId]);

    navigate('/payment', {
      state: {
        selectedItems,
      },
    });
  }, [cartItems, checkedItems, selectedItemsTotal, navigate]);

  return (
    <>
      <header className="">
        <PageHeaderBar title="장바구니" />
      </header>

      <div className="w-full bg-white text-black pb-32">
        {isEmpty ? (
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
                disabled={isEmpty}
              />
              <button
                className="ml-auto text-body-regular text-black disabled:text-black-3"
                disabled={!isAnyChecked || isDeleting}
                onClick={() =>
                  openModal('alert', {
                    onConfirm: () => {
                      handleDeleteSelected();
                    },
                    message: '장바구니에서 상품을 삭제할까요?',
                  })
                }
              >
                선택 삭제
              </button>
            </section>

            {cartItems.map((product) => (
              <section key={`${product.productId}-${product.optionId}`} className="w-full px-4 py-5 border-b-4 border-black-0">
                <div className="flex items-start gap-3">
                  <BaseCheckbox checked={checkedItems[product.productId] || false} onClick={() => toggle(product.productId.toString())} />
                  <div className="flex-1">
                    <OrderItem
                      item={{
                        ...product,
                        orderId: product.id,
                        name: product.productName,
                        company: product.brand,
                        price: product.unitPrice,
                        image: product.productThumbnail,
                        quantity: product.quantity,
                        reviewed: false,
                      }}
                      show={false}
                      showPrice={false}
                    />
                  </div>
                </div>

                <div className="flex w-full gap-2 mt-3">
                  <Button
                    kind="select-content"
                    variant={product.teamAvailable ? 'outline-orange' : 'outline-gray'}
                    className="flex-1 py-1 disabled:!text-black-2 disabled:!border-black-2 disabled:hover:!text-black-2 disabled:hover:!border-black-2 disabled:hover:!bg-transparent disabled:cursor-not-allowed"
                    onClick={() => {
                      if (product.teamAvailable) {
                        navigate('/payment');
                      }
                    }}
                    disabled={!product.teamAvailable}
                  >
                    팀 참여
                  </Button>
                  <Button
                    kind="select-content"
                    variant="outline-gray"
                    className="flex-1 py-1"
                    onClick={() => handleOptionChange(product)}
                    disabled={isUpdating}
                  >
                    옵션 변경
                  </Button>
                </div>

                <div className="flex justify-end items-baseline gap-2 mt-3 w-full">
                  <p className="text-black-3 text-small-regular line-through">{product.unitPrice.toLocaleString()} 원</p>
                  <p className="text-body-medium">{product.totalPrice.toLocaleString()} 원</p>
                </div>
              </section>
            ))}
          </>
        )}
      </div>

      {!isEmpty && (
        <div className="fixed bottom-14 left-0 right-0 w-full max-w-[600px] mx-auto">
          <Button kind="basic" variant="solid-orange" className="w-full" disabled={selectedItemsTotal === 0} onClick={handleGoToPayment}>
            {selectedItemsTotal.toLocaleString()} 원 구매하기
          </Button>
        </div>
      )}

      <BottomBar />
    </>
  );
}
