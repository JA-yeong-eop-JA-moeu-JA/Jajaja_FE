import type { IOrderItem } from '@/mocks/orderData';

export const ORDER_STATUS_COLOR_MAP = {
  '결제 완료': 'text-orange-500',
  '결제 취소': 'text-red-500',
  '결제 실패': 'text-red-500',
  '거래 취소': 'text-red-500',
  '배송 중': 'text-green-500',
  '배송 완료': 'text-green-700',
  '환불 요청': 'text-orange-500',
  '환불 실패': 'text-red-500',
  '환불 완료': 'text-gray-500',
  '매칭 실패': 'text-red-500',
} as const;

export const MATCH_STATUS_COLOR_MAP: Record<NonNullable<IOrderItem['matchStatus']>, string> = {
  '매칭 중': 'text-green',
  '매칭 완료': 'text-green',
  '매칭 실패': 'text-error-3',
};
