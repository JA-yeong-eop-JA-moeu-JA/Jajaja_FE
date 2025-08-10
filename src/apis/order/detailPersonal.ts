// src/apis/orders/detailPersonal.ts
import { axiosInstance } from '@/apis/axiosInstance';
import type { TCommonResponse, OrderDetailPersonalResult, OrderProduct } from '@/types/order/detailPersonal';

function normalizeItems(items: any[]): OrderProduct[] {
  return items.map((it) => ({
    orderProductId: it.orderProductId,
    status: it.status,
    teamStatus: it.teamStatus ?? it.matchingStatus,
    product: {
      id: it.product.id,
      image: it.product.image,
      store: it.product.store,
      name: it.product.name,
      option: it.product.option,
      quantity: it.product.quantity,
    },
    price: it.price,
  }));
}

export const getOrderDetailPersonal = async (orderId: number) => {
  const { data } = await axiosInstance.get<TCommonResponse<OrderDetailPersonalResult>>(
    `/api/orders/${orderId}`
  );
  if (data?.result?.items) {
    (data.result as any).items = normalizeItems((data.result as any).items);
  }
  return data;
};
