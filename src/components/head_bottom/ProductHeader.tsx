import { useNavigate } from 'react-router-dom';

import backIcon from '@/assets/bar_icons/back.svg';
import cartIcon from '@/assets/bar_icons/cart.svg';
import searchIcon from '@/assets/bar_icons/search.svg';

export default function ProductHeader() {
  const navigate = useNavigate();

  return (
    <header className="w-full max-w-sm h-[56px] px-0 flex items-center justify-between bg-white">
      <button onClick={() => navigate(-1)} className="p-1">
        <img src={backIcon} alt="뒤로가기" className="w-5 h-5" />
      </button>

      <div className="flex-1" />

      <div className="flex items-center gap-6">
        <img src={searchIcon} alt="검색" className="w-6" />
        <img src={cartIcon} alt="장바구니" className="w-6" />
      </div>
    </header>
  );
}
