import { useEffect, useRef, useState } from 'react';

import { useModalStore } from '@/stores/modalStore';
import useGetPhoto from '@/hooks/review/useGetPhoto';

import ProductHeader from '@/components/head_bottom/ProductHeader';

export default function PhotoReview() {
  const { openModal } = useModalStore();
  const [selected, setSelected] = useState<'LATEST' | 'RECOMMEND'>('LATEST');

  const { data: photoReview, fetchNextPage, hasNextPage } = useGetPhoto(selected);
  const imageList = photoReview?.pages.flatMap((page) => page.result.images.map((img) => img.imageUrl)) ?? [];

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
    <div className="pb-5">
      <ProductHeader />
      <section className="flex items-center justify-self-end gap-3 text-body-regular my-3 mr-3">
        <button onClick={() => setSelected('LATEST')} className={`px-1 ${selected === 'LATEST' ? 'text-body-medium' : 'text-black-4'}`}>
          최신순
        </button>

        <div className="w-px h-4 bg-black-4" />

        <button onClick={() => setSelected('RECOMMEND')} className={`px-1 ${selected === 'RECOMMEND' ? 'text-body-medium' : 'text-black-4'}`}>
          추천순
        </button>
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
