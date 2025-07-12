import type { IOrderItem } from '@/mocks/orderData';

export const ORDER_STATUS_COLOR_MAP: Record<NonNullable<IOrderItem['orderStatus']>, string> = {
  '배송 중': 'text-[color:var(--color-orange)]',
  '결제 완료': 'text-[color:var(--color-orange)]',
  '결제 취소': 'text-[color:var(--color-orange)]',
  '반품 접수': 'text-[color:var(--color-orange)]',
  '교환 접수': 'text-[color:var(--color-orange)]',
};

export const MATCH_STATUS_COLOR_MAP: Record<NonNullable<IOrderItem['matchStatus']>, string> = {
  '매칭 중': 'text-[color:var(--color-green)]',
  '매칭 완료': 'text-[color:var(--color-green)]',
  '매칭 실패': 'text-[color:var(--color-error-3)]',
  '': '',
};
