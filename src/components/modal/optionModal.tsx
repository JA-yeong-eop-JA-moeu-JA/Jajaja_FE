import { useState } from 'react';

import { OPTIONS } from '@/constants/product/options';

import { useModalStore } from '@/stores/modalStore';

import DropDown from './dropDown';

import Cart from '@/assets/icons/cartBtn.svg?react';
import Close from '@/assets/icons/delete.svg?react';
import Minus from '@/assets/icons/minus.svg?react';
import Plus from '@/assets/icons/plus.svg?react';

export default function OptionModal({ type }: { type?: string }) {
  const { closeModal } = useModalStore();
  const [selectedItems, setSelectedItems] = useState<{ id: number; name: string; price: number; quantity: number }[]>([]);
  const isTeam = type === 'team';
  const handleSelect = (selectedId: number) => {
    const found = OPTIONS.find(({ id }) => id === selectedId);
    if (!found) return;

    setSelectedItems((prev) => {
      const existing = prev.find((item) => item.id === selectedId);
      if (existing) {
        return prev.map((item) => (item.id === selectedId ? { ...item, quantity: item.quantity + 1 } : item));
      } else {
        return [...prev, { ...found, quantity: 1 }];
      }
    });
  };
  const handleCalculate = (id: number, offset: number) => {
    setSelectedItems((prev) => prev.map((item) => (item.id === id ? { ...item, quantity: Math.max(item.quantity + offset, 1) } : item)));
  };
  const handleRemove = (id: number) => {
    setSelectedItems((prev) => prev.filter((item) => item.id !== id));
  };
  const totalQuantity = selectedItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = selectedItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="h-full px-4 pb-2 flex flex-col gap-7">
      <div className="flex flex-col gap-2">
        <DropDown options={OPTIONS} onChange={({ id }) => handleSelect(id)} />

        {selectedItems.length > 0 && (
          <div className="flex flex-col gap-3">
            {selectedItems.map(({ id, name, price, quantity }) => (
              <div key={id} className="rounded-sm w-full min-h-22 bg-black-0 px-4 pt-5 pb-4 relative flex flex-col gap-3">
                <Close className="w-8 h-8 absolute top-2 right-2 cursor-pointer" onClick={() => handleRemove(id)} />
                <p className="text-body-regular">{name}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center w-21 h-6 border border-black-2">
                    <div className="flex items-center justify-center w-6 h-full cursor-pointer" onClick={() => handleCalculate(id, -1)}>
                      <Minus />
                    </div>
                    <div className="select-none flex items-center justify-center w-9 h-full border-x border-black-2 text-small-regular">{quantity}</div>
                    <div className="flex items-center justify-center w-6 h-full cursor-pointer" onClick={() => handleCalculate(id, 1)}>
                      <Plus />
                    </div>
                  </div>
                  <p className="select-none text-body-medium">{(price * quantity).toLocaleString()} 원</p>
                </div>
              </div>
            ))}

            <div className="flex justify-between items-center text-small-medium">
              <div className="flex items-center gap-2">
                <p>총 {totalQuantity}개</p>
                <p className="text-orange">팀 구매하면 2,290원 저렴해요!</p>
              </div>
              <p>{totalPrice.toLocaleString()} 원</p>
            </div>
          </div>
        )}
      </div>
      <div className="flex items-center gap-4">
        <Cart />
        <button
          className={`w-full h-12 flex justify-center items-center rounded-sm text-body-medium text-white ${isTeam ? 'bg-black' : 'bg-orange'}`}
          onClick={() => closeModal()}
        >
          {isTeam ? '1인 구매하기' : '팀 생성하기'}
        </button>
      </div>
    </div>
  );
}
