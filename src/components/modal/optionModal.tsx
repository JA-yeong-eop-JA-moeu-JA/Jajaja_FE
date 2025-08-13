import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';

import type { TOrderType, TPaymentData, TPaymentItem } from '@/types/cart/TCart';

import { useModalStore } from '@/stores/modalStore';
import { useCart } from '@/hooks/cart/useCartQuery';
import useGetOption from '@/hooks/product/useGetOption';

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
  const { addItem } = useCart();

  const [selectedItems, setSelectedItems] = useState<
    {
      id: number;
      name: string;
      originPrice: number;
      unitPrice: number;
      quantity: number;
    }[]
  >([]);

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

  const handleAddToCart = async () => {
    if (selectedItems.length === 0) {
      toast.error('옵션을 선택해주세요');
      return;
    }

    try {
      for (const item of selectedItems) {
        await addItem({
          productId,
          optionId: item.id,
          quantity: item.quantity,
          unitPrice: isTeam ? item.unitPrice : item.originPrice,
        });
      }
      closeModal();
      toast.success('장바구니에 상품이 담겼습니다');
    } catch (error) {
      console.error('Cart add failed:', error);
      toast.error('장바구니 담기에 실패했습니다');
    }
  };

  const handleDirectPurchase = (orderType: TOrderType) => {
    if (selectedItems.length === 0) {
      toast.error('옵션을 선택해주세요');
      return;
    }

    const paymentItems: TPaymentItem[] = selectedItems.map((item) => ({
      id: 0, // 장바구니에 없는 상품이므로 0
      productId,
      optionId: item.id,
      quantity: item.quantity,
      unitPrice: isTeam ? item.unitPrice : item.originPrice,
      teamPrice: item.unitPrice,
      individualPrice: item.originPrice,
      productName: data?.result.find((opt) => opt.id === item.id)?.name || '',
      optionName: item.name,
      productThumbnail: '',
    }));

    const paymentData: TPaymentData = {
      orderType,
      selectedItems: paymentItems,
    };

    navigate('/payment', { state: paymentData });
    closeModal();
  };

  const handleTeamCreate = () => {
    handleDirectPurchase('team_create');
  };

  const handleIndividualPurchase = () => {
    handleDirectPurchase('individual');
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
        <div className="min-w-16 h-12 flex items-center justify-center rounded-sm border border-black-4 cursor-pointer" onClick={handleAddToCart}>
          <Cart />
        </div>
        {isTeam ? (
          <button
            className="w-full h-12 flex justify-center items-center rounded-sm text-body-medium text-white bg-black disabled:opacity-50"
            disabled={selectedItems.length === 0}
            onClick={handleIndividualPurchase}
          >
            1인 구매하기
          </button>
        ) : (
          <button
            className="w-full h-12 flex justify-center items-center rounded-sm text-body-medium text-white bg-orange disabled:opacity-50"
            disabled={selectedItems.length === 0}
            onClick={handleTeamCreate}
          >
            팀 생성하기
          </button>
        )}
      </div>
    </div>
  );
}
