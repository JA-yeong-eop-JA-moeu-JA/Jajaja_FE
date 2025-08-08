import type { TTeamRequest, TTeamResponse } from '@/types/product/makeTeam';

import { axiosInstance } from '@/apis/axiosInstance';

export const makeTeam = async ({ productId }: TTeamRequest): Promise<TTeamResponse> => {
  const { data } = await axiosInstance.post(`/api/teams/${productId}`);
  return data;
};
