import { useNavigate } from 'react-router-dom';

import backIcon from '@/assets/back.svg';
import cartIcon from '@/assets/cart.svg';
import searchIcon from '@/assets/search.svg';

export default function ProductHeader() {
  const navigate = useNavigate();

  return (
    <header className="w-full max-w-sm h-[56px] px-0 flex items-center justify-between bg-white">
      {/* 왼쪽: 뒤로가기 */}
      <button onClick={() => navigate(-1)} className="p-1">
        <img src={backIcon} alt="뒤로가기" className="w-5 h-5" />
      </button>

      {/* 가운데: 여백 (자동으로 공간 확보) */}
      <div className="flex-1" />

      {/* 오른쪽: 검색 + 장바구니 */}
      <div className="flex items-center gap-0">
        <img src={searchIcon} alt="검색" className="w-11" />
        <img src={cartIcon} alt="장바구니" className="w-11" />
      </div>
    </header>
  );
}
