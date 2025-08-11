import { useMyOrders } from '@/hooks/order/orderLists';

import PageHeader from '@/components/head_bottom/PageHeader';
import OrderList from '@/components/orderDetail/OrderList';

export default function OrderListPage() {
  const { data: orders = [], isLoading, isError } = useMyOrders();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="mb-2">
        <PageHeader title="주문/배송" />
      </header>

      <main className="flex-1 overflow-y-auto pb-24">
        {isLoading ? (
          <p className="text-center text-black-3">주문 불러오는 중...</p>
        ) : isError ? (
          <p className="text-center text-error-3">주문 조회에 실패했습니다.</p>
        ) : orders.length === 0 ? (
          <p className="text-center text-black-3">주문이 없습니다.</p>
        ) : (
          <OrderList orders={orders} />
        )}
      </main>
    </div>
  );
}
