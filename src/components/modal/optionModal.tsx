import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { useModalStore } from '@/stores/modalStore';
import useGetOption from '@/hooks/product/useGetOption';
import useMakeTeam from '@/hooks/product/useMakeTeam';

import DropDown from './dropDown';

import Cart from '@/assets/icons/cartBtn.svg?react';
import Close from '@/assets/icons/delete.svg?react';
import Minus from '@/assets/icons/minus.svg?react';
import Plus from '@/assets/icons/plus.svg?react';

export default function OptionModal({ type }: { type?: string }) {
  const navigate = useNavigate();
  const { data } = useGetOption();
  const { closeModal } = useModalStore();
  const { id: product } = useParams<{ id: string }>();
  const productId = Number(product);
  const { mutate } = useMakeTeam();
  const [selectedItems, setSelectedItems] = useState<{ id: number; name: string; originPrice: number; unitPrice: number; quantity: number }[]>([]);
  const isTeam = type === 'team';
  const handleSelect = (selectedId: number) => {
    const found = data?.result.find(({ id: optionId }) => optionId === selectedId);
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
  const handleTeam = () => {
    mutate({ productId });
    closeModal();
  };

  const totalQuantity = selectedItems.reduce((acc, item) => acc + item.quantity, 0);
  const originTotalPrice = selectedItems.reduce((acc, item) => acc + item.originPrice * item.quantity, 0);
  const unitTotalPrice = selectedItems.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);
  const diff = originTotalPrice - unitTotalPrice;
  return (
    <div className="h-full px-4 pb-2 flex flex-col gap-7 select-none">
      <div className="flex flex-col gap-2">
        <DropDown options={data?.result} onChange={({ id }) => handleSelect(id)} />

        {selectedItems.length > 0 && (
          <div className="flex flex-col gap-3">
            {selectedItems.map(({ id, name, originPrice, unitPrice, quantity }) => (
              <div key={id} className="rounded-sm w-full min-h-22 bg-black-0 px-4 pt-5 pb-4 relative flex flex-col gap-3">
                <Close className="w-2 h-2 absolute top-2 right-2 cursor-pointer" onClick={() => handleRemove(id)} />
                <p className="text-body-regular">{name}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center w-21 h-6 border border-black-2 bg-white">
                    <div className="flex items-center justify-center w-6 h-full cursor-pointer" onClick={() => handleCalculate(id, -1)}>
                      <Minus />
                    </div>
                    <div className="flex items-center justify-center w-9 h-full border-x border-black-2 text-small-regular">{quantity}</div>
                    <div className="flex items-center justify-center w-6 h-full cursor-pointer" onClick={() => handleCalculate(id, 1)}>
                      <Plus />
                    </div>
                  </div>
                  <p className="text-body-medium">{((isTeam ? unitPrice : originPrice) * quantity).toLocaleString()} 원</p>
                </div>
              </div>
            ))}

            <div className="flex justify-between items-center text-small-medium">
              <div className="flex items-center gap-2">
                <p>총 {totalQuantity}개</p>
                {isTeam ? (
                  <p className="text-orange">1인 구매보다 {diff.toLocaleString()}원 저렴해요!</p>
                ) : (
                  <p className="text-orange">팀 구매하면 {diff.toLocaleString()}원 저렴해요!</p>
                )}
              </div>
              <p>{isTeam ? unitTotalPrice.toLocaleString() : originTotalPrice.toLocaleString()} 원</p>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <div
          className="min-w-16 h-12 flex items-center justify-center rounded-sm border border-black-4"
          onClick={() => {
            closeModal();
            navigate('/shoppingcart');
          }}
        >
          <Cart />
        </div>
        {isTeam ? (
          <button className="w-full h-12 flex justify-center items-center rounded-sm text-body-medium text-white bg-black" onClick={() => closeModal()}>
            1인 구매하기
          </button>
        ) : (
          <button className="w-full h-12 flex justify-center items-center rounded-sm text-body-medium text-white bg-orange" onClick={handleTeam}>
            팀 생성하기
          </button>
        )}
      </div>
    </div>
  );
}
