import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import type { TGetReviews } from '@/types/product/product';

import { formatKoreanDateLabel } from '@/utils/time';

import { useModalStore } from '@/stores/modalStore';
import usePatchLike from '@/hooks/product/usePatchLike';

import StarRating from '@/components/product/starRating';

import Heart from '@/assets/icons/heart.svg?react';
import HeartFill from '@/assets/icons/heartFill.svg?react';

type TExtra = { productId?: number; productName?: string };
type TProps = TGetReviews & TExtra;

export default function ReviewCard({ review, isLike, imageUrls, productId, productName }: TProps) {
  const navigate = useNavigate();
  const { openModal } = useModalStore();
  const { id: routeId } = useParams<{ id: string }>();
  const { mutate } = usePatchLike();

  const [like, setLike] = useState<boolean>(isLike);
  const [likeCount, setLikeCount] = useState(review.likeCount);
  const [expanded, setExpanded] = useState(false);
  const [showToggle, setShowToggle] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const pid = productId ?? (review as any)?.productId ?? (routeId ? Number(routeId) : undefined);
  const nameToShow = productName ?? review.productName;

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    el.classList.remove('line-clamp-3');
    const full = el.scrollHeight;
    el.classList.add('line-clamp-3');
    const clamp = el.clientHeight;
    setShowToggle(full > clamp);
  }, [review]);

  const handleExpand = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    const el = contentRef.current;
    if (!el) return;
    setExpanded((prev) => !prev);
    !expanded ? el.classList.remove('line-clamp-3') : el.classList.add('line-clamp-3');
  };

  const handleLike = () => {
    setLike((prev) => !prev);
    setLikeCount((prev) => (like ? prev - 1 : prev + 1));
    mutate({ reviewId: review.id });
  };

  return (
    <Link to={`/product/${pid}`}>
      <div className="p-2 flex flex-col gap-2">
        <section>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <img className="w-8 h-8 rounded-full" src={review.profileUrl} />
              <div>
                <div className="mt-1 flex items-center gap-2 text-small-regular">
                  <p>{review.nickname}</p>
                  <p className="text-black-4">{formatKoreanDateLabel(review.createDate, 'short')}</p>
                </div>
                <div className="flex items-center gap-2 text-small-regular">
                  <StarRating w={9} h={9} star={review.rating || 0} />
                  <p className="text-[#ffc800]">{review.rating || 0}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2" onClick={handleLike}>
              <p className="text-tiny-medium text-orange">{likeCount}</p>
              {like ? <HeartFill /> : <Heart />}
            </div>
          </div>
        </section>

        <article className="text-black-4 text-body-regular">
          {nameToShow}
          {review.option && (
            <>
              <br />
              {review.option}
            </>
          )}
        </article>
        <article ref={contentRef} className="text-body-regular">
          {review.content}
        </article>

        {showToggle && (
          <section>
            <button className="text-body-regular text-black-4 underline underline-offset-2 mb-2" onClick={handleExpand}>
              {expanded ? '접기' : '더보기'}
            </button>
          </section>
        )}

        <section className="flex items-center gap-2">
          {imageUrls.slice(0, 4).map((img, idx) => (
            <div key={idx} className="relative">
              <img className="size-19" src={img} onClick={() => openModal('image', { src: img, images: imageUrls })} />
              {idx === 3 && review.imagesCount > 4 && (
                <div
                  className="flex justify-center items-center text-white text-body-regular absolute top-0 left-0 bg-[#00000099] w-full h-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!pid || !Number.isFinite(pid)) return;
                    navigate({ pathname: `/product/${pid}/photoReview`, search: '' });
                  }}
                >
                  +{review.imagesCount - 3}
                </div>
              )}
            </div>
          ))}
        </section>
      </div>
    </Link>
  );
}
