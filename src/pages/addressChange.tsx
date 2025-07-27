import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import type { IAddress } from '@/constants/address/address';

import AddressCard from '@/components/AddressCard';
import { Button } from '@/components/common/button';
import PageHeaderBar from '@/components/head_bottom/PageHeader';

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
    isDefault: false,
  },
];

export default function AddressChange() {
  const [addresses, setAddresses] = useState(addressList);
  const navigate = useNavigate();

  const handleDelete = (id: number) => {
    setAddresses(addresses.filter((a) => a.id !== id));
  };

  return (
    <div className="">
      <PageHeaderBar title="배송지 변경" />

      {addresses.map((addr) => (
        <AddressCard key={addr.id} address={addr} onDelete={handleDelete} />
      ))}

      <Button kind="basic" variant="solid-gray" className="w-full" onClick={() => navigate('/addaddress')}>
        + 배송지 추가
      </Button>
    </div>
  );
}