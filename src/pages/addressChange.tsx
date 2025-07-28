import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import type { IAddress } from '@/constants/address/address';
import { ADDRESSES } from '@/constants/address/address';

import AddressCard from '@/components/AddressCard';
import { Button } from '@/components/common/button';
import PageHeaderBar from '@/components/head_bottom/PageHeader';

export default function AddressChange() {
  const [addresses, setAddresses] = useState<IAddress[]>(ADDRESSES);
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