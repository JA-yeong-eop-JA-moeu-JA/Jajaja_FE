import { useState } from 'react';

import { REVIEW_LIST } from '@/constants/product/reviews';

import { useModalStore } from '@/stores/modalStore';

import ProductHeader from '@/components/head_bottom/ProductHeader';

export default function PhotoReview() {
  const imageList = REVIEW_LIST.flatMap(({ images }) => images);
  const { openModal } = useModalStore();
  const [selected, setSelected] = useState<'latest' | 'recommend'>('latest');
  return (
    <div className="pb-5">
      <ProductHeader />
      <section className="flex items-center justify-self-end gap-3 text-body-regular my-3 mr-3">
        <button onClick={() => setSelected('latest')} className={`px-1 ${selected === 'latest' ? 'text-body-medium' : 'text-black-4'}`}>
          최신순
        </button>

        <div className="w-px h-4 bg-black-4" />

        <button onClick={() => setSelected('recommend')} className={`px-1 ${selected === 'recommend' ? 'text-body-medium' : 'text-black-4'}`}>
          추천순
        </button>
      </section>
      <section className="w-full grid grid-cols-3 gap-1">
        {imageList.map((img, idx) => (
          <img src={img} key={idx} className="w-full aspect-square object-cover" onClick={() => openModal('image', { src: img, imageList: imageList})} />
        ))}
      </section>
    </div>
  );
}
