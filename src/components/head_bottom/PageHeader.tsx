import { useNavigate } from 'react-router-dom';

import backIcon from '@/assets/bar_icons/back.svg';

// <PageHeader title="주문 상세" /> 이런 식으로 추가하면 됩니다!

interface IPageHeaderBarProps {
  title?: string; //props가 없는 경우도 있으니 선택적으로 설정
}

export default function PageHeaderBar({ title }: IPageHeaderBarProps) {
  const navigate = useNavigate();

  return (
    <header className="w-full flex items-center justify-between px-1 h-14 bg-white">
      <button onClick={() => navigate(-1)} className="flex items-center px-3">
        <img src={backIcon} alt="뒤로가기" className="w-5 h-5" />
      </button>

      <h1 className="text-base font-semibold text-center flex-1">{title}</h1>

      <div className="w-5" />
    </header>
  );
}
