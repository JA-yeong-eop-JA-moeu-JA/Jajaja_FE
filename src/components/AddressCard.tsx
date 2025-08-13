import React from 'react';
import { useNavigate } from 'react-router-dom';

import type { IAddress } from '@/types/address/TAddress';
import { DEFAULT_ADDRESS_TAG } from '@/constants/address/address';

import { useModalStore } from '@/stores/modalStore';

interface IAddressCardProps {
  address: IAddress;
  onDelete?: (id: number) => void;
  onSelect?: (address: IAddress) => void;
  isSelected?: boolean;
  isDeleting?: boolean;
  mode?: 'select' | 'manage';
}

function AddressCard({ address, onDelete, onSelect, isSelected = false, isDeleting = false, mode = 'manage' }: IAddressCardProps) {
  const { openModal } = useModalStore();
  const navigate = useNavigate();

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(address.id);
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate('/address/edit', {
      state: { address },
    });
  };

  const handleCardClick = (e: React.MouseEvent) => {
    if (mode === 'select' && onSelect) {
      e.preventDefault();
      e.stopPropagation();
      onSelect(address);
    }
  };

  return (
    <div className="px-4 mb-2">
      <div
        className={`relative rounded-md p-4 mb-3 transition-all ${
          isSelected ? 'border-1 border-green' : mode === 'select' ? 'border-1 border-black-1' : 'border-2 border-black-1'
        } ${isDeleting ? 'opacity-50 pointer-events-none' : ''}`}
        onClick={handleCardClick}
      >
        <div className="flex items-center gap-2 mb-2">
          <p className="text-subtitle-medium">{address.name}</p>
          {address.isDefault && <span className="text-orange text-small-medium">{DEFAULT_ADDRESS_TAG}</span>}
        </div>

        <p className="text-body-regular mb-1">{address.phone}</p>

        <p className="text-body-regular mb-1">
          {address.address} {address.addressDetail}
        </p>

        {address.buildingPassword && <p className="text-body-regular text-black-4">공동 현관 비밀번호: {address.buildingPassword}</p>}

        {mode === 'select' && (
          <div className="flex justify-end gap-3 mt-3">
            {!address.isDefault && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  openModal('alert', {
                    onDelete: () => handleDelete(e),
                    message: '배송지 정보를 삭제할까요?',
                  });
                }}
                className="text-error-3 text-body-regular bg-black-0 px-3 py-1"
                disabled={isDeleting}
              >
                삭제
              </button>
            )}

            <button onClick={handleEdit} className="text-body-regular bg-black-0 px-3 py-1" disabled={isDeleting}>
              수정
            </button>
          </div>
        )}

        {mode === 'manage' && (
          <div className="flex justify-end gap-2 mt-3">
            {!address.isDefault && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  openModal('alert', {
                    onDelete: () => handleDelete(e),
                    message: '배송지 정보를 삭제할까요?',
                  });
                }}
                className="text-error-3 text-body-regular bg-black-0 px-3 py-1"
                disabled={isDeleting}
              >
                삭제
              </button>
            )}

            <button onClick={handleEdit} className="text-body-regular bg-black-0 px-3 py-1" disabled={isDeleting}>
              수정
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default AddressCard;
