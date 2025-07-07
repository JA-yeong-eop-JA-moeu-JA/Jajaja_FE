import type { ChangeEvent } from 'react';

import InputSearchIcon from '@/assets/inputSearch.svg';

interface ISearchInputProps {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

export default function SearchInput({ value, onChange, placeholder = '상품을 검색하세요.' }: ISearchInputProps) {
  return (
    <div className="relative w-[328px] h-[40px]">
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full h-full pl-4 pr-10 border border-orange rounded bg-white text-[15px] leading-4 text-black placeholder-black-4 focus:outline-none"
      />
      <img src={InputSearchIcon} alt="검색" className="absolute right-0 top-1/2 w-[48px] h-[48px] p-1 -translate-y-1/2 block" />
    </div>
  );
}
