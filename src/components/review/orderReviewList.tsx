import { format } from 'date-fns';

import type { TReviewableOrderList } from '@/types/review/myReview';

import OrderItem from './orderItem';

interface IOrderProps {
  orders: TReviewableOrderList[];
}

export default function OrderReviewList({ orders }: IOrderProps) {
  return (
    <div className="w-full flex flex-col items-center justify-center pl-4 pr-3 pb-2">
      {orders.map((order) => (
        <section key={order.id} className="w-full">
          <p className="pt-6 pb-5">{format(new Date(order.date), 'yy.MM.dd.')}</p>
          {order.items.map((item) => (
            <OrderItem key={order.id} item={item} show={true} />
          ))}
        </section>
      ))}
    </div>
  );
}
