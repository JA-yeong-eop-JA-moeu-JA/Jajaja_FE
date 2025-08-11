import { axiosInstance } from '@/apis/axiosInstance';
import type { TGetMyOrdersResponse, TOrder } from '@/types/order/orderList';

export const getMyOrders = async (): Promise<TOrder[]> => {
  const { data } = await axiosInstance.get<TGetMyOrdersResponse>('/api/orders/me');

  if (!data?.isSuccess) {
    // 서버가 실패 형태를 내려준 경우 에러로 처리 (react-query가 isError로 잡음)
    throw new Error(data?.message || '주문 조회 실패');
  }

  return data.result?.orders ?? [];
};
