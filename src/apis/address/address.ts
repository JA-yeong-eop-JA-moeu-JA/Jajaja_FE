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

// 배송지 목록 조회
export const getAddresses = (): Promise<TGetAddressesResponse> => {
  return axiosInstance.get('/api/addresses');
};

// 배송지 추가
export const addAddress = (request: IAddAddressRequest): Promise<TAddAddressResponse> => {
  return axiosInstance.post('/api/addresses', request);
};

// 배송지 수정
export const updateAddress = (addressId: number, request: IUpdateAddressRequest): Promise<TUpdateAddressResponse> => {
  return axiosInstance.put(`/api/addresses/${addressId}`, request);
};

// 배송지 삭제
export const deleteAddress = (addressId: number, request: IDeleteAddressRequest): Promise<TDeleteAddressResponse> => {
  return axiosInstance.delete(`/api/addresses/${addressId}`, { data: request });
};
