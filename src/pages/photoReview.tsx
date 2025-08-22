import { useEffect, useRef, useState } from 'react';

import { useModalStore } from '@/stores/modalStore';
import useGetPhoto from '@/hooks/review/useGetPhoto';

import ProductHeader from '@/components/head_bottom/ProductHeader';

export default function PhotoReview() {
  const { openModal } = useModalStore();
  const [sortType, setSortType] = useState<'LATEST' | 'RECOMMEND'>('LATEST');

  const { data: photoReview, fetchNextPage, hasNextPage } = useGetPhoto(sortType);
  const imageList = photoReview?.pages.flatMap((page) => page.result.images.map((img) => img.imageUrl)) ?? [];

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
  }, [fetchNextPage, hasNextPage, sortType]);

  return (
    <div className="pb-5">
      <ProductHeader />
      <section className="flex items-center justify-end gap-3 text-body-regular my-3 mr-3">
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
      </section>
      <section className="w-full grid grid-cols-3 gap-1">
        {imageList.map((img, idx) => (
          <img src={img} key={idx} className="w-full aspect-square object-cover" onClick={() => openModal('image', { src: img, images: imageList })} />
        ))}
      </section>
      <div ref={bottomRef} className="h-1" />
    </div>
  );
}
