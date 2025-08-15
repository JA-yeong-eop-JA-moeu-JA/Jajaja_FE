import type { TGetMyOrdersRequest, TGetMyOrdersResponse } from '@/types/order/orderList';

import axiosInstance from '@/apis/axiosInstance';

export const getMyOrders = async (params: TGetMyOrdersRequest = { page: 0, size: 6, sort: 'createdAt,desc' }): Promise<TGetMyOrdersResponse> => {
  const { data } = await axiosInstance.get<TGetMyOrdersResponse>('/api/orders/me', { params });

  if (!data?.isSuccess) {
    throw new Error(data?.message || '주문 조회 실패');
  }
  return data;
};
