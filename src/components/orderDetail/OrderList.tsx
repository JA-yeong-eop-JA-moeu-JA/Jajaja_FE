import { useNavigate } from 'react-router-dom';

import { MATCH_STATUS_COLOR_MAP, ORDER_STATUS_COLOR_MAP } from '@/constants/product/statusColorMap';
import ChevronRight from '@/assets/ChevronRight2.svg';
import OrderItem from '@/components/review/orderItem';

import type { IOrder, IOrderItem } from '@/types/order/orderList';
import type { TReviewableOrderItem } from '@/types/review/myReview';

interface IOrderProps {
  orders: IOrder[];
}

export default function OrderList({ orders }: IOrderProps) {
  const navigate = useNavigate();

  const toReviewable = (order: IOrder, item: IOrderItem): TReviewableOrderItem => {
    return {
      orderDate: order.createdAt,                                       
      orderProductId: (item as any).orderProductId ?? item.productId,  
      productName: item.name,                                         
      store: item.company,
      ...(item as any),
    } as unknown as TReviewableOrderItem;
  };

  return (
    <div className="w-full flex flex-col">
      {orders.map((order, index) => (
        <section
          key={order.id}
          className={`w-full pb-4 mb-4 ${index !== orders.length - 1 ? 'border-b-black-1 border-b-4' : ''}`}
        >
          <button
            className="w-full flex items-center justify-between pb-2 px-4"
            onClick={() => navigate(`/mypage/order/orderDetailPersonal?orderId=${order.id}`)}
          >
            <p className="text-subtitle-medium text-left">
              {order.createdAt?.trim() || '25.12.12'}
            </p>
            <img src={ChevronRight} alt=">" className="w-2 h-4" />
          </button>

          {/* 주문 아이템 카드 */}
          {order.items.map((item) => {
            type OSKey = keyof typeof ORDER_STATUS_COLOR_MAP;
            type MSKey = keyof typeof MATCH_STATUS_COLOR_MAP;

            const DEFAULT_OS: OSKey = '결제 완료' as OSKey;
            const DEFAULT_MS: MSKey = '매칭 완료' as MSKey;

            const rawOs = (item as any).orderStatus as OSKey | null | undefined;
            const rawMs = (item as any).matchStatus as MSKey | null | undefined;
            const os = (rawOs ?? DEFAULT_OS) as OSKey | undefined;
            const ms = (rawMs ?? DEFAULT_MS) as MSKey | undefined;
            
            return (
              <div
                key={`${item.orderId}-${item.productId}`}
                className="px-4 pt-4 cursor-pointer"
                onClick={(e) => {
                  if ((e.target as HTMLElement).closest('button')) return;
                  navigate(`/mypage/order/orderDetailPersonal?orderId=${order.id}`);
                }}
              >
                {/* 상태 텍스트 */}
                {(os || ms) && (
                  <div className="pb-2 flex justify-between text-body-medium">
                    {os && <span className={ORDER_STATUS_COLOR_MAP[os]}>{os}</span>}
                    {ms && <span className={MATCH_STATUS_COLOR_MAP[ms]}>{ms}</span>}
                  </div>
                )}
                <OrderItem item={toReviewable(order, item)} show={false} />
              </div>
            );
          })}
        </section>
      ))}
    </div>
  );
}
