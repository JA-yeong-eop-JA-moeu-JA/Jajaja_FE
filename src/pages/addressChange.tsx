import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import type { IAddress } from '@/types/address/TAddress';

import { useDeleteAddress, useGetAddresses } from '@/hooks/address/useAddress';

import AddressCard from '@/components/AddressCard';
import { Button } from '@/components/common/button';
import PageHeaderBar from '@/components/head_bottom/PageHeader';

export default function AddressChange() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedAddress, setSelectedAddress] = useState<IAddress | null>(null);
  const { data: addresses = [], isLoading, error, refetch } = useGetAddresses();
  const { mutate: deleteAddress } = useDeleteAddress();

  const { returnPath, paymentData, selectedAddress: currentSelectedAddress } = location.state || {};

  const sortedAddresses = [...addresses].sort((a, b) => {
    if (a.isDefault && !b.isDefault) return -1;
    if (!a.isDefault && b.isDefault) return 1;
    return a.id - b.id;
  });

  useEffect(() => {
    if (addresses.length > 0 && !selectedAddress) {
      let initialAddress: IAddress | undefined;

      if (currentSelectedAddress?.id) {
        initialAddress = addresses.find((addr: IAddress) => addr.id === currentSelectedAddress.id);
      }

      if (!initialAddress) {
        initialAddress = addresses.find((addr: IAddress) => addr.isDefault);
      }

      if (!initialAddress && addresses.length > 0) {
        initialAddress = addresses[0];
      }

      if (initialAddress) {
        setSelectedAddress(initialAddress);
      }
    }
  }, [addresses, selectedAddress, currentSelectedAddress]);

  useEffect(() => {
    const handleFocus = () => {
      refetch();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [refetch]);

  const handleSelectAddress = (address: IAddress) => {
    setSelectedAddress(address);

    if (returnPath === '/payment' && paymentData) {
      navigate('/payment', {
        state: {
          ...paymentData,
          selectedAddress: address,
        },
      });
    } else if (returnPath.startsWith('/mypage/apply')) {
      navigate(returnPath, {
        state: {
          ...paymentData,
          selectedAddress: address,
        },
      });
    }
  };

  const handleDelete = (id: number) => {
    if (!confirm('이 배송지를 삭제하시겠습니까?')) {
      return;
    }

    if (selectedAddress?.id === id) {
      setSelectedAddress(null);
    }

    deleteAddress(
      { addressId: id, request: { id } },
      {
        onSuccess: () => {
          refetch();
          alert('배송지가 성공적으로 삭제되었습니다.');
        },
        onError: (deleteError: any) => {
          let errorMessage = '배송지 삭제에 실패했습니다.';

          if (deleteError?.response?.data) {
            const { code, message, result } = deleteError.response.data;

            if (code === 'COMMON500' && result?.includes('foreign key constraint fails')) {
              errorMessage = '이 배송지는 이미 주문에서 사용되어 삭제할 수 없습니다.\n다른 배송지를 기본 배송지로 설정하거나 새로운 배송지를 추가해주세요.';
            } else if (message) {
              errorMessage = message;
            }
          }

          alert(errorMessage);
        },
      },
    );
  };

  const handleAddAddress = () => {
    navigate('/address/add', {
      state: {
        returnPath: '/address/change',
        originalData: { returnPath, paymentData, selectedAddress: currentSelectedAddress },
      },
    });
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
          {sortedAddresses.map((addr: IAddress) => {
            const isSelected = selectedAddress?.id === addr.id;

            return <AddressCard key={addr.id} address={addr} onDelete={handleDelete} onSelect={handleSelectAddress} isSelected={isSelected} mode="select" />;
          })}
        </>
      )}

      <Button kind="basic" variant="solid-gray" className="w-full" onClick={handleAddAddress}>
        + 배송지 추가
      </Button>
    </div>
  );
}
