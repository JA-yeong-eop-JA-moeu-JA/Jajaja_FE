import { useCallback, useMemo, useState } from 'react';

import { QUERY_KEYS } from '@/constants/querykeys/queryKeys';

import { getOptionList } from '@/apis/product/option';

import { useModalStore } from '@/stores/modalStore';
import { useCart } from '@/hooks/cart/useCartQuery';
import { useCoreQuery } from '@/hooks/customQuery';

import { SelectButton } from '@/components/common/button/selectButton';

import DropDown from './dropDown';

import Close from '@/assets/icons/close.svg?react';
import Minus from '@/assets/icons/minus.svg?react';
import Plus from '@/assets/icons/plus.svg?react';
import type { ICartItem } from '@/pages/shoppingCart';

interface ICartModalProps {
  item: ICartItem;
  onUpdate?: (item: ICartItem) => void;
}

const useCartProductOptions = (productId: number) => {
  return useCoreQuery(QUERY_KEYS.GET_PRODUCT_OPTIONS(productId), () => getOptionList({ productId }), {
    enabled: !!productId,
    staleTime: 1000 * 60 * 10, // 10분
  });
};

interface ISelectedOption {
  optionId: number;
  optionName: string;
  unitPrice: number;
  quantity: number;
}

export default function CartModal({ item, onUpdate }: ICartModalProps) {
  const { closeModal } = useModalStore();
  const { updateItem, addItem, deleteItem, cartData, isAdding } = useCart();

  const { data: optionsData, isLoading: isLoadingOptions } = useCartProductOptions(item.productId);

  const cartItems = useMemo(() => {
    return cartData?.products || [];
  }, [cartData]);

  const currentProductCartItems = useMemo(() => {
    return cartItems.filter((cartItem) => cartItem.productId === item.productId);
  }, [cartItems, item.productId]);

  const [selectedOptions, setSelectedOptions] = useState<ISelectedOption[]>(() =>
    currentProductCartItems.map((cartItem) => ({
      optionId: cartItem.optionId,
      optionName: cartItem.optionName,
      unitPrice: cartItem.unitPrice,
      quantity: cartItem.quantity,
    })),
  );

  const formattedOptions = useMemo(() => {
    if (!optionsData?.result) return [];

    return optionsData.result.map((option) => ({
      id: option.id,
      name: option.name,
      price: option.unitPrice,
      originPrice: option.originPrice,
      unitPrice: option.unitPrice,
    }));
  }, [optionsData]);

  // 새 옵션 추가
  const handleAddOption = useCallback(
    (optionId: number) => {
      if (optionId === 0) return;

      const found = formattedOptions.find((option) => option.id === optionId);
      if (!found) return;

      // 이미 있는 옵션인지 확인
      const existingIndex = selectedOptions.findIndex((opt) => opt.optionId === optionId);

      if (existingIndex >= 0) {
        // 이미 있으면 수량 증가
        setSelectedOptions((prev) => prev.map((opt, idx) => (idx === existingIndex ? { ...opt, quantity: opt.quantity + 1 } : opt)));
      } else {
        // 새 옵션 추가
        setSelectedOptions((prev) => [
          ...prev,
          {
            optionId: found.id,
            optionName: found.name,
            unitPrice: found.unitPrice,
            quantity: 1,
          },
        ]);
      }
    },
    [formattedOptions, selectedOptions],
  );

  // 수량 변경
  const handleQuantityChange = useCallback((index: number, offset: number) => {
    setSelectedOptions((prev) => prev.map((opt, idx) => (idx === index ? { ...opt, quantity: Math.max(1, opt.quantity + offset) } : opt)));
  }, []);

  // 옵션 제거
  const handleRemoveOption = useCallback((index: number) => {
    setSelectedOptions((prev) => prev.filter((_, idx) => idx !== index));
  }, []);

  const totalPrice = useMemo(() => {
    return selectedOptions.reduce((acc, opt) => acc + opt.unitPrice * opt.quantity, 0);
  }, [selectedOptions]);

  const totalQuantity = useMemo(() => {
    return selectedOptions.reduce((acc, opt) => acc + opt.quantity, 0);
  }, [selectedOptions]);

  const handleSave = useCallback(() => {
    try {
      currentProductCartItems.forEach((cartItem) => {
        deleteItem({
          productId: cartItem.productId,
          optionId: cartItem.optionId,
        });
      });

      selectedOptions.forEach((option) => {
        addItem({
          productId: item.productId,
          optionId: option.optionId,
          quantity: option.quantity,
        });
      });

      onUpdate?.(item);
      closeModal();
    } catch (error) {
      console.error('장바구니 업데이트 실패:', error);
    }
  }, [selectedOptions, currentProductCartItems, deleteItem, addItem, item, onUpdate, closeModal]);

  if (isLoadingOptions) {
    return (
      <div className="h-full pb-2 flex flex-col gap-4 select-none">
        <div className="flex items-center justify-center h-32">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange mx-auto mb-4" />
            <p className="text-body-regular text-black-4">{item.productName}의 옵션을 불러오는 중...</p>
          </div>
        </div>
      </div>
    );
  }

  // 옵션 없음
  if (!formattedOptions.length) {
    return (
      <div className="h-full pb-2 flex flex-col gap-4 select-none">
        <div className="flex items-center justify-center h-32">
          <p className="text-body-regular text-black-4">{item.productName}의 사용 가능한 옵션이 없습니다.</p>
        </div>
        <div className="w-full">
          <SelectButton
            kind="select-bottom"
            leftText="닫기"
            rightText=""
            leftVariant="left-outline"
            rightVariant="right-orange"
            onLeftClick={closeModal}
            onRightClick={closeModal}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="h-full pb-2 flex flex-col gap-4 select-none">
      <div className="px-4">
        <DropDown options={formattedOptions} value={0} onChange={({ id }) => handleAddOption(id)} />
      </div>

      <div className="flex-1 px-4 space-y-3 max-h-60 overflow-y-auto">
        {selectedOptions.map((option, index) => (
          <div key={`${option.optionId}-${index}`} className="bg-black-0 rounded p-4 relative">
            <button className="absolute top-2 right-2 p-1" onClick={() => handleRemoveOption(index)}>
              <Close className="w-4 h-4 text-black-3" />
            </button>

            <p className="text-body-regular mb-3 pr-6">{option.optionName}</p>

            <div className="flex items-center justify-between">
              <div className="flex items-center w-21 h-6 border border-black-2">
                <div className="flex items-center justify-center w-6 h-full cursor-pointer" onClick={() => handleQuantityChange(index, -1)}>
                  <Minus />
                </div>
                <div className="flex items-center justify-center w-9 h-full border-x border-black-2 text-small-regular">{option.quantity}</div>
                <div className="flex items-center justify-center w-6 h-full cursor-pointer" onClick={() => handleQuantityChange(index, 1)}>
                  <Plus />
                </div>
              </div>
              <p className="text-body-medium">{(option.unitPrice * option.quantity).toLocaleString()} 원</p>
            </div>
          </div>
        ))}
      </div>

      <div className="px-4 py-3 bg-black-0 mx-4 rounded">
        <div className="flex justify-between items-center">
          <p className="text-small-medium">총 {totalQuantity}개</p>
          <p className="text-body-medium font-bold">{totalPrice.toLocaleString()} 원</p>
        </div>
      </div>

      <div className="w-full px-4">
        {isAdding ? (
          <div className="w-full h-12 flex justify-center items-center bg-black-2 rounded text-body-medium text-black-4">변경 중...</div>
        ) : (
          <SelectButton
            kind="select-bottom"
            leftText="취소"
            rightText="변경하기"
            leftVariant="left-outline"
            rightVariant="right-orange"
            onLeftClick={closeModal}
            onRightClick={handleSave}
            disabled={selectedOptions.length === 0}
          />
        )}
      </div>
    </div>
  );
}
