import { Button } from './button/button';
import PageHeader from '../head_bottom/PageHeader';

interface IFeedbackPageProps {
  iconSrc: string;
  title: string;
  subtitle?: string;
  leftButtonText?: string;
  onLeftClick?: () => void;
  rightButtonText: string;
  onRightClick: () => void;
}

export default function FeedbackPage({ iconSrc, title, subtitle, leftButtonText, onLeftClick, rightButtonText, onRightClick }: IFeedbackPageProps) {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <PageHeader />

      <div className="flex flex-col flex-1 items-center justify-center px-4 text-center">
        <img src={iconSrc} alt="상태 아이콘" className="w-[150px] h-[150px] mb-6 mx-auto" />
        <p className="text-base font-semibold">{title}</p>
        {subtitle && <p className="text-sm text-gray-500 mt-2">{subtitle}</p>}
      </div>

      <div className="flex w-full fixed bottom-0 left-0 right-0 z-10 pb-2">
        {leftButtonText && (
          <Button kind="basic" variant="outline-gray" className="w-1/2 h-[48px] border-r border-black-3 px-4" onClick={onLeftClick}>
            {leftButtonText}
          </Button>
        )}
        <Button kind="basic" variant="solid-orange" className="w-1/2 h-[48px] px-4" onClick={onRightClick}>
          {rightButtonText}
        </Button>
      </div>
    </div>
  );
}
