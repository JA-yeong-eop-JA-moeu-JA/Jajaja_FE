import { useNavigate } from 'react-router-dom';

import type { TReviewableOrderItem } from '@/types/review/myReview';

// API 응답에 맞는 장바구니 아이템 타입
interface ICartItem {
  id: number;
  productId: number;
  productName: string;
  brand: string;
  optionId: number;
  optionName: string;
  quantity: number;
  productThumbnail: string;
  individualPrice?: number;
  teamPrice?: number;
  totalPrice: number;
  teamAvailable: boolean;
}

type TOrderItemType = TReviewableOrderItem | ICartItem;

export interface IOrderDataProps {
  item: TOrderItemType;
  show: boolean;
  showPrice?: boolean;
  // 같은 상품의 여러 옵션에 대한 총합 가격 (선택적)
  totalTeamPrice?: number;
  totalIndividualPrice?: number;
  showTotalPriceOnly?: boolean; // 총합 가격만 표시할지 여부
}

const isReviewableOrderItem = (orderItem: TOrderItemType): orderItem is TReviewableOrderItem => {
  return 'orderId' in orderItem && 'orderDate' in orderItem && 'orderProductId' in orderItem;
};

const isCartItem = (orderItem: TOrderItemType): orderItem is ICartItem => {
  return 'productId' in orderItem && 'optionId' in orderItem && 'brand' in orderItem;
};

export default function OrderItem({ item, show, showPrice = true, totalTeamPrice, totalIndividualPrice, showTotalPriceOnly = false }: IOrderDataProps) {
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
        imageUrl: orderItem.productThumbnail || '',
        productName: orderItem.productName,
        store: orderItem.brand,
        optionName: orderItem.optionName,
        quantity: orderItem.quantity,
        price: showPrice ? orderItem.totalPrice : 0,
        isReviewWritten: false,
        teamPrice: orderItem.teamPrice,
        individualPrice: orderItem.individualPrice,
        discountRate: undefined,
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

    // 총합 가격만 표시하는 경우 (같은 상품의 여러 옵션 그룹)
    if (showTotalPriceOnly && totalTeamPrice && totalIndividualPrice) {
      return (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="text-black-3 text-small-regular line-through">{totalIndividualPrice.toLocaleString('ko-KR')} 원</span>
            <span className="text-body-medium">{totalTeamPrice.toLocaleString('ko-KR')} 원</span>
          </div>
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
