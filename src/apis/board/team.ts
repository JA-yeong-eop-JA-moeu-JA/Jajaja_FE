import type { ITeamProductResult } from '@/types/board/team';
import type { TCommonResponse } from '@/types/common';

import { axiosInstance } from '@/apis/axiosInstance';

export const getTeamProducts = async (page: number, size: number): Promise<TCommonResponse<ITeamProductResult>> => {
  try {
    const match = document.cookie.match(/accessToken=([^;]+)/);
    const token = match?.[1];

    const { data } = await axiosInstance.get('/api/teams/products', {
      params: { page, size },
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
      },
    });

    console.log('[getTeamProducts] response:', data);
    return data;
  } catch (err) {
    console.error('[getTeamProducts] error:', err);
    throw err;
  }
};
