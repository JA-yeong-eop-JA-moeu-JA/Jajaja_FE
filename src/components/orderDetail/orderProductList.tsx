import { useNavigate } from 'react-router-dom';

import type { IOrderItem } from '@/types/order/orderList';
import type { TReviewableOrderItem } from '@/types/review/myReview';
import { MATCH_STATUS_COLOR_MAP, ORDER_STATUS_COLOR_MAP } from '@/constants/product/statusColorMap';

import { SelectButton } from '@/components/common/button';
import OrderItem from '@/components/review/orderItem';

// 🔧 IOrderItem 확장해서 필요한 필드 추가
type TOrderStatusKey = keyof typeof ORDER_STATUS_COLOR_MAP;
type TMatchStatusKey = keyof typeof MATCH_STATUS_COLOR_MAP;

type OrderListItem = IOrderItem & {
  orderProductId: number;           // ← 필수
  orderStatus?: TOrderStatusKey;    // ← per-item 상태 (옵션)
  matchStatus?: TMatchStatusKey;    // ← per-item 상태 (옵션)
  orderDate?: string;               // ← 있으면 카드에 넘김
};

interface IOrderProductListSectionProps {
  items: OrderListItem[];
  parentOrderId?: number;           // ← 진짜 주문 ID(쿼리용)
  orderDate?: string;
}

export default function OrderProductList({ items, parentOrderId, orderDate }: IOrderProductListSectionProps) {
  const navigate = useNavigate();

  const toReviewable = (it: OrderListItem): TReviewableOrderItem => ({
    orderId: it.orderId,                               // 카드에 보여줄 주문 ID (페이지에서 세팅)
    orderDate: orderDate ?? it.orderDate ?? '',
    orderProductId: it.orderProductId,
    productId: it.productId,
    productName: it.name,
    store: it.company,
    optionName: it.option,
    imageUrl: it.image,
    price: it.price,
    quantity: it.quantity,
    isReviewWritten: it.reviewed,
  });

  return (
    <section className="px-2 pb-4 border-b border-b-4 border-b-black-1 flex flex-col gap-4">
      {items.map((item) => {
        const itemOrderStatus = (item.orderStatus ?? '결제 완료') as TOrderStatusKey;
        const itemMatchStatus = (item.matchStatus ?? '매칭 완료') as TMatchStatusKey;

        return (
          <div key={`${item.orderId}-${item.productId}`}>
            {/* 상품별 상태 배지 */}
            <div className="flex justify-between items-center px-4 pb-2">
              <span className={`text-body-medium ${ORDER_STATUS_COLOR_MAP[itemOrderStatus]}`}>
                {itemOrderStatus}
              </span>
              <span className={`text-body-medium ${MATCH_STATUS_COLOR_MAP[itemMatchStatus]}`}>
                {itemMatchStatus}
              </span>
            </div>

            <div className="flex flex-col mb-4 px-4">
              <OrderItem item={toReviewable(item)} show={false} />
            </div>

            <div className="text-body-medium w-full md:flex-row justify-between">
              <SelectButton
                kind="select-content"
                leftText="교환/반품"
                rightText="배송 조회"
                leftVariant="outline-orange"
                rightVariant="outline-orange"
                onLeftClick={() =>
                  navigate(`/mypage/apply?orderId=${parentOrderId ?? item.orderId}&orderProductId=${item.orderProductId}`)
                }
                onRightClick={() =>
                  navigate(`/mypage/deliveryInfo?orderProductId=${item.orderProductId}`)
                }
              />
            </div>
          </div>
        );
      })}
    </section>
  );
}
