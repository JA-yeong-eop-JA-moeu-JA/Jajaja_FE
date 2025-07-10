import { Button } from '@/components/common/button/button';
import PageHeader from '@/components/head_bottom/PageHeader';

import errorIcon from '@/assets/error.svg';

export default function NotFoundPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <PageHeader />

      {/* 본문 */}
      <div className="flex flex-col flex-1 items-center justify-center text-center px-4">
        <img src={errorIcon} alt="에러 아이콘" className="w-[150px] h-[150px] mb-6" />
        <p className="text-base font-semibold">페이지를 찾을 수 없습니다.</p>
        <p className="text-sm text-gray-500 mt-2">잠시 후 다시 시도해주세요.</p>
      </div>

      {/* 버튼 */}
      <div className="pb-2 flex w-full px-4">
        <Button kind="basic" variant="solid-orange" className="w-full" onClick={() => (window.location.href = '/')}>
          홈으로
        </Button>
      </div>
    </div>
  );
}
