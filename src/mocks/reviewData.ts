import type { IOrderItem } from './orderData';

export interface IMyReview extends Pick<IOrderItem, 'productId' | 'name' | 'option'> {
  reviewId: number;
  comment: string;
  starRating: number;
  likeCount: number;
  rewardPoints?: number;
  createdAt: string;
  images?: string[];
}

export const myReviewData: IMyReview[] = [
  {
    reviewId: 1,
    productId: 1,
    name: '카누 미니 마일드 로스트 커피 0.9g x 150스틱',
    option: '[기획 세트] 150스틱',
    comment: '카누의 깊은 맛이 우유와 잘 어울려요. 손님들이 무척 좋아하셔서 3번째 재구매 했습니다.',
    starRating: 5,
    likeCount: 12,
    rewardPoints: 100,
    createdAt: '25.12.02.',
    images: ['/src/assets/myPage/review/my/1.svg', '/src/assets/myPage/review/my/2.svg', '/src/assets/myPage/review/my/3.svg'],
  },
  {
    reviewId: 2,
    productId: 2,
    name: '복음자리 100% 땅콩버터 스무스 280g',
    option: '[단품] 땅콩 버터 스무스',
    comment:
      '피스타치오의 깊은 맛이 우유와 잘 어울려요. 손님들이 무척 좋아하셔서 3번째 재구매 했습니다. 피스타치오와 말차 맛을 헷갈리시는 분들이 많은데 사실 말이 안 된다고 생각하긴 합니다. 말차 덕후로서 말차 맛집을 추천 드리자면 홍대 롱베케이션 말차 롤케이크를 꼭 드셔야 합니다.',
    starRating: 5,
    likeCount: 32,
    rewardPoints: 100,
    createdAt: '25.12.02.',
    images: ['/src/assets/myPage/review/my/4.svg', '/src/assets/myPage/review/my/5.svg'],
  },
];
