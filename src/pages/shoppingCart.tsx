import { useEffect, useState } from 'react';

import { CARTLIST as INITIAL_CARTLIST } from '@/constants/shoppingCart/cartList';

import { useProductCheckboxStore } from '@/stores/productCheckboxStore';

import { Button } from '@/components/common/button';
import BaseCheckbox from '@/components/common/checkbox';
import BottomBar from '@/components/head_bottom/BottomBar';
import PageHeaderBar from '@/components/head_bottom/PageHeader';

import EmptyCartImage from '@/assets/shoppingCart.svg';

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

function CartItem({ product, checked, onToggle }: { product: IProductType; checked: boolean; onToggle: () => void }) {
  return (
    <section key={product.id} className="w-full px-4 py-5 border-b-4 border-black-0">
      <div className="flex items-start gap-3">
        <BaseCheckbox checked={checked} onClick={onToggle} />

        <img src={product.imageUrl} alt={product.name} className="w-20 h-20 object-cover rounded" />

        <div className="flex flex-col flex-1">
          <p className="text-small-medium text-black-4 mt-1 mb-1">{product.company}</p>
          <p className="text-small-medium mb-2">{product.name}</p>
          <p className="text-small-regular text-black-4">
            {product.option} / {product.quantity}개
          </p>
        </div>
      </div>

      <div className="flex flex-col w-full mt-4 gap-2">
        <div className="flex items-center gap-2 w-full">
          <Button kind="select-content" variant="outline-orange" className="flex-1 py-1">
            팀 참여
          </Button>
          <Button kind="select-content" variant="outline-gray" className="flex-1 py-1">
            옵션 변경
          </Button>
        </div>
        <div className="flex justify-end items-baseline gap-2 mt-1">
          <p className="text-black-3 text-small-regular line-through">{product.originalPrice.toLocaleString()} 원</p>
          <p className="text-body-medium">{product.price.toLocaleString()} 원</p>
        </div>
      </div>
    </section>
  );
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
              <CartItem key={product.id} product={product} checked={checkedItems[product.id] || false} onToggle={() => toggle(product.id.toString())} />
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
