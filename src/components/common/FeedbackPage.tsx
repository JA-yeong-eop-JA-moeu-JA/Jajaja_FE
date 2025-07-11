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
        <div className="w-full max-w-[160px] aspect-square mb-6">
          <img src={iconSrc} alt="상태 아이콘" className="w-full h-full object-contain" />
        </div>
        <p className="text-base font-subtitle-medium">{title}</p>
        {subtitle && <p className="text-body-regular text-black-4 mt-2">{subtitle}</p>}
      </div>
    </div>
  );
}
