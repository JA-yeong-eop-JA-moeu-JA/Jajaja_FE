import { useNavigate } from 'react-router-dom';

import BackIcon from '@/assets/bar_icons/back.svg?react';
import CartIcon from '@/assets/bar_icons/cart.svg?react';
import SearchIcon from '@/assets/bar_icons/search.svg?react';

export default function ProductHeader() {
  const navigate = useNavigate();

  return (
    <header className="w-full max-w-[600px] h-[56px] px-0 flex items-center justify-between bg-white">
      {/* 왼쪽: 뒤로가기 */}
      <button onClick={() => navigate(-1)} className="p-1">
        <BackIcon className="w-6 h-6" />
      </button>

      <div className="flex-1" />

      <div className="flex items-center gap-0">
        <SearchIcon />
        <CartIcon />
      </div>
    </header>
  );
}
