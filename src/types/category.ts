export type TGetMainCategoryResponse = {
  isSuccess: boolean;
  result: { id: number; name: string }[];
};

export type TGetSubCategoryResponse = {
  isSuccess: boolean;
  result: { id: number; name: string }[];
};

export interface IGetCategoryProductsResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result?: {
    page: {
      size: number;
      totalElements: number;
      currentElements: number;
      totalPages: number;
      currentPage: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
      isLast: boolean;
    };
    products: {
      productId: number;
      name: string;
      salePrice: number;
      discountRate: number;
      imageUrl: string;
      store: string;
      rating: number;
      reviewCount: number;
    }[];
  };
}
export type TCategorySort = 'POPULAR' | 'NEW' | 'PRICE_ASC' | 'REVIEW';
