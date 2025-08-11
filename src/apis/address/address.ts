import type {
  IAddAddressRequest,
  IDeleteAddressRequest,
  IUpdateAddressRequest,
  TAddAddressResponse,
  TDeleteAddressResponse,
  TGetAddressesResponse,
  TUpdateAddressResponse,
} from '@/types/address/TAddress';

import { axiosInstance } from '@/apis/axiosInstance';

export const getAddresses = (): Promise<TGetAddressesResponse> => {
  return axiosInstance.get('/api/addresses');
};

export const addAddress = (request: IAddAddressRequest): Promise<TAddAddressResponse> => {
  const params = new URLSearchParams();
  params.append('name', request.name);
  params.append('phone', request.phone);
  params.append('address', request.address);
  params.append('addressDetail', request.addressDetail);
  params.append('zipcode', request.zipcode);
  if (request.buildingPassword) {
    params.append('buildingPassword', request.buildingPassword);
  }
  params.append('isDefault', String(request.isDefault));

  return axiosInstance.post(
    `/api/addresses?${params.toString()}`,
    {},
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
};

export const updateAddress = (addressId: number, request: IUpdateAddressRequest): Promise<TUpdateAddressResponse> => {
  const params = new URLSearchParams();

  params.append('deliveryId', String(addressId));
  params.append('name', request.recipientName);
  params.append('phone', request.phone);
  params.append('address', request.address);
  params.append('addressDetail', request.detailAddress);
  params.append('zipcode', request.zipCode || '');
  if (request.buildingPassword) {
    params.append('buildingPassword', request.buildingPassword);
  }
  params.append('isDefault', String(request.isDefault));

  return axiosInstance.patch(`/api/addresses/${addressId}?${params.toString()}`, {});
};

export const deleteAddress = (addressId: number, request: IDeleteAddressRequest): Promise<TDeleteAddressResponse> => {
  const params = new URLSearchParams();
  params.append('deliveryId', String(request.id));

  return axiosInstance.delete(`/api/addresses/${addressId}?${params.toString()}`);
};
