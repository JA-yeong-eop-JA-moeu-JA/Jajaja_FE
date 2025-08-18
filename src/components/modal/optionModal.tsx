import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';

import type { TCartItemRequest, TOrderType, TPaymentData } from '@/types/cart/TCart';

import { useModalStore } from '@/stores/modalStore';
import { useCart } from '@/hooks/cart/useCartQuery';
import useGetOption from '@/hooks/product/useGetOption';
import useGetProductDetail from '@/hooks/product/useGetProductDetail';
import useMakeTeam from '@/hooks/product/useMakeTeam';

import DropDown from './dropDown';

import Cart from '@/assets/icons/cartBtn.svg?react';
import Close from '@/assets/icons/delete.svg?react';
import Minus from '@/assets/icons/minus.svg?react';
import Plus from '@/assets/icons/plus.svg?react';

interface IOptionModalProps {
  type?: string;
  teamId?: number;
  mode?: string;
}

export default function OptionModal({ type, teamId, mode }: IOptionModalProps) {
  const navigate = useNavigate();
  const { data: optionData } = useGetOption();
  const { data: productData } = useGetProductDetail();
  const { closeModal } = useModalStore();
  const { id: product } = useParams<{ id: string }>();
  const productId = Number(product);
  const { addMultipleItems, isAddingMultiple } = useCart();
  const { makeTeamMutateAsync, isTeamCreating } = useMakeTeam();

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
  const isTeamJoin = mode === 'team_join';

  const shouldUseTeamPrice = !isTeam || isTeamJoin;

  const handleSelect = (selectedId: number) => {
    const found = optionData?.result.find(({ id: optionId }) => optionId === selectedId);
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
      const cartItems: TCartItemRequest[] = selectedItems.map((item) => ({
        productId,
        optionId: item.id,
        quantity: item.quantity,
        unitPrice: shouldUseTeamPrice ? item.unitPrice : item.originPrice,
        totalPrice: (shouldUseTeamPrice ? item.unitPrice : item.originPrice) * item.quantity,
      }));

      await addMultipleItems(cartItems);

      closeModal();
      toast.success('장바구니에 상품이 담겼습니다');
    } catch {
      toast.error('장바구니 담기에 실패했습니다');
    }
  };

  const handleDirectPurchase = async (orderType: TOrderType) => {
    if (selectedItems.length === 0) {
      toast.error('옵션을 선택해주세요');
      return;
    }

    if (orderType === 'team_join' && !teamId) {
      toast.error('팀 정보를 찾을 수 없습니다');
      return;
    }

    try {
      const tempCartItems: TCartItemRequest[] = selectedItems.map((item) => ({
        productId,
        optionId: item.id,
        quantity: item.quantity,
        unitPrice: shouldUseTeamPrice ? item.unitPrice : item.originPrice,
        totalPrice: (shouldUseTeamPrice ? item.unitPrice : item.originPrice) * item.quantity,
      }));

      await addMultipleItems(tempCartItems);

      setTimeout(() => {
        const paymentData: TPaymentData = {
          orderType,
          selectedItems: [],
          teamId: orderType === 'team_join' ? teamId : undefined,
        };

        navigate('/payment', {
          state: {
            ...paymentData,
            isDirectPurchase: true,
            directPurchaseInfo: {
              products: tempCartItems.map((item) => ({
                productId: item.productId,
                optionId: item.optionId,
                quantity: item.quantity,
                timestamp: Date.now(),
              })),
              productDetails: {
                name: productData?.result?.name || '',
                thumbnailUrl: productData?.result?.thumbnailUrl || '',
                store: productData?.result?.store || '',
              },
            },
          },
        });
      }, 200);

      closeModal();
      toast.success('결제 페이지로 이동합니다');
    } catch (error) {
      toast.error('상품 추가에 실패했습니다');
      console.error('Direct purchase error:', error);
    }
  };

  const handleTeamCreate = async () => {
    if (selectedItems.length === 0) {
      toast.error('옵션을 선택해주세요');
      return;
    }

    try {
      const creationResponse = await makeTeamMutateAsync({
        productId: productId,
        options: selectedItems.map((item) => ({
          optionId: item.id,
          quantity: item.quantity,
        })),
      });

      if (!creationResponse.isSuccess || !creationResponse.result.teamId) {
        throw new Error(creationResponse.message || '팀 생성에 실패했습니다.');
      }

      const newTeamId = creationResponse.result.teamId;

      const tempCartItems: TCartItemRequest[] = selectedItems.map((item) => ({
        productId,
        optionId: item.id,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.unitPrice * item.quantity,
      }));
      await addMultipleItems(tempCartItems);

      const paymentData: TPaymentData = {
        orderType: 'team_create',
        selectedItems: [],
        teamId: newTeamId,
      };

      navigate('/payment', {
        state: {
          ...paymentData,
          isDirectPurchase: true,
          directPurchaseInfo: {
            products: tempCartItems.map((item) => ({
              productId: item.productId,
              optionId: item.optionId,
              quantity: item.quantity,
              timestamp: Date.now(),
            })),
            productDetails: {
              name: productData?.result?.name || '',
              thumbnailUrl: productData?.result?.thumbnailUrl || '',
              store: productData?.result?.store || '',
            },
          },
        },
      });

      closeModal();
      toast.success('결제 페이지로 이동합니다');
    } catch (error: any) {
      toast.error(error.message || '팀 생성 중 오류가 발생했습니다.');
      console.error('Team creation error:', error);
    }
  };
  const handleIndividualPurchase = () => {
    handleDirectPurchase('individual');
  };

  const handleTeamJoin = () => {
    handleDirectPurchase('team_join');
  };

  const totalQuantity = selectedItems.reduce((acc, item) => acc + item.quantity, 0);
  const originTotalPrice = selectedItems.reduce((acc, item) => acc + item.originPrice * item.quantity, 0);
  const unitTotalPrice = selectedItems.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);
  const diff = originTotalPrice - unitTotalPrice;

  return (
    <div className="h-full px-4 pb-2 flex flex-col gap-7 select-none">
      <div className="flex flex-col gap-2">
        <DropDown options={optionData?.result} onChange={({ id }) => handleSelect(id)} />

        {selectedItems.length > 0 && (
          <div className="flex flex-col gap-3">
            {selectedItems.map(({ id, name, originPrice, unitPrice, quantity }) => (
              <div key={id} className="rounded-sm w-full min-h-22 bg-black-0 px-4 pt-5 pb-4 relative flex flex-col gap-3">
                <Close className="size-3 absolute top-4 right-4 stroke-2 cursor-pointer" onClick={() => handleRemove(id)} />
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
                  <p className="text-body-medium">{((shouldUseTeamPrice ? unitPrice : originPrice) * quantity).toLocaleString()} 원</p>
                </div>
              </div>
            ))}

            <div className="flex justify-between items-center text-small-medium">
              <div className="flex items-center gap-2">
                <p>총 {totalQuantity}개</p>
                {shouldUseTeamPrice ? (
                  <p className="text-orange">1인 구매보다 {diff.toLocaleString()}원 저렴해요!</p>
                ) : (
                  <p className="text-orange">팀 구매하면 {diff.toLocaleString()}원 저렴해요!</p>
                )}
              </div>
              <p>{shouldUseTeamPrice ? unitTotalPrice.toLocaleString() : originTotalPrice.toLocaleString()} 원</p>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        {!isTeamJoin && (
          <div
            className={`min-w-16 h-12 flex items-center justify-center rounded-sm border border-black-4 cursor-pointer ${
              isAddingMultiple ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            onClick={isAddingMultiple ? undefined : handleAddToCart}
          >
            {isAddingMultiple ? <div className="w-4 h-4 border-2 border-gray-300 border-t-black rounded-full animate-spin" /> : <Cart />}
          </div>
        )}

        {isTeamJoin ? (
          <button
            className="w-full h-12 flex justify-center items-center rounded-sm text-body-medium text-white bg-orange"
            onClick={handleTeamJoin}
            disabled={isAddingMultiple}
          >
            팀 참여하기
          </button>
        ) : isTeam ? (
          <button
            className="w-full h-12 flex justify-center items-center rounded-sm text-body-medium text-white bg-black"
            onClick={handleIndividualPurchase}
            disabled={isAddingMultiple}
          >
            1인 구매하기
          </button>
        ) : (
          <button
            className="w-full h-12 flex justify-center items-center rounded-sm text-body-medium text-white bg-orange"
            onClick={handleTeamCreate}
            disabled={isAddingMultiple || isTeamCreating}
          >
            {isTeamCreating ? '팀 생성 중...' : '팀 생성하기'}
          </button>
        )}
      </div>
    </div>
  );
}
