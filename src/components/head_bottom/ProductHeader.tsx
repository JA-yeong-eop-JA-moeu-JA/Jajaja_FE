import { useNavigate } from 'react-router-dom';

import BackIcon from '@/assets/bar_icons/back.svg?react';
import CartIcon from '@/assets/bar_icons/cart.svg?react';
import SearchIcon from '@/assets/bar_icons/search.svg?react';

export default function ProductHeader() {
  const navigate = useNavigate();

  return (
    <header className="w-full h-[56px] flex items-center justify-between bg-white">
      {/* 왼쪽: 뒤로가기 */}
      <button onClick={() => navigate(-1)} className="p-1">
        <BackIcon className="w-5 h-5" />
      </button>

      <div className="flex-1" />

      <div className="flex items-center gap-4 m-4 p-2">
        <SearchIcon className="w-5" onClick={() => navigate('/search')} />
        <CartIcon />
      </div>
    </header>
  );
}
