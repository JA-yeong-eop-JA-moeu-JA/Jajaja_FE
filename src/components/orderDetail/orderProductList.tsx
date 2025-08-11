import { useNavigate } from 'react-router-dom';

import type { IOrderItem } from '@/types/order/orderList';
import type { TReviewableOrderItem } from '@/types/review/myReview';
import { MATCH_STATUS_COLOR_MAP, ORDER_STATUS_COLOR_MAP } from '@/constants/product/statusColorMap';

import { SelectButton } from '@/components/common/button';
import OrderItem from '@/components/review/orderItem';

interface IOrderProductListSectionProps {
  items: IOrderItem[];
  orderStatus?: keyof typeof ORDER_STATUS_COLOR_MAP;
  matchStatus?: keyof typeof MATCH_STATUS_COLOR_MAP;
  orderDate?: string;
}

export default function OrderProductList({ items, orderStatus, matchStatus, orderDate }: IOrderProductListSectionProps) {
  const navigate = useNavigate();

  const toReviewable = (it: IOrderItem): TReviewableOrderItem => ({
    orderId: it.orderId,
    orderDate: orderDate ?? (it as any).orderDate ?? '', // 부모가 주면 우선 사용
    orderProductId: (it as any).orderProductId ?? 0, // 없으면 0
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
      {(orderStatus || matchStatus) && (
        <div className="flex justify-between items-center px-2">
          {orderStatus ? <span className={`text-body-medium ${ORDER_STATUS_COLOR_MAP[orderStatus]}`}>{orderStatus}</span> : <span />}
          {matchStatus && <span className={`text-body-medium ${MATCH_STATUS_COLOR_MAP[matchStatus]}`}>{matchStatus}</span>}
        </div>
      )}

      {items.map((item) => (
        <div key={`${item.orderId}-${item.productId}`}>
          <div className="flex flex-col mb-4 px-2">
            {/* 🔧 여기서 order 제거 */}
            <OrderItem item={toReviewable(item)} show={false} />
          </div>

          <div className="text-body-medium w-full md:flex-row justify-between">
            <SelectButton
              kind="select-content"
              leftText="교환/반품"
              rightText="배송 조회"
              leftVariant="outline-orange"
              rightVariant="outline-orange"
              onLeftClick={() => navigate('/mypage/apply')}
              onRightClick={() => navigate('/mypage/deliveryInfo')}
            />
          </div>
        </div>
      ))}
    </section>
  );
}
