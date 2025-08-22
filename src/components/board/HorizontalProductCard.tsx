import { Link } from 'react-router-dom';

type THorizontalProductCardProps = {
  data: {
    teamId: number;
    discountRate: number;
    price: number;
    productId: number;
    productName: string;
    thumbnailUrl: string;
    nickname: string;
    leaderProfileImageUrl: string;
  };
};

export default function HorizontalProductCard({ data }: THorizontalProductCardProps) {
  const { productId, discountRate, price, productName, thumbnailUrl, nickname, leaderProfileImageUrl } = data;

  return (
    <Link
      to={`/product/${productId}`}
      className="block" // 전체 클릭 가능
      aria-label={`${productName} 상품 상세로 이동`}
    >
      <div className="w-[328px] flex w-full p-2 pb-5 border-b border-b-1" style={{ borderBottomColor: 'var(--color-black-2)' }}>
        <img src={thumbnailUrl} alt={productName} className="w-26 h-26 object-cover rounded-md flex-shrink-0" />

        <div className="w-[104px] flex flex-col ml-2 flex-grow text-body-regular">
          <div className="flex items-center mb-1 gap-2 text-body-regular text-black-4">
            <img src={leaderProfileImageUrl} alt={nickname} className="w-8 h-8 rounded-full object-cover" />
            <span>{nickname}</span>
          </div>
          <div className="w-[212px] mt-2 text-base">
            <span className="text-error-3 text-subtitle-medium">{discountRate}% </span>
            <span className="text-subtitle-medium">{price.toLocaleString()} 원</span>
          </div>

          <p className="text-body-regular mt-1 leading-tight line-clamp-2">{productName}</p>
        </div>
      </div>
    </Link>
  );
}
