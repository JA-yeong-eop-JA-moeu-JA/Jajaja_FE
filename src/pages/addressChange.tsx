import { useState } from 'react';

import { Button } from '@/components/common/button';

interface IAddress {
  id: number;
  name: string;
  phone: string;
  address: string;
  gateCode?: string;
  isDefault?: boolean;
}

const addressList: IAddress[] = [
  {
    id: 1,
    name: '이한비',
    phone: '010-2812-1241',
    address: '서울특별시 강서구 낙성서로12번길 3-12',
    gateCode: '1231*',
    isDefault: true,
  },
  {
    id: 2,
    name: '김승연',
    phone: '010-2812-1241',
    address: '서울특별시 강남구 봉천2로 12 109동 121호',
  },
];

export default function AddressChange() {
  const [addresses, setAddresses] = useState(addressList);

  const handleDelete = (id: number) => {
    setAddresses(addresses.filter((a) => a.id !== id));
  };

  return (
    <div className="min-h-screen bg-white flex flex-col px-4 py-4">
      <h1 className="text-title-medium mb-4">배송지 변경</h1>

      {addresses.map((addr) => (
        <div key={addr.id} className={`relative border rounded-md p-4 mb-3 ${addr.isDefault ? 'border-orange' : 'border-black-2'}`}>
          <button onClick={() => handleDelete(addr.id)} className="absolute top-2 right-2 text-black-4 text-lg">
            ×
          </button>

          <div className="flex items-center gap-2 mb-1">
            <p className="text-body-medium">{addr.name}</p>
            {addr.isDefault && <span className="text-orange text-small-medium">기본 배송지</span>}
          </div>

          <p className="text-body-regular text-black">{addr.phone}</p>
          <p className="text-body-regular text-black">{addr.address}</p>
          {addr.gateCode && <p className="text-body-regular text-black-4">공동 현관 비밀번호: {addr.gateCode}</p>}
        </div>
      ))}

      <Button kind="basic" variant="outline-gray" className="w-full mt-2">
        + 배송지 추가
      </Button>
    </div>
  );
}
