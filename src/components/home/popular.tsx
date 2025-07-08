import { POPULARLIST } from '@/constants/home/popularList';

import ProductCard from '@/components/home/productCard';

export default function Popular() {
  return (
    <div className="w-full flex flex-col gap-4">
      <p className="text-title-medium">인기 상품</p>
      <div className="w-full grid grid-cols-2 gap-x-2 gap-y-6.5">
        {POPULARLIST.map((item) => (
          <ProductCard key={item.id} data={item} />
        ))}
      </div>
    </div>
  );
}
