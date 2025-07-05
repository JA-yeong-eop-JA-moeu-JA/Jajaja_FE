import { useEffect } from 'react';

import { useProductCheckboxStore } from '@/stores/productCheckboxStore';

import StatefulCheckbox from '@/components/checkbox/StatefulCheckbox';
import BaseCheckbox from '@/components/common/checkbox';

export default function ExampleProductCheckbox() {
  const { initialize, toggleAll, isAllChecked } = useProductCheckboxStore();

  const productIds = ['1', '2', '3', '4'];

  useEffect(() => {
    initialize(productIds);
  }, []);

  const allChecked = isAllChecked();

  return (
    <div className="flex flex-col gap-2 mt-10">
      <BaseCheckbox
        checked={allChecked}
        onClick={() => toggleAll(!allChecked)}
        message="전체 선택"
        textClassName="text-[15px] leading-4 font-medium text-[#000000]"
      />

      {productIds.map((id) => (
        <StatefulCheckbox
          key={id}
          id={id}
          useStore={useProductCheckboxStore}
          message={`상품 ${id}`}
          textClassName="text-[15px] leading-4 font-medium text-[#000000]"
        />
      ))}
    </div>
  );
}
