import { useCallback, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import type { TCartProduct, TPaymentData, TPaymentItem } from '@/types/cart/TCart';

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

interface IGroupedCartItem {
  productId: number;
  productName: string;
  brand: string;
  imageUrl: string;
  options: ICartItem[];
}

export default function ShoppingCart() {
  const navigate = useNavigate();
  const { openModal } = useModalStore();

  const { cartData, isLoading, isError, deleteSelectedItems, isDeletingMultiple, refetch } = useCart();

  const cartList = useMemo(() => {
    if (!cartData?.products) return [];
    return cartData.products.map(convertToCartItem);
  }, [cartData?.products]);

  const groupedCartItems = useMemo(() => {
    const groups: Record<number, IGroupedCartItem> = {};

    cartList.forEach((item) => {
      if (!groups[item.productId]) {
        groups[item.productId] = {
          productId: item.productId,
          productName: item.productName,
          brand: item.brand,
          imageUrl: item.imageUrl,
          options: [],
        };
      }
      groups[item.productId].options.push(item);
    });

    Object.values(groups).forEach((group) => {
      group.options.sort((a, b) => a.optionName.localeCompare(b.optionName));
    });

    return Object.values(groups).sort((a, b) => a.productName.localeCompare(b.productName));
  }, [cartList]);

  const productIds = useMemo(() => cartList.map((item) => `${item.productId}-${item.optionId}`), [cartList]);

  const { checkedItems, initialize, toggle, toggleAll, isAllChecked, reset } = useProductCheckboxStore();

  useEffect(() => {
    initialize(productIds, false);
  }, [productIds, initialize]);

  const totalPrice = useMemo(() => {
    return cartList.reduce((acc: number, product: ICartItem) => {
      const itemKey = `${product.productId}-${product.optionId}`;
      if (checkedItems[itemKey]) {
        return acc + product.totalPrice;
      }
      return acc;
    }, 0);
  }, [cartList, checkedItems]);

  const isAnyChecked = useMemo(() => Object.values(checkedItems).some((v) => v), [checkedItems]);

  const isCartEmpty = cartList.length === 0;

  const handleDeleteSelected = useCallback(() => {
    const itemsToDelete = cartList
      .filter((product) => {
        const itemKey = `${product.productId}-${product.optionId}`;
        return checkedItems[itemKey];
      })
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
    (productId: number, optionId: number) => {
      const itemKey = `${productId}-${optionId}`;
      toggle(itemKey);
    },
    [toggle],
  );

  const handleDeleteAlert = useCallback(() => {
    openModal('alert', {
      onDelete: handleDeleteSelected,
      message: '장바구니에서 상품을 삭제할까요?',
    });
  }, [openModal, handleDeleteSelected]);

  const handleTeamJoin = useCallback(
    (productId: number) => {
      const selectedOptions = groupedCartItems
        .find((group) => group.productId === productId)
        ?.options.filter((option) => {
          const itemKey = `${option.productId}-${option.optionId}`;
          return checkedItems[itemKey];
        });

      if (!selectedOptions || selectedOptions.length === 0) {
        toast.error('구매할 상품을 선택해주세요');
        return;
      }

      const paymentItems: TPaymentItem[] = selectedOptions.map((option) => ({
        productId: option.productId,
        optionId: option.optionId,
        quantity: option.quantity,
        unitPrice: option.unitPrice,
        teamPrice: option.unitPrice,
        individualPrice: option.price,
        productName: option.productName,
        optionName: option.optionName,
        productThumbnail: option.imageUrl,
      }));

      const paymentData: TPaymentData = {
        purchaseType: 'team_join',
        selectedItems: paymentItems,
      };

      navigate('/payment', { state: paymentData });
    },
    [groupedCartItems, checkedItems, navigate],
  );

  const handleIndividualPurchase = useCallback(() => {
    const selectedItems = cartList.filter((product) => {
      const itemKey = `${product.productId}-${product.optionId}`;
      return checkedItems[itemKey];
    });

    if (selectedItems.length === 0) {
      toast.error('구매할 상품을 선택해주세요');
      return;
    }

    const paymentItems: TPaymentItem[] = selectedItems.map((item) => ({
      productId: item.productId,
      optionId: item.optionId,
      quantity: item.quantity,
      unitPrice: item.price,
      teamPrice: item.unitPrice,
      individualPrice: item.price,
      productName: item.productName,
      optionName: item.optionName,
      productThumbnail: item.imageUrl,
    }));

    const paymentData: TPaymentData = {
      purchaseType: 'individual',
      selectedItems: paymentItems,
    };

    navigate('/payment', { state: paymentData });
  }, [cartList, checkedItems, navigate]);

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

            {groupedCartItems.map((group) => {
              const groupTotalPrice = group.options.reduce((acc, option) => acc + option.totalPrice, 0);
              const groupTotalQuantity = group.options.reduce((acc, option) => acc + option.quantity, 0);

              return (
                <section key={group.productId} className="w-full border-b-4 border-black-0">
                  {group.options.map((product, index) => {
                    const itemKey = `${product.productId}-${product.optionId}`;
                    const isChecked = checkedItems[itemKey] || false;

                    return (
                      <div key={itemKey} className={`px-4 py-5 ${index < group.options.length - 1 ? 'border-b border-black-1' : ''}`}>
                        <div className="flex items-start gap-3">
                          <BaseCheckbox checked={isChecked} onClick={() => handleToggleItem(product.productId, product.optionId)} />
                          <div className="flex-1">
                            <OrderItem item={product} show={false} showPrice={false} />
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  <div className="px-4 pb-3">
                    <div className="flex w-full gap-2">
                      <Button
                        kind="select-content"
                        variant={group.options.some((option) => option.teamAvailable) ? 'outline-orange' : 'outline-gray'}
                        className={`flex-1 py-1 ${!group.options.some((option) => option.teamAvailable) ? 'border-black-1 text-black-2' : ''}`}
                        onClick={() => handleTeamJoin(group.productId)}
                        disabled={!group.options.some((option) => option.teamAvailable)}
                      >
                        팀 참여
                      </Button>
                      <Button kind="select-content" variant="outline-gray" className="flex-1 py-1" onClick={() => handleOptionChange(group.options[0])}>
                        옵션 변경
                      </Button>
                    </div>
                  </div>

                  <div className="px-4 py-3 flex justify-between items-center">
                    <p className="text-small-medium text-black-4">총 {groupTotalQuantity}개</p>
                    <p className="text-body-medium">{groupTotalPrice.toLocaleString()} 원</p>
                  </div>
                </section>
              );
            })}
          </>
        )}
      </div>

      {!isCartEmpty && (
        <div className="fixed bottom-14 left-0 right-0 w-full max-w-[600px] mx-auto px-4">
          <Button kind="basic" variant="solid-orange" className="w-full" disabled={totalPrice === 0} onClick={handleIndividualPurchase}>
            {totalPrice.toLocaleString()} 원 1인 구매하기
          </Button>
        </div>
      )}

      <BottomBar />
    </>
  );
}
