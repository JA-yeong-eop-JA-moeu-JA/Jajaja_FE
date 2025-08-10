// src/components/orderDetail/orderProductList.tsx
import { useNavigate } from 'react-router-dom';
import { MATCH_STATUS_COLOR_MAP, ORDER_STATUS_COLOR_MAP } from '@/constants/product/statusColorMap';
import { SelectButton } from '@/components/common/button';
import OrderItem from '@/components/review/orderItem';
import type { IOrderItem } from '@/types/order/orderItem';

interface IOrderProductListSectionProps {
  items: IOrderItem[];
  orderStatus?: keyof typeof ORDER_STATUS_COLOR_MAP; // 좌측 결제/주문 상태
  matchStatus?: keyof typeof MATCH_STATUS_COLOR_MAP; // 우측 매칭 상태(팀 전용)
}

export default function OrderProductList({ items, orderStatus, matchStatus }: IOrderProductListSectionProps) {
  const navigate = useNavigate();

  return (
    <section className="px-2 pb-4 border-b border-b-4 border-b-black-1 flex flex-col gap-4">
      {/* 결제 상태 + 매칭 상태 (색상 맵 그대로 적용) */}
      {(orderStatus || matchStatus) && (
        <div className="flex justify-between items-center px-2">
          {orderStatus ? (
            <span className={`text-body-medium ${ORDER_STATUS_COLOR_MAP[orderStatus]}`}>
              {orderStatus}
            </span>
          ) : (
            <span /> /* 좌측 자리를 유지해서 우측 라벨 정렬 보장 */
          )}

          {matchStatus && (
            <span className={`text-body-medium ${MATCH_STATUS_COLOR_MAP[matchStatus]}`}>
              {matchStatus}
            </span>
          )}
        </div>
      )}

      {items.map((item) => (
        <div key={`${item.orderId}-${item.productId}`}>
          <div className="flex flex-col mb-4 px-2">
            <OrderItem item={item} show={false} />
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
