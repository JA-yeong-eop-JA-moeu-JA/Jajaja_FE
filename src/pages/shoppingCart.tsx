import { useCallback, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import type { TCartProduct } from '@/types/cart/TCart';

import { useModalStore } from '@/stores/modalStore';
import { useProductCheckboxStore } from '@/stores/productCheckboxStore';
import { useCart } from '@/hooks/cart/useCartQuery';

import { Button } from '@/components/common/button';
import BaseCheckbox from '@/components/common/checkbox';
import BottomBar from '@/components/head_bottom/BottomBar';
import PageHeaderBar from '@/components/head_bottom/PageHeader';
import Loading from '@/components/loading';
import OrderItem from '@/components/review/orderItem';

import EmptyCartImage from '@/assets/shoppingCart.svg';

export interface ICartItem {
  productThumbnail: string;
  productId: number;
  productName: string;
  optionName: string;
  quantity: number;
  price: number;
  originalPrice: number;
  imageUrl: string;
  store: string;
  id: number;
  brand: string;
  optionId: number;
  unitPrice: number;
  totalPrice: number;
  teamAvailable: boolean;
}

// 기존 인터페이스로 변환
const convertToCartItem = (apiItem: TCartProduct): ICartItem => ({
  id: apiItem.id,
  productId: apiItem.productId,
  productName: apiItem.productName,
  optionName: apiItem.optionName,
  quantity: apiItem.quantity,
  price: apiItem.unitPrice,
  originalPrice: apiItem.unitPrice,
  imageUrl: apiItem.productThumbnail,
  store: apiItem.brand,
  brand: apiItem.brand,
  optionId: apiItem.optionId,
  unitPrice: apiItem.unitPrice,
  totalPrice: apiItem.totalPrice,
  teamAvailable: apiItem.teamAvailable,
  productThumbnail: '',
});

export default function ShoppingCart() {
  const navigate = useNavigate();
  const { openModal } = useModalStore();

  const { cartData, isLoading, isError, deleteSelectedItems, isDeletingMultiple, refetch } = useCart();

  const cartList = useMemo(() => {
    if (!cartData?.products) return [];
    return cartData.products.map(convertToCartItem);
  }, [cartData?.products]);

  const productIds = useMemo(() => cartList.map((item) => item.productId.toString()), [cartList]);

  const { checkedItems, initialize, toggle, toggleAll, isAllChecked, reset } = useProductCheckboxStore();

  useEffect(() => {
    initialize(productIds, false);
  }, [productIds, initialize]);

  const totalPrice = useMemo(() => {
    return cartList.reduce((acc: number, product: ICartItem) => {
      if (checkedItems[product.productId]) {
        return acc + product.totalPrice;
      }
      return acc;
    }, 0);
  }, [cartList, checkedItems]);

  const isAnyChecked = useMemo(() => Object.values(checkedItems).some((v) => v), [checkedItems]);

  const isCartEmpty = cartList.length === 0;

  const handleDeleteSelected = useCallback(() => {
    const itemsToDelete = cartList
      .filter((product) => checkedItems[product.productId])
      .map((product) => ({
        productId: product.productId,
        optionId: product.optionId,
      }));

    deleteSelectedItems(itemsToDelete);
    reset();
  }, [cartList, checkedItems, deleteSelectedItems, reset]);

  const handleOptionChange = useCallback(
    (item: ICartItem) => {
      openModal('cart-option', {
        item,
        onUpdate: () => {
          refetch();
        },
      });
    },
    [openModal, refetch],
  );

  const handleToggleAll = useCallback(() => {
    toggleAll(!isAllChecked());
  }, [toggleAll, isAllChecked]);

  const handleToggleItem = useCallback(
    (productId: string) => {
      toggle(productId);
    },
    [toggle],
  );

  const handleDeleteAlert = useCallback(() => {
    openModal('alert', {
      onDelete: handleDeleteSelected,
      message: '장바구니에서 상품을 삭제할까요?',
    });
  }, [openModal, handleDeleteSelected]);

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return (
      <>
        <header>
          <PageHeaderBar title="장바구니" />
        </header>
        <div className="w-full bg-white text-black pb-32 flex items-center justify-center h-[calc(100vh-56px)]">
          <div className="text-center">
            <p className="text-body-medium mb-4">장바구니를 불러올 수 없습니다.</p>
            <Button kind="basic" variant="outline-orange" onClick={() => refetch()}>
              다시 시도
            </Button>
          </div>
        </div>
        <BottomBar />
      </>
    );
  }

  return (
    <>
      <header>
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
              <BaseCheckbox checked={isAllChecked()} onClick={handleToggleAll} message="전체 선택" textClassName="text-small-medium" disabled={isCartEmpty} />
              <button
                className="ml-auto text-body-regular text-black disabled:text-black-3"
                disabled={!isAnyChecked || isDeletingMultiple}
                onClick={handleDeleteAlert}
              >
                {isDeletingMultiple ? '삭제 중...' : '선택 삭제'}
              </button>
            </section>

            {cartList.map((product) => (
              <section key={`${product.productId}-${product.optionId}`} className="w-full px-4 py-5 border-b-4 border-black-0">
                <div className="flex items-start gap-3">
                  <BaseCheckbox checked={checkedItems[product.productId] || false} onClick={() => handleToggleItem(product.productId.toString())} />
                  <div className="flex-1">
                    <OrderItem item={product} show={false} showPrice={false} />
                  </div>
                </div>

                <div className="flex w-full gap-2 mt-3">
                  <Button
                    kind="select-content"
                    variant={product.teamAvailable ? 'outline-orange' : 'outline-gray'}
                    className={`flex-1 py-1 ${!product.teamAvailable ? 'border-black-1 text-black-2' : ''}`}
                    disabled={!product.teamAvailable}
                  >
                    팀 참여
                  </Button>
                  <Button kind="select-content" variant="outline-gray" className="flex-1 py-1" onClick={() => handleOptionChange(product)}>
                    옵션 변경
                  </Button>
                </div>

                <div className="flex justify-end items-baseline gap-2 mt-3 w-full">
                  {product.originalPrice !== product.price && (
                    <p className="text-black-3 text-small-regular line-through">{product.originalPrice.toLocaleString()} 원</p>
                  )}
                  <p className="text-body-medium">{product.totalPrice.toLocaleString()} 원</p>
                </div>
              </section>
            ))}
          </>
        )}
      </div>

      {!isCartEmpty && (
        <div className="fixed bottom-14 left-0 right-0 w-full max-w-[600px] mx-auto px-4">
          <Button kind="basic" variant="solid-orange" className="w-full" disabled={totalPrice === 0} onClick={() => navigate('/payment')}>
            {totalPrice.toLocaleString()} 원 1인 구매하기
          </Button>
        </div>
      )}

      <BottomBar />
    </>
  );
}
