import type { TGetPoints, TGetPointsRequest } from '@/types/points/TGetPoints';

import axiosInstance from '../axiosInstance';

export const getPoints = async ({ page, size }: TGetPointsRequest): Promise<TGetPoints> => {
  const { data } = await axiosInstance.get(`/api/points/history`, { params: { page: page, size: size } });
  return data;
};
