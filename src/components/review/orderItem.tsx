import { useNavigate } from 'react-router-dom';

import type { TReviewableOrderItem } from '@/types/review/myReview';

import type { ICartItem } from '@/pages/shoppingCart';

type TOrderItemType = TReviewableOrderItem | ICartItem;

export interface IOrderDataProps {
  item: TOrderItemType;
  show: boolean;
  showPrice?: boolean;
}

const isReviewableOrderItem = (orderItem: TOrderItemType): orderItem is TReviewableOrderItem => {
  return 'orderId' in orderItem && 'orderDate' in orderItem && 'orderProductId' in orderItem;
};

const isCartItem = (orderItem: TOrderItemType): orderItem is ICartItem => {
  return 'productId' in orderItem && 'optionId' in orderItem;
};

export default function OrderItem({ item, show, showPrice = true }: IOrderDataProps) {
  const navigate = useNavigate();

  const writeReview = () => {
    navigate('/mypage/review/new', {
      state: { item },
    });
  };

  const getDisplayData = (orderItem: TOrderItemType) => {
    if (isReviewableOrderItem(orderItem)) {
      return {
        imageUrl: orderItem.imageUrl,
        productName: orderItem.productName,
        store: orderItem.store,
        optionName: orderItem.optionName,
        quantity: orderItem.quantity,
        price: orderItem.price ?? 0,
        isReviewWritten: orderItem.isReviewWritten,
        teamPrice: undefined,
        individualPrice: undefined,
        discountRate: undefined,
      };
    } else if (isCartItem(orderItem)) {
      return {
        imageUrl: orderItem.imageUrl || orderItem.productThumbnail || '',
        productName: orderItem.productName,
        store: orderItem.store || orderItem.brand,
        optionName: orderItem.optionName,
        quantity: orderItem.quantity,
        price: showPrice ? orderItem.totalPrice || orderItem.price * orderItem.quantity : 0,
        isReviewWritten: false,
        teamPrice: orderItem.teamPrice,
        individualPrice: orderItem.individualPrice,
        discountRate: orderItem.discountRate,
      };
    }

    return {
      imageUrl: '',
      productName: '',
      store: '',
      optionName: '',
      quantity: 0,
      price: 0,
      isReviewWritten: false,
      teamPrice: undefined,
      individualPrice: undefined,
      discountRate: undefined,
    };
  };

  const displayData = getDisplayData(item);

  // 가격 표시 컴포넌트
  function PriceDisplay() {
    if (!showPrice) return null;

    // 장바구니 아이템인 경우 팀구매가와 개별구매가 모두 표시
    if (isCartItem(item) && displayData.teamPrice && displayData.individualPrice) {
      return (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="text-orange text-small-medium">{(displayData.teamPrice * displayData.quantity).toLocaleString('ko-KR')} 원</span>
            <span className="text-xs text-orange bg-orange-1 px-1 py-0.5 rounded">팀구매가</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-black-3 text-small-regular line-through">
              {(displayData.individualPrice * displayData.quantity).toLocaleString('ko-KR')} 원
            </span>
            <span className="text-xs text-black-3">개별구매가</span>
          </div>
          {displayData.discountRate && <span className="text-orange text-xs font-medium">{displayData.discountRate}% 할인</span>}
        </div>
      );
    }

    // 기존 가격 표시 (리뷰 아이템 등)
    if (displayData.price > 0) {
      return <p className="text-black text-small-medium">{displayData.price.toLocaleString('ko-KR')} 원</p>;
    }

    return null;
  }

  return !displayData.isReviewWritten ? (
    <div className="w-full flex flex-col items-center justify-center">
      <div className="w-full flex items-center justify-center">
        <img src={displayData.imageUrl} alt={displayData.productName} className="w-21 h-21 object-cover rounded" />
        <div className="ml-3 flex-1">
          <p className="text-black-4 text-small-medium pb-2">{displayData.store}</p>
          <p className="text-black text-small-medium pb-1">{displayData.productName}</p>
          <p className="text-black-4 text-small-regular pb-2">
            {displayData.optionName}
            <span> / {displayData.quantity}개</span>
          </p>
          <PriceDisplay />
        </div>
      </div>
      {show && (
        <button
          className="w-full h-10 border border-orange text-black py-1 mt-3 mb-7 rounded flex items-center justify-center text-body-medium hover:bg-orange hover:text-white transition-colors"
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
