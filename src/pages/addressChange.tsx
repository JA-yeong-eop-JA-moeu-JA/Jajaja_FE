import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import type { IAddress } from '@/types/address/TAddress';

import { useDeleteAddress, useGetAddresses } from '@/hooks/address/useAddress';

import AddressCard from '@/components/AddressCard';
import { Button } from '@/components/common/button';
import PageHeaderBar from '@/components/head_bottom/PageHeader';

export default function AddressChange() {
  const navigate = useNavigate();
  const [selectedAddress, setSelectedAddress] = useState<IAddress | null>(null);
  const { data: addressesResponse, isLoading, error, refetch } = useGetAddresses();
  const { mutate: deleteAddress } = useDeleteAddress();

  const addresses = (addressesResponse as any)?.data?.result || [];

  useEffect(() => {
    if (addresses.length > 0 && !selectedAddress) {
      const defaultAddress = addresses.find((addr: IAddress) => addr.isDefault);
      if (defaultAddress) {
        setSelectedAddress(defaultAddress);
      }
    }
  }, [addresses, selectedAddress]);

  useEffect(() => {
    const handleFocus = () => {
      refetch();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [refetch]);

  const handleSelectAddress = (address: IAddress) => {
    setSelectedAddress(address);
  };

  const handleDelete = (id: number) => {
    if (selectedAddress?.id === id) {
      setSelectedAddress(null);
    }

    deleteAddress(
      { addressId: id, request: { id } },
      {
        onSuccess: () => {},
        onError: (deleteError) => {
          console.error('주소 삭제 실패:', deleteError);
        },
      },
    );
  };

  if (isLoading) {
    return (
      <div className="">
        <PageHeaderBar title="배송지 변경" />
        <div className="flex justify-center items-center h-40">
          <p>배송지 목록을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="">
        <PageHeaderBar title="배송지 변경" />
        <div className="flex justify-center items-center h-40">
          <p>배송지 목록을 불러오는데 실패했습니다.</p>
          <button onClick={() => refetch()} className="ml-2 text-blue-500">
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="">
      <PageHeaderBar title="배송지 변경" />

      {addresses.length === 0 ? (
        <div className="flex flex-col justify-center items-center h-40 text-gray-500">
          <p>등록된 배송지가 없습니다.</p>
          <p>새 배송지를 추가해보세요.</p>
        </div>
      ) : (
        <>
          {addresses.map((addr: IAddress) => {
            const isSelected = selectedAddress?.id === addr.id;

            return <AddressCard key={addr.id} address={addr} onDelete={handleDelete} onSelect={handleSelectAddress} isSelected={isSelected} mode="select" />;
          })}
        </>
      )}

      <Button kind="basic" variant="solid-gray" className="w-full" onClick={() => navigate('/address/add')}>
        + 배송지 추가
      </Button>
    </div>
  );
}
