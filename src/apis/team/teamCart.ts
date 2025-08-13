import type { TCommonResponse } from '@/types/common';

import { axiosInstance } from '@/apis/axiosInstance';

export type TTeamJoinCartResponse = TCommonResponse<string>;

export const joinTeamFromCart = async (productId: number): Promise<TTeamJoinCartResponse> => {
  const response = await axiosInstance.post<TTeamJoinCartResponse>(`/api/teams/carts/join/${productId}`);
  return response.data;
};
