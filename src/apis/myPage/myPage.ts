import type { TGetUserInfoResponse } from '@/types/member/TGetUserInfo';

import { axiosInstance } from '../axiosInstance';

export const getUserInfo = async (): Promise<TGetUserInfoResponse> => {
  const { data } = await axiosInstance.get('/api/members/me');
  return data;
};
