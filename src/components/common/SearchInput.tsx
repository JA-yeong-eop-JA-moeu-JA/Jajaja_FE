import type { ChangeEvent, FocusEvent, KeyboardEvent } from 'react';
import { toast } from 'sonner';

import InputSearchIcon from '@/assets/inputSearch.svg';

interface ISearchInputProps {
  value: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (e: FocusEvent<HTMLInputElement>) => void;
  onClick?: () => void;
  onEnter?: () => void;
  placeholder?: string;
  autoFocus?: boolean;
  disabled?: boolean;
  isLoading?: boolean;
}

export default function SearchInput({
  value,
  onEnter,
  onFocus,
  onChange,
  onClick,
  autoFocus = false,
  placeholder = '상품을 검색하세요.',
  disabled = false,
  isLoading = false,
}: ISearchInputProps) {
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onEnter?.();
    }
  };

  const handleSearchClick = () => {
    if (!value.trim()) {
      toast.error('검색어를 입력해주세요');
      return;
    }

    if (value.trim().length < 2) {
      toast.error('2글자 이상 입력해주세요');
      return;
    }

    onClick?.();
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
        disabled={disabled || isLoading}
        className={`w-full h-full pl-4 pr-10 border border-orange rounded bg-white text-[16px] leading-5 text-black placeholder-black-4 focus:outline-none ${
          disabled || isLoading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      />

      <div className="absolute right-0 top-1/2 w-[48px] h-[48px] p-1 -translate-y-1/2 flex items-center justify-center">
        {isLoading ? (
          <div className="w-6 h-6 border-2 border-orange border-t-transparent rounded-full animate-spin" />
        ) : (
          <img
            src={InputSearchIcon}
            alt="검색"
            className={`w-full h-full block ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:opacity-80 active:scale-95 transition-all'}`}
            onClick={disabled ? undefined : handleSearchClick}
          />
        )}
      </div>
    </div>
  );
}
