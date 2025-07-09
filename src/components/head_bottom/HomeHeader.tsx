import { Link } from 'react-router-dom';

import bellIcon from '@/assets/bar_icons/bell.svg';
import searchIcon from '@/assets/bar_icons/search.svg';
import logo from '@/assets/logo.svg';

interface IHeaderProps {
  showSearch?: boolean;
  showLogo?: boolean;
}

export default function Header({ showSearch = true, showLogo = true }: IHeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full bg-white">
      <div className="flex items-center justify-between px-2 py-4">
        <img src={logo} alt="자자자 로고" className={`h-6 ${showLogo ? '' : 'invisible'}`} />

        <div className="flex items-center gap-6">
          <Link to="/search">
            <img src={searchIcon} alt="검색" className={`w-5  ${showSearch ? '' : 'invisible'} `} />
          </Link>

          <Link to="/notifications">
            <img src={bellIcon} alt="알림" className="w-5" />
          </Link>
        </div>
      </div>
    </header>
  );
}
