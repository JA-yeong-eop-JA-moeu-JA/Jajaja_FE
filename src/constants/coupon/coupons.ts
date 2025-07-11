export interface ICoupon {
  id: number;
  discountText: string;
  title: string;
  description: string;
  minPrice: string;
  expiredAt: string;
}

export const coupons: ICoupon[] = [
  {
    id: 1,
    discountText: '1000 원',
    title: '[유제품] 마켓 찜 할인 쿠폰',
    description: '50,000 원 이상 구매 시 사용 가능',
    minPrice: '50,000 원 이상 구매 시 사용 가능',
    expiredAt: '2025-07-30 23:59 까지',
  },
  {
    id: 2,
    discountText: '10%',
    title: '[동서식품] 할인 쿠폰',
    description: '1 원 이상 구매 시 사용 가능',
    minPrice: '1 원 이상 구매 시 사용 가능',
    expiredAt: '2025-07-30 23:59 까지',
  },
  {
    id: 3,
    discountText: '20%',
    title: '[디에잇가구] 식탁 할인 쿠폰',
    description: '50,000 원 이상 구매 시 사용 가능',
    minPrice: '50,000 원 이상 구매 시 사용 가능',
    expiredAt: '2025-07-30 23:59 까지',
  },
];
