import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import type { IOrder, IOrderItem } from '@/types/order/orderList';
import type { TReviewableOrderItem } from '@/types/review/myReview';
import { MATCH_STATUS_COLOR_MAP, ORDER_STATUS_COLOR_MAP } from '@/constants/product/statusColorMap';

import OrderItem from '@/components/review/orderItem';
import ChevronRight from '@/assets/ChevronRight2.svg';

interface IOrderProps {
  orders: IOrder[];
  onExpire?: () => void;
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

/** BE 매칭 상태(영문) */
type TBackendMatch = 'MATCHING' | 'COMPLETED' | 'FAILED';

/** BE 상태(영문) → UI 라벨(한글) 매핑 (MATCH_STATUS_COLOR_MAP의 key와 동일해야 함) */
const MATCH_STATUS_LABEL_MAP: Record<TBackendMatch, keyof typeof MATCH_STATUS_COLOR_MAP> = {
  MATCHING: '매칭 중',
  COMPLETED: '매칭 완료',
  FAILED: '매칭 실패',
};

function getRemainMs(teamCreatedAt: string | null) {
  if (!teamCreatedAt) return 0;
  const start = new Date(teamCreatedAt).getTime();
  const end = start + MATCH_TTL_MINUTES * 60_000;
  const now = Date.now();
  return Math.max(0, end - now);
}

function formatHMS(ms: number) {
  const hh = String(Math.floor(ms / 3_600_000)).padStart(2, '0');
  const mm = String(Math.floor((ms % 3_600_000) / 60_000)).padStart(2, '0');
  const ss = String(Math.floor((ms % 60_000) / 1_000)).padStart(2, '0');
  return `${hh}:${mm}:${ss}`;
}

function Countdown({
  teamCreatedAt,
  onExpire,
}: {
  teamCreatedAt: string | null;
  onExpire?: () => void;
}) {
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
  return (
    <span className="ml-2 text-xs text-gray-500">
      {remain === 0 ? '마감' : formatHMS(remain)}
    </span>
  );
}

type TOrderStatusKey = keyof typeof ORDER_STATUS_COLOR_MAP;
type TMatchStatusKey = keyof typeof MATCH_STATUS_COLOR_MAP;

type TOrderListItem = IOrderItem & {
  orderProductId: number;
  orderStatus?: TOrderStatusKey;
  matchStatus?: TMatchStatusKey;
  orderDate?: string;
  /** BE 원시값들(존재 시) */
  teamCreatedAt?: string | null;
  /** BE가 영문 상태를 내려줄 수 있으므로 any로 안전캐스팅용 */
  orderStatusRaw?: TBEOrderStatus | null;
  matchStatusRaw?: TBackendMatch | null;
};

export default function OrderList({ orders, onExpire }: IOrderProps) {
  const navigate = useNavigate();

  const toReviewable = (it: TOrderListItem): TReviewableOrderItem => ({
    orderId: it.orderId,
    orderDate: '', // 필요 시 상위 order.createdAt을 내려 매핑
    orderProductId: it.orderProductId,
    productId: it.productId,
    productName: it.name,
    store: it.company,
    optionName: it.option,
    imageUrl: it.image ?? null,
    price: it.price,
    quantity: it.quantity,
    isReviewWritten: Boolean(it.reviewed),
  });

  return (
    <div className="w-full flex flex-col">
      {orders.map((order, index) => {
        const orderDateLabel = order.createdAt
          ? new Date(order.createdAt).toLocaleDateString('ko-KR', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
            })
          : '25.12.12';

        return (
          <section
            key={order.id}
            className={`w-full pb-4 mb-4 ${
              index !== orders.length - 1 ? 'border-b-black-1 border-b-4' : ''
            }`}
          >
            <button
              type="button"
              className="w-full flex items-center justify-between pr-2 pl-4"
              onClick={() =>
                navigate(`/mypage/order/orderDetailPersonal?orderId=${order.id}`)
              }
            >
              <p className="text-subtitle-medium text-left">{orderDateLabel}</p>
              <img src={ChevronRight} alt=">" className="w-2 h-4" />
            </button>

            {/* 주문 아이템 카드 */}
            {order.items.map((rawItem) => {
              // 필요한 필드만 안전하게 추려서 사용
              const item: TOrderListItem = {
                ...rawItem,
                orderProductId: (rawItem as any).orderProductId,
                teamCreatedAt: (rawItem as any).teamCreatedAt ?? null,
                orderStatusRaw: (rawItem as any).orderStatus ?? null,
                matchStatusRaw: (rawItem as any).matchStatus ?? null,
                // Ensure orderStatus and matchStatus are of the correct type and not null
                orderStatus: (rawItem as any).orderStatus
                  ? (ORDER_STATUS_LABEL_MAP[(rawItem as any).orderStatus as TBEOrderStatus] as TOrderStatusKey)
                  : undefined,
                matchStatus: (rawItem as any).matchStatus
                  ? (MATCH_STATUS_LABEL_MAP[(rawItem as any).matchStatus as TBackendMatch] as TMatchStatusKey)
                  : undefined,
              };

              const osLabel = item.orderStatusRaw
                ? (ORDER_STATUS_LABEL_MAP[item.orderStatusRaw] as TOrderStatusKey)
                : undefined;

              const msLabel = item.matchStatusRaw
                ? (MATCH_STATUS_LABEL_MAP[item.matchStatusRaw] as TMatchStatusKey)
                : undefined;

              const isMatching = item.matchStatusRaw === 'MATCHING';

              return (
                <div
                  key={`${order.id}-${item.orderProductId ?? item.productId}`}
                  className="px-4 pt-4 cursor-pointer"
                  onClick={(e) => {
                    if ((e.target as HTMLElement).closest('button')) return;
                    navigate(`/mypage/order/orderDetailPersonal?orderId=${order.id}`);
                  }}
                >
                  {(osLabel || msLabel) && (
                    <div className="pb-2 flex justify-between items-center text-body-medium">
                      {/* 왼쪽: 주문 상태 */}
                      <div>
                        {osLabel && (
                          <span className={ORDER_STATUS_COLOR_MAP[osLabel]}>
                            {osLabel}
                          </span>
                        )}
                      </div>

                      {/* 오른쪽: 매칭 상태 + 카운트다운 */}
                      <div className="flex items-center gap-2">
                        {msLabel && (
                          <span className={MATCH_STATUS_COLOR_MAP[msLabel]}>
                            {msLabel}
                          </span>
                        )}
                        {isMatching && (
                          <Countdown
                            teamCreatedAt={item.teamCreatedAt ?? null}
                            onExpire={onExpire}
                          />
                        )}
                      </div>
                    </div>
                  )}

                  <OrderItem item={toReviewable(item)} show={false} />
                </div>
              );
            })}
          </section>
        );
      })}
    </div>
  );
}
