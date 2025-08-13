import type { TCommonResponse } from '@/types/common';

export type TOptionRequest = {
  productId: number;
};
export type TProductOption = {
  id: number;
  name: string;
  originPrice: number;
  unitPrice: number;
};

export type TOption = TProductOption;

export type TGetOptionList = TCommonResponse<TProductOption[]>;
