import { useLayoutEffect, useRef, useState } from 'react';

import { useModalStore } from '@/stores/modalStore';

import type { IMyReview } from '@/mocks/reviewData';

interface IReviewDataProps {
  item: IMyReview;
}

export default function ReviewItem({ item }: IReviewDataProps) {
  const [expanded, setExpanded] = useState(false);
  const [isOverflow, setIsOverflow] = useState(false);
  const pRef = useRef<HTMLParagraphElement>(null);
  const { openModal } = useModalStore();

  useLayoutEffect(() => {
    const el = pRef.current;
    if (!el) return;

    const hasOverflow = el.scrollHeight > el.clientHeight;
    setIsOverflow(hasOverflow);
  }, [item.comment, expanded]);

  return (
    <div className="w-full flex flex-col items-center justify-center py-5 border-b border-black-1">
      <div className="flex flex-col items-start justify-center gap-2 w-full">
        <div className="flex items-center justify-between w-full">
          <p className="text-black text-body-medium">{item.createdAt}</p>
          <button className="text-error-3 text-small-medium" onClick={() => openModal('alert', { message: '등록한 리뷰를 삭제할까요?' })}>
            삭제
          </button>
        </div>
        <div>
          {/* 별도 컴포넌트로 추후 구현 예정 */}
          <span className="text-body-medium text-[#FFC800]">{item.starRating}</span>
        </div>
        <div className="text-black text-body-regular">
          <p>{item.name}</p>
          <p>옵션:{item.option}</p>
        </div>
        <div>
          <p ref={pRef} className={`text-black-4 text-body-regular ${expanded ? '' : 'line-clamp-5'}`}>
            {item.comment}
          </p>
          {!expanded && isOverflow && (
            <button className="text-black-3 text-body-regular py-1 underline" onClick={() => setExpanded(true)}>
              더보기
            </button>
          )}
          {expanded && (
            <button className="text-black-3 text-body-regular py-1 underline" onClick={() => setExpanded(false)}>
              접기
            </button>
          )}
        </div>
      </div>
      <div className="w-full flex items-center justify-start gap-2 py-3">
        {/* 4장 이상 처리 상세보기 구현 예정 */}
        {item.images?.slice(0, 4).map((url: string, index: number) => (
          <img key={index} src={url} alt={`Review image ${index + 1}`} className="w-19 h-19 object-cover" />
        ))}
      </div>
      <div className="w-full flex items-center justify-start gap-2">
        {/* 하트 토글 구현 예정 */}
        <div className="text-orange text-body-medium">{item.likeCount}</div>
        <div className="text-center text-black border border-black-1 px-2 py-1 text-small-regular">{item.rewardPoints} P 지급 완료</div>
      </div>
    </div>
  );
}
