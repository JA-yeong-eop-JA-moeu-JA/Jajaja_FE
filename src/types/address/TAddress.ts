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

export type TGetAddressesResponse = TCommonResponse<{
  data: TAddress[];
  totalCount: number;
}>;

export type TAddAddressResponse = TCommonResponse<{
  data: TAddress;
}>;

export type TUpdateAddressResponse = TCommonResponse<{
  data: TAddress;
}>;

export type TDeleteAddressResponse = TCommonResponse;
