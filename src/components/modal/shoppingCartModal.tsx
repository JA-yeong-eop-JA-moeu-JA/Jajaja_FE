import { useCallback, useMemo, useState } from 'react';

import { QUERY_KEYS } from '@/constants/querykeys/queryKeys';

import { getOptionList } from '@/apis/product/option';

import { useModalStore } from '@/stores/modalStore';
import { useCart } from '@/hooks/cart/useCartQuery';
import { useCoreQuery } from '@/hooks/customQuery';

import { SelectButton } from '@/components/common/button/selectButton';

import DropDown from './dropDown';

import Minus from '@/assets/icons/minus.svg?react';
import Plus from '@/assets/icons/plus.svg?react';
import type { ICartItem } from '@/pages/shoppingCart';

interface ICartModalProps {
  item: ICartItem;
  onUpdate?: (item: ICartItem) => void;
}

const useCartProductOptions = (productId: number) => {
  return useCoreQuery(QUERY_KEYS.GET_PRODUCT_OPTION, () => getOptionList({ productId }), {
    enabled: !!productId,
    staleTime: 1000 * 60 * 10, // 10분
  });
};

export default function CartModal({ item, onUpdate }: ICartModalProps) {
  const { closeModal } = useModalStore();
  const { updateItem, isAdding } = useCart();

  const { data: optionsData, isLoading: isLoadingOptions } = useCartProductOptions(item.productId);

  const [selectedItem, setSelectedItem] = useState<ICartItem>({
    ...item,
    quantity: item.quantity || 1,
  });

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

  // 옵션 선택 핸들러
  const handleSelect = useCallback(
    (selectedId: number) => {
      const found = formattedOptions.find((option) => option.id === selectedId);
      if (!found) return;

      setSelectedItem((prev) => ({
        ...prev,
        optionId: found.id,
        optionName: found.name,
        unitPrice: found.unitPrice,
        price: found.unitPrice,
      }));
    },
    [formattedOptions],
  );

  const handleCalculate = useCallback((offset: number) => {
    setSelectedItem((prev) => ({
      ...prev,
      quantity: Math.max((prev.quantity || 1) + offset, 1),
    }));
  }, []);

  const handleSave = useCallback(() => {
    const requestData = {
      productId: selectedItem.productId,
      optionId: selectedItem.optionId,
      quantity: selectedItem.quantity,
    };

    if (!requestData.productId) {
      console.error('productId가 없습니다! (필수 필드)', requestData);
      alert('상품 정보가 없습니다.');
      return;
    }

    if (!requestData.optionId) {
      console.error('optionId가 없습니다! (필수 필드)', requestData);
      alert('옵션을 선택해주세요.');
      return;
    }

    if (!requestData.quantity || requestData.quantity < 1) {
      console.error('quantity가 유효하지 않습니다! (최소값: 1)', requestData);
      alert('수량은 1개 이상이어야 합니다.');
      return;
    }

    const isValidOption = formattedOptions.some((option) => option.id === requestData.optionId);
    if (!isValidOption) {
      console.error('유효하지 않은 optionId입니다!', {
        selectedOptionId: requestData.optionId,
        availableOptions: formattedOptions,
      });
      alert('선택한 옵션이 유효하지 않습니다. 다시 선택해주세요.');
      return;
    }

    try {
      updateItem(requestData);
      onUpdate?.(selectedItem);
      closeModal();
    } catch (error) {
      console.error('장바구니 아이템 업데이트 실패:', error);
    }
  }, [selectedItem, updateItem, onUpdate, closeModal, item, formattedOptions]);

  const totalPrice = (selectedItem.unitPrice || selectedItem.price) * (selectedItem.quantity || 1);

  // 옵션 로딩 스피너
  if (isLoadingOptions) {
    return (
      <div className="h-full pb-2 flex flex-col gap-4 select-none">
        <div className="flex items-center justify-center h-32">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange mx-auto mb-4" />
            <p className="text-body-regular text-black-4">옵션을 불러오는 중...</p>
          </div>
        </div>
      </div>
    );
  }

  // 옵션이 없을 때
  if (!formattedOptions.length) {
    return (
      <div className="h-full pb-2 flex flex-col gap-4 select-none">
        <div className="flex items-center justify-center h-32">
          <p className="text-body-regular text-black-4">사용 가능한 옵션이 없습니다.</p>
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
      <div className="flex px-4 flex-col gap-2">
        <DropDown options={formattedOptions} onChange={({ id }) => handleSelect(id)} />

        <div className="flex flex-col gap-3">
          <div className="rounded-sm w-full min-h-22 bg-black-0 px-4 pt-5 pb-4 relative flex flex-col gap-3">
            <p className="text-body-regular">{selectedItem.optionName}</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center w-21 h-6 border border-black-2">
                <div className="flex items-center justify-center w-6 h-full cursor-pointer" onClick={() => handleCalculate(-1)}>
                  <Minus />
                </div>
                <div className="flex items-center justify-center w-9 h-full border-x border-black-2 text-small-regular">{selectedItem.quantity || 1}</div>
                <div className="flex items-center justify-center w-6 h-full cursor-pointer" onClick={() => handleCalculate(1)}>
                  <Plus />
                </div>
              </div>
              <p className="text-body-medium">{totalPrice.toLocaleString()} 원</p>
            </div>
          </div>

          <div className="flex justify-between items-center text-small-medium px-2">
            <p>총 {selectedItem.quantity || 1}개</p>
            <p>{totalPrice.toLocaleString()} 원</p>
          </div>
        </div>
      </div>

      <div className="w-full">
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
          />
        )}
      </div>
    </div>
  );
}
