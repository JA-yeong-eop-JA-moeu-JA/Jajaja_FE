import { useEffect, useState } from 'react';

import { CARTLIST as INITIAL_CARTLIST } from '@/constants/shoppingCart/cartList';

import { useProductCheckboxStore } from '@/stores/productCheckboxStore';

import { Button } from '@/components/common/button';
import BaseCheckbox from '@/components/common/checkbox';
import BottomBar from '@/components/head_bottom/BottomBar';
import PageHeaderBar from '@/components/head_bottom/PageHeader';
import OrderItem from '@/components/shopping_cart/orderItem';

import EmptyCartImage from '@/assets/shoppingCart.svg';

import type { IOrderItem } from '@/mocks/orderData';

interface IProductType {
  id: number;
  imageUrl: string;
  name: string;
  company: string;
  option: string;
  quantity: number;
  originalPrice: number;
  price: number;
}

export default function ShoppingCart() {
  const [cartList, setCartList] = useState(INITIAL_CARTLIST);

  const productIds = cartList.map((item) => item.id.toString());
  const { checkedItems, initialize, toggle, toggleAll, isAllChecked, reset } = useProductCheckboxStore();
  useEffect(() => {
    initialize(productIds, false);
  }, [cartList, initialize]);

  const totalPrice = cartList.reduce((acc, product) => {
    if (checkedItems[product.id]) {
      return acc + product.price;
    }
    return acc;
  }, 0);

  const isAnyChecked = Object.values(checkedItems).some((v) => v);
  const isCartEmpty = cartList.length === 0;

  const handleDeleteSelected = () => {
    const newCartList = cartList.filter((product) => !checkedItems[product.id]);
    setCartList(newCartList);
    reset();
  };

  const convertToOrderItem = (product: IProductType): IOrderItem => ({
    image: product.imageUrl,
    name: product.name,
    company: product.company,
    option: product.option,
    quantity: product.quantity,
    price: product.price,
    productId: 0,
    reviewed: false,
  });

  return (
    <>
      <header className="px-2">
        <PageHeaderBar title="장바구니" />
      </header>

      <div className="w-full bg-white text-black pb-40">
        {isCartEmpty ? (
          <section className="flex flex-col items-center justify-center pt-20 pb-10 px-4">
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
              <button className="ml-auto text-body-regular text-black-5 disabled:text-black-3" disabled={!isAnyChecked} onClick={handleDeleteSelected}>
                선택 삭제
              </button>
            </section>

            {cartList.map((product) => (
              <section key={product.id} className="w-full px-4 py-5 border-b-4 border-black-0">
                <div className="flex items-start gap-3 p-0 m-0">
                  <BaseCheckbox checked={checkedItems[product.id] || false} onClick={() => toggle(product.id.toString())} />
                  <div className="flex-1">
                    <OrderItem item={convertToOrderItem(product)} />
                  </div>
                </div>
                <div className="flex items-center gap-2 w-full mt-3 px-4 mx-auto max-w-[600px]">
                  <Button kind="select-content" variant="outline-orange" className="flex-1 py-1">
                    팀 참여
                  </Button>
                  <Button kind="select-content" variant="outline-gray" className="flex-1 py-1">
                    옵션 변경
                  </Button>
                </div>
                <div className="flex justify-end items-baseline gap-2 mt-2 px-4 mx-auto max-w-[600px]">
                  <p className="text-black-3 text-small-regular line-through">{product.originalPrice.toLocaleString()} 원</p>
                  <p className="text-body-medium">{product.price.toLocaleString()} 원</p>
                </div>
              </section>
            ))}
          </>
        )}
      </div>

      {!isCartEmpty && (
        <div className="fixed bottom-16 left-0 right-0 px-4 mx-auto max-w-[600px] w-full">
          <Button kind="basic" variant="solid-orange" className="w-full" onClick={() => {}}>
            {totalPrice.toLocaleString()} 원 1인 구매하기
          </Button>
        </div>
      )}
      <BottomBar />
    </>
  );
}
