import { useEffect, useState } from 'react';

import type { TOption } from '@/types/product/option';

import Down from '@/assets/icons/down.svg?react';

type TProps = {
  options?: TOption[];
  value?: number;
  onChange?: (selected: { id: number }) => void;
};

export default function DropDown({ options, value, onChange }: TProps) {
  const optionList = [{ id: 0, name: '옵션 선택' }, ...(options ?? [])];
  const [isOpen, setIsOpen] = useState(false);
  const [, setSelectedId] = useState<number>(value ?? 0);

  useEffect(() => {
    if (value !== undefined) {
      setSelectedId(value);
    }
  }, [value, options]);

  const handleSelect = (id: number) => {
    if (!isOpen) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
      onChange?.({ id });
    }
  };

  const renderList = isOpen ? optionList : [optionList[0]];

  return (
    <div className="border border-black-3 rounded-sm overflow-hidden">
      {renderList.map(({ name, id }, idx) => {
        const isFirst = idx === 0;
        const isLast = idx === renderList.length - 1;
        return (
          <div
            key={id}
            onClick={() => handleSelect(id)}
            className={`w-full h-10 px-4 flex justify-between items-center text-body-regular ${isFirst && id === 0 ? 'text-black-4' : ''} ${!isLast ? 'border-b border-black-3' : ''}`}
          >
            <p>{name}</p>
            {isFirst && (isOpen ? <Down className="w-4 h-2 rotate-180" /> : <Down className="w-4 h-2" />)}
          </div>
        );
      })}
    </div>
  );
}
