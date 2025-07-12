import PageHeader from '@/components/head_bottom/PageHeader';
import OrderList from '@/components/orderDetail/OrderList';

import { orderData } from '@/mocks/orderData';

export default function OrderListPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* 상단 헤더 */}
      <header className="mb-2">
        <PageHeader title="주문/배송" />
      </header>

      {/* 주문 리스트 */}
      <main className="flex-1 overflow-y-auto">
        <OrderList orders={orderData} />
      </main>
    </div>
  );
}
