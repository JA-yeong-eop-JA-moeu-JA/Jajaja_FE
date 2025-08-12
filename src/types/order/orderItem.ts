export interface IOrderItem {
  orderId: number;
  productId: number;
  name: string;
  company: string;
  option: string;
  quantity: number;
  image: string;
  price: number;
  reviewed: boolean;
}
