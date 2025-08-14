// components/orderDetail/OrderList.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import type { IOrder, IOrderItem } from '@/types/order/orderList';
import type { TReviewableOrderItem } from '@/types/review/myReview';
import { MATCH_STATUS_COLOR_MAP, ORDER_STATUS_COLOR_MAP } from '@/constants/product/statusColorMap';

import OrderItem from '@/components/review/orderItem';

import ChevronRight from '@/assets/ChevronRight2.svg';

interface IOrderProps {
  orders: IOrder[];
  onExpire?: () => void; // 만료 순간 refetch 등을 위해 부모에서 콜백 주입 가능
}

type TBEOrderStatus =
  | 'READY'
  | 'DONE'
  | 'CANCELED'
  | 'ABORTED'
  | 'EXPIRED'
  | 'SHIPPING'
  | 'DELIVERED'
  | 'REFUND_REQUESTED'
  | 'REFUND_FAILED'
  | 'REFUNDED'
  | 'TEAM_MATCHING_FAILED';

type TTOSKey =
  | '결제 대기'
  | '결제 완료'
  | '결제 취소'
  | '결제 실패'
  | '거래 취소'
  | '배송 중'
  | '배송 완료'
  | '환불 요청'
  | '환불 실패'
  | '환불 완료'
  | '매칭 실패';

const ORDER_STATUS_LABEL_MAP: Record<TBEOrderStatus, TTOSKey> = {
  READY: '결제 대기',
  DONE: '결제 완료',
  CANCELED: '결제 취소',
  ABORTED: '결제 실패',
  EXPIRED: '거래 취소',
  SHIPPING: '배송 중',
  DELIVERED: '배송 완료',
  REFUND_REQUESTED: '환불 요청',
  REFUND_FAILED: '환불 실패',
  REFUNDED: '환불 완료',
  TEAM_MATCHING_FAILED: '매칭 실패',
};

/** 팀 매칭 유효시간(분) — BE와 합의된 값으로 변경 */
const MATCH_TTL_MINUTES = 600;

/** BE 상태(영문) → UI 라벨(한글) 매핑 */
const MATCH_STATUS_LABEL_MAP: Record<'MATCHING' | 'COMPLETED' | 'FAILED', keyof typeof MATCH_STATUS_COLOR_MAP> = {
  MATCHING: '매칭 중',
  COMPLETED: '매칭 완료',
  FAILED: '매칭 실패',
};

function getRemainMs(teamCreatedAt: string | null) {
  if (!teamCreatedAt) return 0;
  const start = new Date(teamCreatedAt).getTime();
  const end = start + MATCH_TTL_MINUTES * 60_000;
  return Math.max(0, end - Date.now());
}

function formatHMS(ms: number) {
  const hh = String(Math.floor(ms / 3_600_000)).padStart(2, '0');
  const mm = String(Math.floor((ms % 3_600_000) / 60_000)).padStart(2, '0');
  const ss = String(Math.floor((ms % 60_000) / 1_000)).padStart(2, '0');
  return `${hh}:${mm}:${ss}`;
}

function Countdown({ teamCreatedAt, onExpire }: { teamCreatedAt: string | null; onExpire?: () => void }) {
  const [remain, setRemain] = useState<number>(() => getRemainMs(teamCreatedAt));

  useEffect(() => {
    setRemain(getRemainMs(teamCreatedAt));
    const t = setInterval(() => {
      const left = getRemainMs(teamCreatedAt);
      setRemain(left);
      if (left === 0) {
        clearInterval(t);
        onExpire?.();
      }
    }, 1000);
    return () => clearInterval(t);
  }, [teamCreatedAt, onExpire]);

  if (!teamCreatedAt) return null;
  return <span className="ml-2 text-xs text-gray-500">{remain === 0 ? '마감' : formatHMS(remain)}</span>;
}

export default function OrderList({ orders, onExpire }: IOrderProps) {
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
        <section key={order.id} className={`w-full pb-4 mb-4 ${index !== orders.length - 1 ? 'border-b-black-1 border-b-4' : ''}`}>
          <button className="w-full flex items-center justify-between px-4" onClick={() => navigate(`/mypage/order/orderDetailPersonal?orderId=${order.id}`)}>
            <p className="text-subtitle-medium text-left">
              {order.createdAt
                ? new Date(order.createdAt).toLocaleDateString('ko-KR', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                  })
                : '25.12.12'}
            </p>
            <img src={ChevronRight} alt=">" className="w-2 h-4" />
          </button>

          {/* 주문 아이템 카드 */}
          {order.items.map((item) => {
            type TOSKey = keyof typeof ORDER_STATUS_COLOR_MAP;
            type TMSKey = keyof typeof MATCH_STATUS_COLOR_MAP;

            const beOs = (item as any).orderStatus as TBEOrderStatus | null | undefined;
            const osLabel = beOs ? (ORDER_STATUS_LABEL_MAP[beOs] as TOSKey) : undefined;

            const beMs = (item as any).matchStatus as 'MATCHING' | 'COMPLETED' | 'FAILED' | null | undefined;
            const msLabel = beMs ? (MATCH_STATUS_LABEL_MAP[beMs] as TMSKey) : undefined;

            const isMatching = beMs === 'MATCHING';

            return (
              <div
                key={`${item.orderId}-${item.productId}`}
                className="px-4 pt-4 cursor-pointer"
                onClick={(e) => {
                  if ((e.target as HTMLElement).closest('button')) return;
                  navigate(`/mypage/order/orderDetailPersonal?orderId=${order.id}`);
                }}
              >
                {(osLabel || msLabel) && (
                  <div className="pb-4 flex justify-between items-center text-body-medium">
                    {/* 왼쪽: 주문 상태 */}
                    <div>{osLabel && <span className={ORDER_STATUS_COLOR_MAP[osLabel]}>{osLabel}</span>}</div>

                    {/* 오른쪽: 매칭 상태 + 카운트다운 */}
                    <div className="flex items-center gap-2">
                      {msLabel && <span className={MATCH_STATUS_COLOR_MAP[msLabel]}>{msLabel}</span>}
                      {isMatching && <Countdown teamCreatedAt={(item as any).teamCreatedAt ?? null} onExpire={onExpire} />}
                    </div>
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
