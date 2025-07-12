import type { TPoint } from '@/types/point';

export type TPointType = TPoint['type'];

export const PointLabel: Record<TPointType, string> = {
  review: '리뷰 작성',
  share: '친구에게 공유',
  order: '첫 팀 구매 완료',
};

export const pointData: TPoint[] = [
  {
    id: 1,
    content: '커피빈 마일드 원두 10kg',
    createdAt: '09.10.',
    expiredAt: '2025-09-12',
    type: 'review',
    amount: 100,
  },
  {
    id: 2,
    content: '커피빈 마일드 원두 10kg',
    createdAt: '09.10.',
    expiredAt: '2025-09-12',
    type: 'share',
    amount: 300,
  },
  {
    id: 3,
    content: '커피빈 마일드 원두 10kg',
    createdAt: '09.10.',
    expiredAt: '2025-09-12',
    type: 'order',
    amount: 500,
  },
];
