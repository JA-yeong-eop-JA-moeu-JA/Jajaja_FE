import type { TCartItemRequest, TCartProduct } from '@/types/cart/TCart';

const calculateTotalPrice = (unitPrice: number, quantity: number): number => {
  return unitPrice * quantity;
};

// 기존 장바구니 아이템과 새 아이템을 병합하는 유틸리티 함수
export const mergeCartItems = (currentItems: TCartProduct[], newItem: TCartItemRequest): TCartItemRequest[] => {
  const currentItemsAsRequest: TCartItemRequest[] = currentItems.map((item) => ({
    productId: item.productId,
    optionId: item.optionId,
    quantity: item.quantity,
    unitPrice: item.unitPrice,
    totalPrice: item.totalPrice,
  }));

  // 동일한 상품+옵션 조합 찾기
  const existingItemIndex = currentItemsAsRequest.findIndex((item) => item.productId === newItem.productId && item.optionId === newItem.optionId);

  if (existingItemIndex !== -1) {
    // 기존 아이템이 있으면 수량과 총 가격 누적
    const updatedItems = [...currentItemsAsRequest];
    const existingItem = updatedItems[existingItemIndex];

    updatedItems[existingItemIndex] = {
      ...existingItem,
      quantity: existingItem.quantity + newItem.quantity,
      unitPrice: newItem.unitPrice || existingItem.unitPrice,
      totalPrice: calculateTotalPrice(newItem.unitPrice || existingItem.unitPrice || 0, existingItem.quantity + newItem.quantity),
    };

    return updatedItems;
  } else {
    return [
      ...currentItemsAsRequest,
      {
        ...newItem,
        totalPrice: newItem.totalPrice || calculateTotalPrice(newItem.unitPrice || 0, newItem.quantity),
      },
    ];
  }
};

export const mergeMultipleCartItems = (currentItems: TCartProduct[], newItems: TCartItemRequest[]): TCartItemRequest[] => {
  const initialItems: TCartItemRequest[] = currentItems.map((item) => ({
    productId: item.productId,
    optionId: item.optionId,
    quantity: item.quantity,
    unitPrice: item.unitPrice,
    totalPrice: item.totalPrice,
  }));

  return newItems.reduce((accumulator: TCartItemRequest[], newItem: TCartItemRequest) => {
    const accumulatorAsCartProduct: TCartProduct[] = accumulator.map((item) => ({
      id: 0,
      productId: item.productId,
      productName: '',
      brand: '',
      optionId: item.optionId,
      optionName: '',
      quantity: item.quantity,
      productThumbnail: '',
      unitPrice: item.unitPrice || 0,
      totalPrice: item.totalPrice || 0,
      teamAvailable: false,
    }));

    return mergeCartItems(accumulatorAsCartProduct, newItem);
  }, initialItems);
};
