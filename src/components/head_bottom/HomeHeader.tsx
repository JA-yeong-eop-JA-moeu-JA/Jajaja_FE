import bellIcon from '@/assets/bar_icons/bell.svg';
import searchIcon from '@/assets/bar_icons/search.svg';
import logo from '@/assets/logo.svg';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-white">
      <div className="flex items-center justify-between px-0 py-4">
        <img src={logo} alt="자자자 로고" className="h-7" />

        {/* 아이콘 크기 키우고 간격 좁히기 */}
        <div className="flex items-center gap-0">
          <img src={searchIcon} alt="검색" className="w-11" />
          <img src={bellIcon} alt="알림" className="w-11" />
        </div>
      </div>
    </header>
  );
}
