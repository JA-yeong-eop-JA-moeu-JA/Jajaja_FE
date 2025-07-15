import { useLayoutEffect, useRef, useState } from 'react';

import { useModalStore } from '@/stores/modalStore';

import StarRating from '../product/starRating';

import Heart from '@/assets/icons/heart.svg?react';
import HeartFill from '@/assets/icons/heartFill.svg?react';
import type { IMyReview } from '@/mocks/reviewData';

interface IReviewDataProps {
  item: IMyReview;
}

export default function ReviewItem({ item }: IReviewDataProps) {
  const [expanded, setExpanded] = useState(false);
  const [isOverflow, setIsOverflow] = useState(false);
  const pRef = useRef<HTMLParagraphElement>(null);
  const [liked, setLiked] = useState(false);
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
        <div className="flex items-center justify-center gap-1">
          <StarRating w={16} h={16} star={item.starRating} />
          <p className="text-body-medium text-[#FFC800]">{item.starRating}</p>
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
        {item.images?.slice(0, 4).map((url: string, index: number) => (
          <div key={index} className="relative">
            <img
              src={url}
              alt={`Review image ${index + 1}`}
              onClick={() => openModal('image', { src: url, imageList: item.images })}
              className="w-19 h-19 object-cover"
            />
            {index === 3 && item.images && item.images.length > 4 && (
              <div
                className="flex justify-center items-center text-white text-body-regular absolute top-0 left-0 bg-black/60 w-full h-full"
                onClick={() => openModal('image', { src: url, imageList: item.images })}
              >
                +{item.images.length - 3}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="w-full flex items-center justify-start gap-2">
        <div className="flex items-center gap-1" onClick={() => setLiked((prev) => !prev)}>
          {liked ? <HeartFill className="w-4 h-3.5" /> : <Heart className="w-4 h-3.5" />}
          <p className="text-body-medium text-orange">{liked ? item.likeCount + 1 : item.likeCount}</p>
        </div>
        <div className="text-center text-black border border-black-1 px-2 py-1 text-small-regular">{item.rewardPoints} P 지급 완료</div>
      </div>
    </div>
  );
}
