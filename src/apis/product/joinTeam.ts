import type { TCommonResponse } from '@/types/common';
import type { TJoinRequest } from '@/types/product/joinTeam';

import { axiosInstance } from '@/apis/axiosInstance';

export const joinTeam = async ({ teamId, selectedOptions }: TJoinRequest): Promise<TCommonResponse<{}>> => {
  const requestBody = selectedOptions ? { selectedOptions } : {};

  const { data } = await axiosInstance.post(`/api/teams/join/${teamId}`, requestBody);
  return data;
};
