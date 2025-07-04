import { useNavigate } from 'react-router-dom'
import backIcon from '@/assets/back.svg' 

// <PageHeader title="주문 상세" /> 이런 식으로 추가하면 됩니다!

interface PageHeaderBarProps {
  title?: string //props가 없는 경우도 있으니 선택적으로 설정
}

export default function PageHeaderBar({ title }: PageHeaderBarProps) {
  const navigate = useNavigate()

  return (
    <header className="w-full flex items-center justify-between px-0 py-4 bg-white">
      {/* 뒤로가기 버튼 */}
      <button onClick={() => navigate(-1)} className="flex items-center">
        <img src={backIcon} alt="뒤로가기" className="w-5 h-5" />
      </button>

      {/* 타이틀 */}
      <h1 className="text-base font-semibold text-center flex-1">{title}</h1>

      {/* 오른쪽 여백 (아이콘 없으면 비워둠) */}
      <div className="w-5" />
    </header>
  )
}

