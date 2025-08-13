import type { TCommonResponse } from '@/types/common';
import type { TJoinRequest } from '@/types/product/joinTeam';

import { axiosInstance } from '@/apis/axiosInstance';

export const joinTeam = async ({ teamId }: TJoinRequest): Promise<TCommonResponse<{}>> => {
  const { data } = await axiosInstance.post(`/api/teams/join/${teamId}`);
  return data;
};
