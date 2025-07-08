import bellIcon from '@/assets/bar_icons/bell.svg';
import searchIcon from '@/assets/bar_icons/search.svg';
import logo from '@/assets/logo.svg';
import { Link } from 'react-router-dom';

interface HeaderProps {
  showSearch?: boolean;
  showLogo?: boolean;
}

export default function Header({ showSearch = true, showLogo = true}: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full bg-white">
      <div className="flex items-center justify-between py-4">
        <img src={logo} alt="자자자 로고"   className={`h-6 ${showLogo ? '' : 'invisible'}`}
/>

        <div className="flex items-center gap-6">
          {showSearch && (
            <Link to="/search">
              <img src={searchIcon} alt="검색" className="w-6" />
            </Link>
          )}
            <Link to="/notifications">
              <img src={bellIcon} alt="알림" className="w-6" />
            </Link>
        </div>
      </div>
    </header>
  );
}
