import type { TCommonResponse } from '@/types/common';
import type { TGetNotiList } from '@/types/notifications/TGetNotiList';
import type { TGetNotiUnread } from '@/types/notifications/TGetNotiUnread';
import type { TInfiniteRequest } from '@/types/TPage';

import axiosInstance from '../axiosInstance';

export const patchNotiRead = async (notificationId: number): Promise<TCommonResponse<{}>> => {
  const { data } = await axiosInstance.patch(`/api/notifications/${notificationId}/read`);
  return data;
};

export const patchNotiReadAll = async (): Promise<TCommonResponse<{}>> => {
  const { data } = await axiosInstance.patch(`/api/notifications/read-all`);
  return data;
};

export const getNotiList = async ({ page, size }: TInfiniteRequest): Promise<TGetNotiList> => {
  const { data } = await axiosInstance.get(`/api/notifications`, { params: { page: page, size: size } });
  return data;
};

export const getNotiUnread = async (): Promise<TGetNotiUnread> => {
  const { data } = await axiosInstance.get(`/api/notifications/unread`);
  return data;
};
