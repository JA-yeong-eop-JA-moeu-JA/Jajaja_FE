export interface IOrderProduct {
  id: number;
  name: string;
  price: number;
  company: string;
  imageUrl: string;
}

export const ORDER_PRODUCTS: IOrderProduct[] = [
  {
    id: 1,
    name: '카누 미니 마일드 로스트 커피 0.9g x 150스틱',
    price: 23920,
    company: '카누',
    imageUrl: '/src/assets/images/recommand/2.svg',
  },
  {
    id: 2,
    name: '복음자리 100% 땅콩버터 스무스 280g',
    price: 23920,
    company: '복음자리',
    imageUrl: '/src/assets/images/recommand/1.svg',
  },
];
