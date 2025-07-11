import type { IOrderItem } from '@/mocks/orderData';

interface IOrderItemProps {
  item: IOrderItem;
}

export default function OrderItem({ item }: IOrderItemProps) {
  return (
    <div className="flex gap-3">
      <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-md border border-black-3" />
      <div className="flex flex-col justify-between flex-1">
        <div>
          <p className="text-body-medium mb-1">{item.name}</p>
          <p className="text-small-regular text-black-4">{item.company}</p>
          <p className="text-small-regular text-black-4">{item.option}</p>
        </div>
        <div className="flex justify-between items-end">
          <p className="text-small-regular text-black-4">수량: {item.quantity}</p>
          <p className="text-body-medium">{item.price.toLocaleString()} 원</p>
        </div>
      </div>
    </div>
  );
}
