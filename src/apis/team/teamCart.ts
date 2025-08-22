import type { TCommonResponse } from '@/types/common';

import { axiosInstance } from '@/apis/axiosInstance';

export type TTeamJoinCartResponse = TCommonResponse<string>;

export const joinTeamFromCart = async (productId: number): Promise<TTeamJoinCartResponse> => {
  console.log('장바구니 팀 참여 API 호출:', { productId });

  const response = await axiosInstance.post<TTeamJoinCartResponse>(`/api/teams/carts/join/${productId}`);
  return response.data;
};
