import { RECOMMANDS } from '@/constants/home/recommandList';

import Storage from '@/utils/storage';

import ProductCard from '@/components/home/productCard';

export default function Recommand() {
  const handleCategory = () => {
    const category = Storage.getCategory();
    return category === '기타' || !category ? '다른' : category;
  };
  return (
    <div className="w-full flex flex-col gap-4">
      <div>
        <p className="text-title-medium">추천 상품</p>
        <p className="text-body-regular text-black-4">{handleCategory()} 사장님들이 최근에 구매했어요.</p>
      </div>
      <div className="w-full grid grid-cols-2 gap-x-2 gap-y-6.5">
        {RECOMMANDS.map((item) => (
          <ProductCard key={item.id} data={item} />
        ))}
      </div>
    </div>
  );
}
