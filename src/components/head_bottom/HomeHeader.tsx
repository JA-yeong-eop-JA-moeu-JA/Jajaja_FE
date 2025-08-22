import { Link } from 'react-router-dom';

import useGetNotiUnread from '@/hooks/notifications/useGetNotiUnread';

import bellIcon from '@/assets/bar_icons/bell.svg';
import searchIcon from '@/assets/bar_icons/search.svg';
import logo from '@/assets/logo.svg';

interface IHeaderProps {
  showSearch?: boolean;
  showLogo?: boolean;
}

const cap = (n: number) => (n > 9 ? '+' : String(n));

export default function Header({ showSearch = true, showLogo = true }: IHeaderProps) {
  const { count } = useGetNotiUnread();

  return (
    <header className="sticky top-0 z-50 w-full bg-white">
      <div className="flex items-center justify-between px-2 h-14">
        <img src={logo} alt="자자자 로고" className={`h-6 ${showLogo ? '' : 'invisible'}`} />

        <div className="flex items-center gap-6">
          <Link to="/search">
            <img src={searchIcon} alt="검색" className={`w-5  ${showSearch ? '' : 'invisible'} `} />
          </Link>

          <Link to="/notifications">
            <img src={bellIcon} alt="알림" className="w-5" />
            {count > 0 && (
              <span className="absolute right-0.5 top-2 translate-x-0.25 translate-y-0.25 w-4 h-4 px-1 rounded-full bg-red-500 text-white leading-5 text-center text-small-medium">
                {cap(count)}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
