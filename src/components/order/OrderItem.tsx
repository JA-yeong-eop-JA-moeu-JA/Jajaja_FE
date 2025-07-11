interface IOrderItemProps {
  name: string;
  price: number;
  company: string;
  imageUrl: string;
}

export default function OrderItem({ name, price, company, imageUrl }: IOrderItemProps) {
  return (
    <div className="flex mb-3">
      <img src={imageUrl} alt={name} className="w-16 h-16 bg-gray-100 rounded mr-3" />
      <div className="flex-1">
        <p className="text-small-medium text-black-4">{company}</p>
        <p className="text-small-medium">{name}</p>
        <p className="text-small-medium mt-1">{price.toLocaleString()} 원</p>
      </div>
    </div>
  );
}
