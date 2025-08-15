import type { TCommonResponse } from '@/types/common';

export type TTeamRequest = {
  productId: number;
  options: {
    optionId: number;
    quantity: number;
  }[];
};

export type TTeamResponse = TCommonResponse<{
  teamId: number;
  createdAt: string;
}>;
