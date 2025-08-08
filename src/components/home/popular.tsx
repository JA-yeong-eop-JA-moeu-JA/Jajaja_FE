import type { TProduct } from '@/types/home/product';

import ProductCard from '@/components/home/productCard';

type TProps = {
  data: TProduct[] | undefined;
};
export default function Popular({ data }: TProps) {
  return (
    <div className="w-full flex flex-col gap-4">
      <p className="text-title-medium">인기 상품</p>
      <div className="w-full grid grid-cols-2 gap-x-2 gap-y-6.5">
        {data?.map((item) => (
          <ProductCard key={item.id} {...item} />
        ))}
      </div>
    </div>
  );
}
