import { useNavigate } from 'react-router-dom';

import type { IOrderItem } from '@/mocks/orderData';

interface IOrderDataProps {
  item: IOrderItem;
}

export default function OrderItem({ item }: IOrderDataProps) {
  const navigate = useNavigate();
  return (
    <div className="w-full flex flex-col items-center justify-center">
      <div className="w-full flex items-center justify-center pt-5 pb-3">
        <img src={item.image} alt={item.name} className="w-21 h-21" />
        <div className="ml-3 w-full">
          <p className="text-black-4 text-small-medium pb-2">{item.company}</p>
          <p className="text-black text-small-medium pb-1">{item.name}</p>
          <p className="text-black-4 text-small-regular pb-2">
            {item.option}
            <span> / {item.quantity}개</span>
          </p>
          <p className="text-black text-small-medium">{item.price.toLocaleString('ko-KR')} 원</p>
        </div>
      </div>
      <button
        className="w-full h-10 border border-orange text-black mb-3 rounded flex items-center justify-center text-body-medium"
        onClick={() => navigate('/myPage/review/write')}
      >
        리뷰 작성
      </button>
    </div>
  );
}
