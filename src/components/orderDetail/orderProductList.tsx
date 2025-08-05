import { useNavigate } from 'react-router-dom';

import { MATCH_STATUS_COLOR_MAP } from '@/constants/product/statusColorMap';

import { SelectButton } from '@/components/common/button';
import OrderItem from '@/components/review/orderItem';

import type { IOrderItem } from '@/mocks/orderData';

interface IOrderProductListSectionProps {
  items: IOrderItem[];
  matchStatus?: '매칭 중' | '매칭 완료' | '매칭 실패';
}

export default function OrderProductList({ items, matchStatus }: IOrderProductListSectionProps) {
  const navigate = useNavigate();

  return (
    <section className="px-4 pb-4 border-b border-b-4 border-b-black-1 flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h2 className="text-subtitle-medium">주문 상품</h2>
        {matchStatus && <span className={`text-small text-body-medium ${MATCH_STATUS_COLOR_MAP[matchStatus]}`}>{matchStatus}</span>}
      </div>

      {items.map((item) => (
        <div key={item.productId} className="flex flex-col gap-2">
          <OrderItem item={item} show={false} />
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
      ))}
    </section>
  );
}
