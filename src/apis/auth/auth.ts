import type { TCommonResponse } from '@/types/common';

import axiosInstance from '../axiosInstance';

export const reissue = async (): Promise<TCommonResponse<{}>> => {
  const { data } = await axiosInstance.post(`/api/auth/reissue`, null, {
    skipAuth: true,
    withCredentials: true,
  });
  return data;
};

export const logout = async (): Promise<TCommonResponse<{}>> => {
  const { data } = await axiosInstance.post(`/api/auth/logout`);
  return data;
};
