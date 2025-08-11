import { useNavigate } from 'react-router-dom';

import type { TReviewableOrderItem } from '@/types/review/myReview';

export interface IOrderDataProps {
  item: TReviewableOrderItem;
  show: boolean;
  showPrice?: boolean;
}

export default function OrderItem({ item, show, showPrice = true }: IOrderDataProps) {
  const navigate = useNavigate();
  const writeReview = () => {
    navigate(`/mypage/review/new`, {
      state: { item },
    });
  };

  return !item.isReviewWritten ? (
    <div className="w-full flex flex-col items-center justify-center">
      <div className="w-full flex items-center justify-center">
        <img src={item.imageUrl} alt={item.productName} className="w-21 h-21" />
        <div className="ml-3 flex-1">
          <p className="text-black-4 text-small-medium pb-2">{item.store}</p>
          <p className="text-black text-small-medium pb-1">{item.productName}</p>
          <p className="text-black-4 text-small-regular pb-2">
            {item.optionName}
            <span> / {item.quantity}개</span>
          </p>
          {showPrice && <p className="text-black text-small-medium">{(item.price ?? 0).toLocaleString('ko-KR')} 원</p>}
        </div>
      </div>
      {show && (
        <button
          className="w-full h-10 border border-orange text-black py-1 mt-3 mb-7 rounded flex items-center justify-center text-body-medium"
          onClick={writeReview}
        >
          리뷰 작성
        </button>
      )}
    </div>
  ) : (
    <></>
  );
}
