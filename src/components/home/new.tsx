import { NEWLIST } from '@/constants/home/newList';

import ProductCard from '@/components/home/productCard';

export default function New() {
  return (
    <div className="w-full flex flex-col gap-4">
      <p className="text-title-medium">신상품</p>
      <div className="w-full grid grid-cols-2 gap-x-2 gap-y-6.5">
        {NEWLIST.map((item) => (
          <ProductCard key={item.id} data={item} />
        ))}
      </div>
    </div>
  );
}
