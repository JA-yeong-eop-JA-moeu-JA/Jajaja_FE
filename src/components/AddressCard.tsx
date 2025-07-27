import type { IAddress } from '@/constants/address/address';
import { DEFAULT_ADDRESS_TAG } from '@/constants/address/address';

import DeleteIcon from '../assets/icons/delete.svg?react';

interface IAddressCardProps {
  address: IAddress;
  onDelete: (id: number) => void;
}

function AddressCard({ address, onDelete }: IAddressCardProps) {
  const handleDelete = () => {
    onDelete(address.id);
  };

  return (
    <div className="px-4 mb-2">
      <div className={`relative border-1 border-black-1 rounded-md p-4 mb-3`}>
        <button onClick={handleDelete} className="absolute top-2 right-2">
          <DeleteIcon />
        </button>

        <div className="flex items-center gap-2 mb-2">
          <p className="text-body-medium">{address.name}</p>
          {address.isDefault && <span className="text-orange text-small-medium">{DEFAULT_ADDRESS_TAG}</span>}
        </div>

        <p className="text-body-regular text-black">{address.phone}</p>

        <p className="text-body-regular text-black">{address.address}</p>

        {address.gateCode && <p className="text-body-regular text-black-4">공동 현관 비밀번호: {address.gateCode}</p>}
      </div>
    </div>
  );
}

export default AddressCard;
