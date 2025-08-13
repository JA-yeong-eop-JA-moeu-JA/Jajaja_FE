import type { TGetUserInfoResponse } from '@/types/member/TGetUserInfo';
import type { TPatchUserInfoRequest } from '@/types/member/TPatchUserInfo';

import { axiosInstance } from '../axiosInstance';

export const getUserInfo = async (): Promise<TGetUserInfoResponse> => {
  const { data } = await axiosInstance.get('/api/members/me', { optionalAuth: true });
  return data;
};

export const patchUserInfo = async (memberId: number, memberData: TPatchUserInfoRequest): Promise<TGetUserInfoResponse> => {
  const { data } = await axiosInstance.patch(`/api/members/${memberId}`, memberData);
  return data;
};
