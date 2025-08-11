export interface IAddress {
  id: number;
  name: string;
  phone: string;
  address: string;
  addressDetail: string;
  zipcode: string;
  buildingPassword?: string;
  isDefault: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type TAddress = IAddress;

export interface IAddAddressRequest {
  name: string;
  phone: string;
  address: string;
  addressDetail: string;
  zipcode: string;
  buildingPassword?: string;
  isDefault: boolean;
}

export interface IUpdateAddressRequest {
  recipientName: string; // 주소지 수정(PATCH)용
  phone: string;
  address: string;
  detailAddress: string;
  zipCode?: string;
  buildingPassword?: string;
  isDefault: boolean;
}

export interface IDeleteAddressRequest {
  id: number;
}

export type TCommonResponse<T = void> = {
  isSuccess: boolean;
  code: string;
  message: string;
  result?: T;
};

// 수정: 실제 API 응답에 맞게 타입 정의 변경
export type TGetAddressesResponse = TCommonResponse<TAddress[]>;

export type TAddAddressResponse = TCommonResponse<TAddress>;

export type TUpdateAddressResponse = TCommonResponse<TAddress>;

export type TDeleteAddressResponse = TCommonResponse;
