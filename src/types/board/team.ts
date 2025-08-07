import type { TCommonResponse } from '@/types/common';

export interface ITeamProduct {
  teamId: number;
  nickname: string;
  leaderProfileImageUrl: string;
  productId: number;
  productName: string;
  price: number;
  discountRate: number;
  thumbnailUrl: string;
}

// 2. TTeamProductResult가 그걸 사용
export interface TTeamProductResult {
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
  teams: ITeamProduct[];
}


export type TGetTeamProductsResponse = TCommonResponse<TTeamProductResult>;
