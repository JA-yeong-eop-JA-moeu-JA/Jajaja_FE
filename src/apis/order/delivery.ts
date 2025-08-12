import type { IOrderProductDeliveryResult } from '@/types/order/delivery';
import type { ICommonResponse } from '@/types/order/detailPersonal';

import { axiosInstance } from '@/apis/axiosInstance';

export const getOrderProductDelivery = async (orderProductId: number) => {
  const { data } = await axiosInstance.get<ICommonResponse<IOrderProductDeliveryResult>>(`/api/order-products/${orderProductId}/delivery`);
  return data;
};
