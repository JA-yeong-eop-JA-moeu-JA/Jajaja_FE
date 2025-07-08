import Star from '@/assets/icons/star.svg?react';

type TProductCardProps = {
  data: {
    id: number;
    sale: number;
    price: number;
    name: string;
    company: string;
    star: number;
    review: number;
    imageUrl: string;
    tag?: string;
  };
};
export default function ProductCard({ data }: TProductCardProps) {
  const { id, sale, price, name, company, star, review, imageUrl, tag } = data;
  return (
    <div key={id} className="w-full flex flex-col gap-3">
      <div className="relative">
        <img src={imageUrl} className="w-full" />
        {!!tag && (
          <div className="flex justify-center items-center absolute top-0 bg-green-hover text-small-medium text-white left-0 w-9.25 h-6">
            {tag === 'new' ? '신규' : '인기'}
          </div>
        )}
      </div>
      <div className="flex flex-col gap-1">
        <div className="flex items-center text-body-medium gap-1">
          {!!sale && <p className="text-error-3">{sale}%</p>}
          <p>{price.toLocaleString()} 원</p>
        </div>
        <div>
          <p className="text-small-medium">{name}</p>
          <p className="text-small-regular text-black-4">{company}</p>
        </div>
        <div className="flex items-center gap-1 text-tiny-medium">
          <Star />
          <p className="text-[#FFC800]">{star}</p>
          <p className="text-black-4">· 리뷰 {review}</p>
        </div>
      </div>
    </div>
  );
}
