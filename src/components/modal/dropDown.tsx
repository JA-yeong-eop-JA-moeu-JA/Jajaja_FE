import { useState } from 'react';

import type { TOption } from '@/types/product/option';

import Down from '@/assets/icons/down.svg?react';

type TProps = {
  options?: TOption[];
  onChange?: (selected: { id: number }) => void;
};

export default function DropDown({ options, onChange }: TProps) {
  const optionList = [{ id: 0, name: '옵션 선택' }, ...(options ?? [])];
  const [isOpen, setIsOpen] = useState(false);
  const [list, setList] = useState(optionList.slice(0, 1));

  const handleSelect = (id: number) => {
    if (!isOpen) {
      setIsOpen(true);
      setList(optionList);
    } else {
      setIsOpen(false);
      setList(optionList.slice(0, 1));
      onChange?.({ id });
    }
  };

  return (
    <div className="border border-black-3 rounded-sm overflow-hidden">
      {list.map(({ name, id }, idx) => {
        const isFirst = idx === 0;
        const isLast = idx === list.length - 1;
        return (
          <div
            key={id}
            onClick={() => handleSelect(idx)}
            className={`w-full h-10 px-4 flex justify-between items-center text-body-regular ${isFirst ? 'text-black-4' : ''} ${!isLast ? 'border-b border-black-3' : ''}`}
          >
            <p>{name}</p>
            {isFirst && (isOpen ? <Down className="w-4 h-2 rotate-180" /> : <Down className="w-4 h-2" />)}
          </div>
        );
      })}
    </div>
  );
}
