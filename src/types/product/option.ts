import type { TCommonResponse } from '@/types/common';

export type TOptionRequest = {
  productId: number;
};
export type TOption = {
  id: number;
  name: string;
  originPrice: number;
  unitPrice: number;
};

export type TGetOptionList = TCommonResponse<TOption[]>;
