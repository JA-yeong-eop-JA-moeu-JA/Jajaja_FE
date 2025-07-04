import { NavLink } from 'react-router-dom'
import homeIcon from '/src/assets/home.svg';
import boardIcon from '/src/assets/board.svg';
import categoryIcon from '/src/assets/category.svg';
import cartIcon from '/src/assets/basket.svg';
import myIcon from '/src/assets/my.svg';



const navItems = [
  { to: '/', icon: homeIcon, label: '홈' },
  { to: '/board', icon: boardIcon, label: '게시판' },
  { to: '/category', icon: categoryIcon, label: '카테고리' },
  { to: '/cart', icon: cartIcon, label: '장바구니' },
  { to: '/mypage', icon: myIcon, label: '마이페이지' },
];


export default function BottomBar() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white grid grid-cols-5 pr-2 pl-2 py-2 text-sm">
      {navItems.map(({ to, icon, label }) => (
      <NavLink
        key={to}
        to={to}
        className={({ isActive }) =>
          `flex flex-col items-center gap-1 transition-colors ${
            isActive ? 'text-gray-800' : 'text-gray-400'
            } hover:text-gray-600`
                  }
    >
      <img src={icon} alt={`${label} 아이콘`} className="w-5 h-5" />
      <span>{label}</span>
    </NavLink>
  ))}
</nav>

  )
}
