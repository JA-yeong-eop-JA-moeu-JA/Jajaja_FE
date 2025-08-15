import type { TCommonResponse } from '@/types/common';

export type TGetSearchKeyWord = TCommonResponse<{
  baseTime: string;
  keywords: string[];
}>;

export type TCategorySort = 'POPULAR' | 'NEW' | 'PRICE_ASC' | 'REVIEW';

export interface IProductDTO {
  productId: number;
  name: string;
  salePrice: number;
  discountRate: number;
  imageUrl: string;
  store: string;
  rating: number;
  reviewCount: number;
}

export interface IGetKeywordProductsResponse {
  result: {
    products: IProductDTO[];
    page?: {
      size: number;
      totalElements: number;
      currentElements: number;
      totalPages: number;
      currentPage: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
      isLast: boolean;
    };
  };
}
