import { useNavigate } from 'react-router-dom';

import { MATCH_STATUS_COLOR_MAP, ORDER_STATUS_COLOR_MAP } from '@/constants/product/statusColorMap';

import ChevronRight from '@/assets/ChevronRight2.svg'; // ✅ 화살표 다시 포함

import type { IOrder } from '@/mocks/orderData';

interface IOrderProps {
  orders: IOrder[];
}

export default function OrderList({ orders }: IOrderProps) {
  const navigate = useNavigate();

  return (
    <div className="w-full flex flex-col">
      {orders.map((order, index) => (
        <section key={order.id} className={`w-full pb-4 mb-4 ${index !== orders.length - 1 ? 'border-b-black-1 border-b-4' : ''}`}>
          <button className="w-full flex items-center justify-between pb-2 px-4" onClick={() => navigate('/mypage/order/orderDetailPersonal')}>
            {/** 나중에 /mypage/order/${order.id}로 바꿔야함!! */}
            <p className="text-subtitle-medium text-left">{order.createdAt}</p>
            <img src={ChevronRight} alt=">" className="w-2 h-4" />
          </button>

          {/* 주문 아이템 카드 */}
          {order.items.map((item) => (
            <div
              key={`${item.orderId}-${item.productId}`}
              className="px-4 pt-4 cursor-pointer"
              onClick={(e) => {
                // 내부 버튼 눌렀을 땐 이동 막기
                if ((e.target as HTMLElement).closest('button')) return;
                navigate(`/mypage/order/orderDetailPersonal`);
              }}
            >
              {/* 상태 텍스트 */}
              {(item.orderStatus || item.matchStatus) && (
                <div className="flex justify-between text-body-medium">
                  {item.orderStatus && <span className={ORDER_STATUS_COLOR_MAP[item.orderStatus]}>{item.orderStatus}</span>}
                  {item.matchStatus && <span className={MATCH_STATUS_COLOR_MAP[item.matchStatus]}>{item.matchStatus}</span>}
                </div>
              )}
              {/* 상품 카드 */}
              {/*               <OrderItem item={item} show={false} />
               */}
            </div>
          ))}
        </section>
      ))}
    </div>
  );
}
