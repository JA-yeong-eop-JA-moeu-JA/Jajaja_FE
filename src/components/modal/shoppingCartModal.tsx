import { useState } from 'react';

import { OPTIONS } from '@/constants/product/options';

import { useModalStore } from '@/stores/modalStore';

import { SelectButton } from '@/components/common/button/selectButton';

import DropDown from './dropDown';

import Minus from '@/assets/icons/minus.svg?react';
import Plus from '@/assets/icons/plus.svg?react';
import type { ICartItem } from '@/pages/shoppingCart';

interface ICartModalProps {
  item: ICartItem;
  onUpdate: (item: ICartItem) => void;
}

export default function CartModal({ item, onUpdate }: ICartModalProps) {
  const { closeModal } = useModalStore();

  // 기존 아이템을 초기값으로 설정
  const [selectedItems, setSelectedItems] = useState<{ id: number; name: string; price: number; quantity: number }[]>([
    {
      id: item.productId,
      name: item.name,
      price: item.price,
      quantity: item.quantity || 1,
    },
  ]);

  const handleSelect = (selectedId: number) => {
    const found = OPTIONS.find(({ id }) => id === selectedId);
    if (!found) return;

    setSelectedItems([
      {
        id: item.productId,
        name: found.name,
        price: found.price,
        quantity: selectedItems[0]?.quantity || 1,
      },
    ]);
  };

  const handleCalculate = (id: number, offset: number) => {
    setSelectedItems((prev) =>
      prev.map((selectedItem) => (selectedItem.id === id ? { ...selectedItem, quantity: Math.max(selectedItem.quantity + offset, 1) } : selectedItem)),
    );
  };

  const handleSave = () => {
    if (selectedItems.length > 0) {
      const updatedItem = {
        ...item,
        quantity: selectedItems[0].quantity,
        price: selectedItems[0].price,
        name: selectedItems[0].name,
      };
      onUpdate(updatedItem);
    }
    closeModal();
  };

  return (
    <div className="h-full pb-2 flex flex-col gap-4 select-none">
      <div className="flex px-4 flex-col gap-2">
        <DropDown options={OPTIONS} onChange={({ id }) => handleSelect(id)} />

        {selectedItems.length > 0 && (
          <div className="flex flex-col gap-3">
            {selectedItems.map(({ id, name, price, quantity }) => (
              <div key={id} className="rounded-sm w-full min-h-22 bg-black-0 px-4 pt-5 pb-4 relative flex flex-col gap-3">
                <p className="text-body-regular">{name}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center w-21 h-6 border border-black-2">
                    <div className="flex items-center justify-center w-6 h-full cursor-pointer" onClick={() => handleCalculate(id, -1)}>
                      <Minus />
                    </div>
                    <div className="flex items-center justify-center w-9 h-full border-x border-black-2 text-small-regular">{quantity}</div>
                    <div className="flex items-center justify-center w-6 h-full cursor-pointer" onClick={() => handleCalculate(id, 1)}>
                      <Plus />
                    </div>
                  </div>
                  <p className="text-body-medium">{(price * quantity).toLocaleString()} 원</p>
                </div>
              </div>
            ))}
            <div className="flex justify-between items-center text-small-medium px-2">
              <p>총 {selectedItems.reduce((acc, selectedItem) => acc + selectedItem.quantity, 0)}개</p>
              <p>{selectedItems.reduce((acc, selectedItem) => acc + selectedItem.price * selectedItem.quantity, 0).toLocaleString()} 원</p>
            </div>
          </div>
        )}
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
