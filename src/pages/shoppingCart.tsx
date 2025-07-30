import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useModalStore } from '@/stores/modalStore';
import { useProductCheckboxStore } from '@/stores/productCheckboxStore';

import { Button } from '@/components/common/button';
import BaseCheckbox from '@/components/common/checkbox';
import BottomBar from '@/components/head_bottom/BottomBar';
import PageHeaderBar from '@/components/head_bottom/PageHeader';
import OrderItem from '@/components/review/orderItem';

import EmptyCartImage from '@/assets/shoppingCart.svg';

import type { IOrderItem } from '@/mocks/orderData';
import { orderData } from '@/mocks/orderData';

export interface ICartItem extends IOrderItem {
  originalPrice: number;
}

const initialCartList: ICartItem[] = orderData[0].items.map((item) => ({
  ...item,
  originalPrice: item.price,
}));

export default function ShoppingCart() {
  const [cartList, setCartList] = useState<ICartItem[]>(initialCartList);

  const productIds = cartList.map((item) => item.productId.toString());
  const { checkedItems, initialize, toggle, toggleAll, isAllChecked, reset } = useProductCheckboxStore();
  const { openModal } = useModalStore();
  const navigate = useNavigate();

  useEffect(() => {
    initialize(productIds, false);
  }, [cartList, initialize]);

  const totalPrice = cartList.reduce((acc: number, product: ICartItem) => {
    if (checkedItems[product.productId]) {
      return acc + product.price * (product.quantity || 1);
    }
    return acc;
  }, 0);

  const isAnyChecked = Object.values(checkedItems).some((v) => v);
  const isCartEmpty = cartList.length === 0;

  const handleDeleteSelected = () => {
    const newCartList = cartList.filter((product: ICartItem) => !checkedItems[product.productId]);
    setCartList(newCartList);
    reset();
  };

  const handleUpdateCartItem = (updatedItem: ICartItem) => {
    setCartList((prev) => prev.map((item) => (item.productId === updatedItem.productId ? updatedItem : item)));
  };

  const handleOptionChange = (item: ICartItem) => {
    openModal('cart-option', {
      item,
      onUpdate: handleUpdateCartItem,
    });
  };

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

            {cartList.map((product) => (
              <section key={product.productId} className="w-full px-4 py-5 border-b-4 border-black-0">
                <div className="flex items-start gap-3">
                  <BaseCheckbox checked={checkedItems[product.productId] || false} onClick={() => toggle(product.productId.toString())} />
                  <div className="flex-1">
                    <OrderItem item={product} show={false} showPrice={false} />
                  </div>
                </div>

                <div className="flex w-full gap-2 mt-3">
                  <Button kind="select-content" variant="outline-orange" className="flex-1 py-1">
                    팀 참여
                  </Button>
                  <Button kind="select-content" variant="outline-gray" className="flex-1 py-1" onClick={() => handleOptionChange(product)}>
                    옵션 변경
                  </Button>
                </div>

                <div className="flex justify-end items-baseline gap-2 mt-3 w-full">
                  <p className="text-black-3 text-small-regular line-through">{product.originalPrice.toLocaleString()} 원</p>
                  <p className="text-body-medium">{(product.price * (product.quantity || 1)).toLocaleString()} 원</p>
                </div>
              </section>
            ))}

            {!isCartEmpty && (
              <div className="fixed bottom-14 left-0 right-0 w-full max-w-[600px] mx-auto">
                <Button kind="basic" variant="solid-orange" className="w-full" disabled={totalPrice === 0} onClick={() => navigate('/pa')}>
                  {totalPrice.toLocaleString()} 원 1인 구매하기
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      {!isCartEmpty && (
        <div className="fixed bottom-14 left-0 right-0 w-full max-w-[600px] mx-auto px-4">
          <Button kind="basic" variant="solid-orange" className="w-full" disabled={totalPrice === 0} onClick={() => {}}>
            {totalPrice.toLocaleString()} 원 1인 구매하기
          </Button>
        </div>
      )}

      <BottomBar />
    </>
  );
}
