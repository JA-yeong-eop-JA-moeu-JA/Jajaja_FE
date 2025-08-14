import { useNavigate } from 'react-router-dom';

import type { IOrderItem } from '@/types/order/orderList';
import type { TReviewableOrderItem } from '@/types/review/myReview';
import { MATCH_STATUS_COLOR_MAP, ORDER_STATUS_COLOR_MAP } from '@/constants/product/statusColorMap';

import { SelectButton } from '@/components/common/button';
import OrderItem from '@/components/review/orderItem';

type TOrderStatusKey = keyof typeof ORDER_STATUS_COLOR_MAP;
type TMatchStatusKey = keyof typeof MATCH_STATUS_COLOR_MAP;

type TOrderListItem = IOrderItem & {
  orderProductId: number;
  orderStatus?: TOrderStatusKey;
  matchStatus?: TMatchStatusKey;
  orderDate?: string;
};

interface IOrderProductListSectionProps {
  items: TOrderListItem[];
  parentOrderId?: number;
  orderDate?: string;
}

const ENABLED_LABELS: TOrderStatusKey[] = ['결제 완료', '배송 중', '배송 완료'];

export default function OrderProductList({ items, parentOrderId, orderDate }: IOrderProductListSectionProps) {
  const navigate = useNavigate();

  const toReviewable = (it: TOrderListItem): TReviewableOrderItem => ({
    orderId: it.orderId,
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
        const itemOrderStatus = item.orderStatus as TOrderStatusKey | undefined;
        const itemMatchStatus = item.matchStatus as TMatchStatusKey | undefined;

        const isEnabled = !!itemOrderStatus && ENABLED_LABELS.includes(itemOrderStatus);

        return (
          <div key={`${item.orderId}-${item.productId}`}>
            <div className="flex justify-between items-center px-4 pb-2">
              {itemOrderStatus && <span className={`text-body-medium ${ORDER_STATUS_COLOR_MAP[itemOrderStatus]}`}>{itemOrderStatus}</span>}
              {itemMatchStatus && <span className={`text-body-medium ${MATCH_STATUS_COLOR_MAP[itemMatchStatus]}`}>{itemMatchStatus}</span>}
            </div>

            <div className="flex flex-col mb-4 px-4">
              <OrderItem item={toReviewable(item)} show={false} />
            </div>

            <div className="text-body-medium w-full justify-between">
              <SelectButton
                kind="select-content"
                leftText="교환/반품"
                rightText="배송 조회"
                leftVariant={isEnabled ? 'outline-orange' : 'disabled'}
                rightVariant={isEnabled ? 'outline-orange' : 'disabled'}
                onLeftClick={() => {
                  if (!isEnabled) return;
                  navigate(`/mypage/apply?orderId=${parentOrderId ?? item.orderId}&orderProductId=${item.orderProductId}`);
                }}
                onRightClick={() => {
                  if (!isEnabled) return;
                  navigate(`/mypage/deliveryInfo?orderProductId=${item.orderProductId}`);
                }}
              />
            </div>
          </div>
        );
      })}
    </section>
  );
}
