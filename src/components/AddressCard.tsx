import React from 'react';
import { useNavigate } from 'react-router-dom';

import type { IAddress } from '@/constants/address/address';
import { DEFAULT_ADDRESS_TAG } from '@/constants/address/address';

import { useModalStore } from '@/stores/modalStore';

import DeleteIcon from '../assets/icons/delete.svg?react';

interface IAddressCardProps {
  address: IAddress;
  onDelete: (id: number) => void;
}

function AddressCard({ address, onDelete }: IAddressCardProps) {
  const { openModal } = useModalStore();
  const navigate = useNavigate();

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(address.id);
  };

  const handleCardClick = () => {
    navigate('/editaddress', {
      state: { address },
    });
  };

  return (
    <div className="px-4 mb-2">
      <div className={`relative border-1 border-black-1 rounded-md p-4 mb-3 cursor-pointer hover:bg-gray-50 transition-colors`} onClick={handleCardClick}>
        {!address.isDefault && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              openModal('alert', {
                onDelete: () => handleDelete(e),
                message: '배송지 정보를 삭제할까요?',
              });
            }}
            className="absolute top-2 right-2 z-10"
          >
            <div className="p-3">
              <DeleteIcon className="w-3 h-3" />
            </div>
          </button>
        )}

        <div className="flex items-center gap-2 mb-2">
          <p className="text-body-medium">{address.name}</p>
          {address.isDefault && <span className="text-orange text-small-medium">{DEFAULT_ADDRESS_TAG}</span>}
        </div>

        <p className="text-body-regular">{address.phone}</p>

        <p className="text-body-regular">
          {address.address} {address.detailAddress}
        </p>

        {address.gateCode && <p className="text-body-regular text-black-4">공동 현관 비밀번호: {address.gateCode}</p>}
      </div>
    </div>
  );
}

export default AddressCard;
