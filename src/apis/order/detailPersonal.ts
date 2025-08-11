// src/apis/orders/detailPersonal.ts
import type { ICommonResponse, IOrderDetailPersonalResult, IOrderProduct } from '@/types/order/detailPersonal';

import { axiosInstance } from '@/apis/axiosInstance';

function normalizeItems(items: any[]): IOrderProduct[] {
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
  const { data } = await axiosInstance.get<ICommonResponse<IOrderDetailPersonalResult>>(`/api/orders/${orderId}`);
  if (data?.result?.items) {
    (data.result as any).items = normalizeItems((data.result as any).items);
  }
  return data;
};
