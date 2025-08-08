import type { TProduct } from '@/types/home/product';
import { CATEGORIES } from '@/constants/onBoarding/categoryList';

import Storage from '@/utils/storage';

import ProductCard from '@/components/home/productCard';

type TProps = {
  data: TProduct[] | undefined;
};
export default function Recommand({ data }: TProps) {
  const handleCategory = () => {
    const category = Number(Storage.getCategory());
    return category === 8 || !category ? '다른' : CATEGORIES.find((cat) => cat.id === category)?.name;
  };
  return (
    <div className="w-full flex flex-col gap-4">
      <div>
        <p className="text-title-medium">추천 상품</p>
        <p className="text-body-regular text-black-4">{handleCategory()} 사장님들이 최근에 구매했어요.</p>
      </div>
      <div className="w-full grid grid-cols-2 gap-x-2 gap-y-6.5">
        {data?.map((item) => (
          <ProductCard key={item.id} {...item} />
        ))}
      </div>
    </div>
  );
}
