import type { ChangeEvent, FocusEvent, KeyboardEvent } from 'react';

import InputSearchIcon from '@/assets/inputSearch.svg';

interface ISearchInputProps {
  value: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (e: FocusEvent<HTMLInputElement>) => void;
  onClick?: () => void;
  onEnter?: () => void;
  placeholder?: string;
  autoFocus?: boolean;
}

export default function SearchInput({ value, onEnter, onFocus, onChange, onClick, autoFocus = false, placeholder = '상품을 검색하세요.' }: ISearchInputProps) {
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onEnter?.();
    }
  };
  return (
    <div className="relative w-full h-[40px]">
      <input
        type="text"
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        autoFocus={autoFocus}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="w-full h-full pl-4 pr-10 border border-orange rounded bg-white text-[15px] leading-4 text-black placeholder-black-4 focus:outline-none"
      />
      <img src={InputSearchIcon} alt="검색" className="absolute right-0 top-1/2 w-[48px] h-[48px] p-1 -translate-y-1/2 block" onClick={onClick} />
    </div>
  );
}
