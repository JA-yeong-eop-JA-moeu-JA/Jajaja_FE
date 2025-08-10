import { useNavigate } from 'react-router-dom';

import type { TProduct } from '@/types/home/product';

import Star from '@/assets/icons/star.svg?react';

export default function ProductCard({ id, name, store, price, imageUrl, discountRate, rating, reviewCount }: TProduct) {
  const navigate = useNavigate();
  const hot = discountRate >= 30;
  return (
    <div key={id} className="w-full flex flex-col gap-3" onClick={() => navigate(`/product/${id}`)}>
      <div className="relative">
        <img src={imageUrl} className="w-full" />
        {hot && <div className="flex justify-center items-center absolute top-0 bg-green-hover text-small-medium text-white left-0 w-9.25 h-6">핫딜</div>}
      </div>
      <div className="flex flex-col gap-1">
        <div className="flex items-center text-body-medium gap-1">
          {!!discountRate && <p className="text-error-3">{discountRate}%</p>}
          <p>{price.toLocaleString()} 원</p>
        </div>
        <div>
          <p className="text-small-medium">{name}</p>
          <p className="text-small-regular text-black-4">{store}</p>
        </div>
        <div className="flex items-center gap-1 text-small-medium">
          <Star className="fill-[#FFC800]" />
          <p className="text-[#FFC800]">{rating}</p>
          <p className="text-black-4">· 리뷰 {reviewCount}</p>
        </div>
      </div>
    </div>
  );
}
