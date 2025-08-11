import type { TGetMyOrdersResponse, TOrder, TPage } from '@/types/order/orderList';

import axiosInstance from '@/apis/axiosInstance';

export const getMyOrders = async (params?: { page?: number; size?: number; sort?: string }): Promise<{ orders: TOrder[]; page?: TPage }> => {
  try {
    const res = await axiosInstance.get<TGetMyOrdersResponse>('/api/orders/me', {
      params, // { page, size, sort }
    });

    if (import.meta.env.DEV) {
      console.log('[orders/me][OK] url:', (res.config?.baseURL || '') + (res.config?.url || ''));
      console.log('[orders/me][OK] status:', res.status);
      console.log('[orders/me][OK] page:', res.data?.result?.page);
      console.log('[orders/me][OK] ordersCount:', res.data?.result?.orders?.length ?? 0);
    }

    if (!res.data?.isSuccess) {
      throw new Error(res.data?.message || '주문 조회 실패');
    }

    return {
      orders: res.data.result?.orders ?? [],
      page: res.data.result?.page,
    };
  } catch (err: any) {
    const cfg = err.config ?? {};
    console.error('[orders/me][ERR] url:', (cfg.baseURL || '') + (cfg.url || ''));
    console.error('[orders/me][ERR] method:', cfg.method);
    console.error('[orders/me][ERR] status:', err.response?.status);
    console.error('[orders/me][ERR] code:', err.response?.data?.code);
    console.error('[orders/me][ERR] data:', err.response?.data);
    throw err;
  }
};
