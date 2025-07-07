import PageHeader from '../head_bottom/PageHeader';

interface IFeedbackPageProps {
  iconSrc: string;
  title: string;
  subtitle?: string;
}

export default function FeedbackPage({ iconSrc, title, subtitle }: IFeedbackPageProps) {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <PageHeader />

      <div className="flex flex-col flex-1 items-center justify-center px-4 text-center pt-16 pb-30">
        <img src={iconSrc} alt="상태 아이콘" className="w-[150px] h-[150px] mb-6 mx-auto" />
        <p className="text-base font-semibold">{title}</p>
        {subtitle && <p className="text-sm text-gray-500 mt-2">{subtitle}</p>}
      </div>
    </div>
  );
}
