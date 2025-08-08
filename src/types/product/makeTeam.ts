import type { TCommonResponse } from '@/types/common';

export type TTeamRequest = {
  productId: number;
};
export type TTeamResponse = TCommonResponse<{
  teamId: number;
  createdAt: string;
}>;
