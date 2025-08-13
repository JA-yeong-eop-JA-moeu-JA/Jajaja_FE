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
  const [selected, setSelected] = useState<'LATEST' | 'RECOMMEND'>('LATEST');

  const { data: reviewDetail, fetchNextPage, hasNextPage } = useGetInfinite(selected);
  const allReviews = reviewDetail?.pages.flatMap((page) => page.result.reviews) ?? [];
  const bottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!bottomRef.current || !hasNextPage) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) fetchNextPage();
      },
      { threshold: 1.0 },
    );
    observer.observe(bottomRef.current);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage]);
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
        <button onClick={() => setSelected('LATEST')} className={`px-1 ${selected === 'LATEST' ? 'text-body-medium' : 'text-black-4'}`}>
          최신순
        </button>

        <div className="w-px h-4 bg-black-4" />

        <button onClick={() => setSelected('RECOMMEND')} className={`px-1 ${selected === 'RECOMMEND' ? 'text-body-medium' : 'text-black-4'}`}>
          추천순
        </button>
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
