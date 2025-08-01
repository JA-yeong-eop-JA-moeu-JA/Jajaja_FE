import { useNavigate } from 'react-router-dom';

import type { IOrderItem } from '@/mocks/orderData';

export interface IOrderDataProps {
  item: IOrderItem;
  show: boolean;
  showPrice?: boolean;
}

export default function OrderItem({ item, show, showPrice = true }: IOrderDataProps) {
  const navigate = useNavigate();

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <div className="w-full flex items-center justify-center">
        <img src={item.image} alt={item.name} className="w-21 h-21" />
        <div className="ml-3 flex-1">
          <p className="text-black-4 text-small-medium pb-2">{item.company}</p>
          <p className="text-black text-small-medium pb-1">{item.name}</p>
          <p className="text-black-4 text-small-regular pb-2">
            {item.option}
            <span> / {item.quantity}개</span>
          </p>
          {showPrice && <p className="text-black text-small-medium">{item.price.toLocaleString('ko-KR')} 원</p>}
        </div>
      </div>
      {show && (
        <button
          className="w-full h-10 border border-orange text-black my-3 rounded flex items-center justify-center text-body-medium"
          onClick={() => navigate(`/mypage/review/${item.orderId}/${item.productId}`)}
        >
          리뷰 작성
        </button>
      )}
    </div>
  );
}
