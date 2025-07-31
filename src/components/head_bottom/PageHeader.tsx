import { useNavigate } from 'react-router-dom';

import backIcon from '@/assets/bar_icons/back.svg';

interface IPageHeaderBarProps {
  title?: string;
}

export default function PageHeaderBar({ title }: IPageHeaderBarProps) {
  const navigate = useNavigate();

  return (
    <header className="w-full relative h-14 bg-white flex items-center">
      <button onClick={() => navigate(-1)} className="absolute left-3 top-1/2 -translate-y-1/2">
        <img src={backIcon} alt="뒤로가기" className="w-5 h-5" />
      </button>

      <h1 className="w-full text-center text-body-medium">{title}</h1>
    </header>
  );
}
