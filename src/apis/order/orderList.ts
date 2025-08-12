// apis/order.ts
import type { TGetMyOrdersRequest, TGetMyOrdersResponse } from '@/types/order/orderList';
import axiosInstance from '@/apis/axiosInstance'; // ← default export로 통일 (아래 주의사항 참고)

export const getMyOrders = async (
  params: TGetMyOrdersRequest = { page: 0, size: 1, sort: 'createdAt,desc' } // 기본값 설정
): Promise<TGetMyOrdersResponse> => {
  const { data } = await axiosInstance.get<TGetMyOrdersResponse>(
    '/api/orders/me',
    { params } // { page, size, sort }
  );

  if (!data?.isSuccess) {
    throw new Error(data?.message || '주문 조회 실패');
  }
  return data; // ← 네가 원한 형태 (data만 반환)
};
