export interface IOrderItem {
  orderId: number;
  productId: number;
  name: string;
  company: string;
  price: number;
  image: string;
  option: string;
  quantity: number;
  reviewed: boolean;
  orderStatus: '배송 중' | '결제 완료' | '결제 취소' | '반품 접수' | '교환 접수';
  matchStatus?: '매칭 중' | '매칭 완료' | '매칭 실패' | undefined;
}

export interface IOrder {
  id: number;
  items: IOrderItem[];
  createdAt: string;
}

export const orderData: IOrder[] = [
  {
    id: 1,
    items: [
      {
        orderId: 1,
        productId: 1,
        name: '카누 미니 마일드 로스트 커피 0.9g x 150스틱',
        company: '카누',
        price: 23920,
        image: '/src/assets/myPage/review/item/1.svg',
        option: '[기획 세트] 150스틱',
        quantity: 2,
        reviewed: false,
        orderStatus: '배송 중',
        matchStatus: '매칭 중',
      },
      {
        orderId: 1,
        productId: 2,
        name: '복음자리 100% 땅콩버터 스무스 280g',
        company: '복음자리',
        price: 23920,
        image: '/src/assets/myPage/review/item/2.svg',
        option: '[단품] 땅콩 버터 스무스',
        quantity: 2,
        reviewed: false,
        orderStatus: '결제 완료',
        matchStatus: '매칭 완료',
      },
    ],
    createdAt: '25.05.12.',
  },
  {
    id: 2,
    items: [
      {
        orderId: 2,
        productId: 1,
        name: '카누 미니 마일드 로스트 커피 0.9g x 150스틱',
        company: '카누',
        price: 23920,
        image: '/src/assets/myPage/review/item/1.svg',
        option: '[기획 세트] 150스틱',
        quantity: 2,
        reviewed: false,
        orderStatus: '결제 취소',
        matchStatus: '매칭 실패',
      },
    ],
    createdAt: '25.05.12.',
  },
  {
    id: 3,
    items: [
      {
        orderId: 2,
        productId: 1,
        name: '카누 미니 마일드 로스트 커피 0.9g x 150스틱',
        company: '카누',
        price: 23920,
        image: '/src/assets/myPage/review/item/1.svg',
        option: '[기획 세트] 150스틱',
        quantity: 2,
        reviewed: false,
        orderStatus: '반품 접수',
      },
    ],
    createdAt: '25.05.12.',
  },
];
