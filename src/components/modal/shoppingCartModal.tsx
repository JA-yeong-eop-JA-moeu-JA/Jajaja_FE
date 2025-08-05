import { useState } from 'react';

import type { TCartItem } from '@/types/cart/Tcart';
import { OPTIONS } from '@/constants/product/options';

import { useModalStore } from '@/stores/modalStore';

import { SelectButton } from '@/components/common/button/selectButton';

import DropDown from './dropDown';

import Minus from '@/assets/icons/minus.svg?react';
import Plus from '@/assets/icons/plus.svg?react';

interface ICartModalProps {
  item: TCartItem;
  onUpdate: (item: TCartItem) => void;
}

export default function CartModal({ item, onUpdate }: ICartModalProps) {
  const { closeModal } = useModalStore();

  const [selectedItem, setSelectedItem] = useState<TCartItem>({
    ...item,
    quantity: item.quantity || 1,
  });

  const handleSelect = (selectedId: number) => {
    const found = OPTIONS.find(({ id }) => id === selectedId);
    if (!found) return;

    setSelectedItem({
      ...selectedItem,
      name: found.name,
      price: found.price,
    });
  };

  const handleCalculate = (offset: number) => {
    setSelectedItem((prev: TCartItem) => ({
      ...prev,
      quantity: Math.max((prev.quantity || 1) + offset, 1),
    }));
  };

  const handleSave = () => {
    onUpdate(selectedItem);
    closeModal();
  };

  return (
    <div className="h-full pb-2 flex flex-col gap-4 select-none">
      <div className="flex px-4 flex-col gap-2">
        <DropDown options={OPTIONS} onChange={({ id }) => handleSelect(id)} />

        <div className="flex flex-col gap-3">
          <div className="rounded-sm w-full min-h-22 bg-black-0 px-4 pt-5 pb-4 relative flex flex-col gap-3">
            <p className="text-body-regular">{selectedItem.name}</p>
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
              <p className="text-body-medium">{((selectedItem.price ?? selectedItem.unitPrice) * (selectedItem.quantity || 1)).toLocaleString()} 원</p>
            </div>
          </div>

          <div className="flex justify-between items-center text-small-medium px-2">
            <p>총 {selectedItem.quantity || 1}개</p>
            <p>{((selectedItem.price ?? 0) * ((selectedItem.quantity ?? 0) || 1)).toLocaleString()} 원</p>
          </div>
        </div>
      </div>

      <div className="w-full">
        <SelectButton
          kind="select-bottom"
          leftText="취소"
          rightText="변경하기"
          leftVariant="left-outline"
          rightVariant="right-orange"
          onLeftClick={closeModal}
          onRightClick={handleSave}
        />
      </div>
    </div>
  );
}
