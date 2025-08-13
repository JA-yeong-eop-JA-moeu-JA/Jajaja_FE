import type { TGetPoints } from '@/types/points/TGetPoints';
import type { TInfiniteRequest } from '@/types/TPage';

import axiosInstance from '../axiosInstance';

export const getPoints = async ({ page, size }: TInfiniteRequest): Promise<TGetPoints> => {
  const { data } = await axiosInstance.get(`/api/points/history`, { params: { page: page, size: size } });
  return data;
};
