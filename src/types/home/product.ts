import type { TCommonResponse } from '@/types/common';

export type TProduct = {
  id: number;
  name: string;
  store: string;
  price: number;
  imageUrl: string;
  discountRate: number;
  rating: number;
  reviewCount: number;
};

export type TGetHomeProductRequest = {
  categoryId?: number;
};

export type TGetHomeProduct = TCommonResponse<{
  recommendProducts: TProduct[];
  popularProducts: TProduct[];
  newProducts: TProduct[];
}>;
