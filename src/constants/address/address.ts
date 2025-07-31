export interface IAddress {
  id: number;
  name: string;
  phone: string;
  address: string;
  detailAddress?: string;
  gateCode?: string;
  isDefault: boolean;
}

export const ADDRESSES: IAddress[] = [
  {
    id: 1,
    name: '이한비',
    phone: '010-2812-1241',
    address: '서울특별시 강서구 낙섬서로12번길 3-12',
    gateCode: '1231*',
    isDefault: true,
  },
  {
    id: 2,
    name: '김승연',
    phone: '010-2812-1241',
    address: '서울특별시 강남구 봉천2로 12',
    isDefault: false,
  },
];

export const DEFAULT_ADDRESS_TAG = '기본 배송지';
