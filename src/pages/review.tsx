import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { useModalStore } from '@/stores/modalStore';
import useGetInfinite from '@/hooks/review/useGetInfinite';
import useGetReviewDetail from '@/hooks/review/useGetReviewDetail';

import ProductHeader from '@/components/head_bottom/ProductHeader';
import ReviewCard from '@/components/product/reviewCard';

import Star from '@/assets/icons/star.svg?react';

export default function PhotoReview() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { data } = useGetReviewDetail();
  const { openModal } = useModalStore();
  const imageList = [...(data?.result.imageUrls ?? [])];
  const [sortType, setSortType] = useState<'LATEST' | 'RECOMMEND'>('LATEST');

  const { data: reviewDetail, fetchNextPage, hasNextPage } = useGetInfinite(sortType);
  const allReviews = reviewDetail?.pages.flatMap((page) => page.result.reviews) ?? [];
  const bottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!bottomRef.current || !hasNextPage) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) fetchNextPage();
      },
      { threshold: 0.2 }, // 1.0 → 0.2 권장
    );
    observer.observe(bottomRef.current);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, sortType]); // ← 여기 추가!

  return (
    <div className="pb-3">
      <ProductHeader />
      <section className="px-4 pb-4 flex items-center gap-3">
        <p>리뷰 {data?.result.reviewCount}개</p>
        <div className="flex items-center gap-1">
          <Star className="w-4 h-4 fill-[#FFC800]" />
          <p>{data?.result.avgRating}</p>
        </div>
      </section>
      <section className="w-full grid grid-cols-3 gap-1">
        {imageList.slice(0, 6).map((img, idx) => (
          <div key={idx} className="relative">
            <img src={img} className="w-full aspect-square object-cover" onClick={() => openModal('image', { src: img, images: imageList })} />
            {idx === 5 && (
              <div
                className="flex justify-center items-center text-white text-subtitle-semibold absolute top-0 left-0 bg-[#00000099] w-full h-full"
                onClick={() => navigate(`/product/${id}/photoReview`)}
              >
                +{imageList.length - 5}
              </div>
            )}
          </div>
        ))}
      </section>
      <section className="flex items-center justify-self-end gap-3 text-body-regular mt-6 mb-3 mr-3">
        <div className="flex justify-end text-body-regular text-black-4 mb-1">
          {[
            { label: '최신순', value: 'LATEST' },
            { label: '추천순', value: 'RECOMMEND' },
          ].map(({ label, value }, index, array) => (
            <div key={value} className="flex items-center">
              <button onClick={() => setSortType(value as 'LATEST' | 'RECOMMEND')} className={sortType === value ? 'text-body-medium text-black' : ''}>
                {label}
              </button>
              {index < array.length - 1 && <span className="px-3 text-black-2">|</span>}
            </div>
          ))}
        </div>
      </section>
      <section className="px-2">
        <div className="flex flex-col gap-3">
          {allReviews.length > 0 ? (
            allReviews.map((item, idx) => (
              <div key={idx} className="flex flex-col">
                <ReviewCard {...item} />
                {idx !== allReviews.length - 1 && <hr className="border-black-1" />}
              </div>
            ))
          ) : (
            <div className="w-full flex justify-center items-center text-body-regular text-black-4 h-20">
              <p>아직 등록된 리뷰가 없어요.</p>
            </div>
          )}
        </div>
        <div ref={bottomRef} className="h-1" />
      </section>
      <div ref={bottomRef} className="h-1" />
    </div>
  );
}
