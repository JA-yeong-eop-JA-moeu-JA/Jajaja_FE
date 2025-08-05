import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { REVIEW_LIST } from '@/constants/product/reviews';
import { TOTALLIST } from '@/constants/search/totalList';

import { useModalStore } from '@/stores/modalStore';

import ProductHeader from '@/components/head_bottom/ProductHeader';
import ReviewCard from '@/components/product/reviewCard';

import Star from '@/assets/icons/star.svg?react';

export default function PhotoReview() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { review, star } = TOTALLIST[Number(id)];
  const { openModal } = useModalStore();
  const imageList = REVIEW_LIST.flatMap(({ images }) => images);
  const [selected, setSelected] = useState<'latest' | 'recommend'>('latest');
  return (
    <div className="pb-3">
      <ProductHeader />
      <section className="px-4 pb-4 flex items-center gap-3">
        <p>리뷰 {review}개</p>
        <div className="flex items-center gap-1">
          <Star className="w-4 h-4 fill-[#FFC800]" />
          <p>{star}</p>
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
        <button onClick={() => setSelected('latest')} className={`px-1 ${selected === 'latest' ? 'text-body-medium' : 'text-black-4'}`}>
          최신순
        </button>

        <div className="w-px h-4 bg-black-4" />

        <button onClick={() => setSelected('recommend')} className={`px-1 ${selected === 'recommend' ? 'text-body-medium' : 'text-black-4'}`}>
          추천순
        </button>
      </section>
      <section className="px-2">
        <div className="flex flex-col gap-3">
          {REVIEW_LIST.map((item, idx) => (
            <div key={idx} className="flex flex-col gap-3">
              <ReviewCard data={item} />
              {idx !== REVIEW_LIST.length - 1 && <hr className="border-black-1" />}
            </div>
          ))}
          {REVIEW_LIST.length === 0 && (
            <div className="w-full flex justify-center items-center text-body-regular text-black-4 h-20">
              <p>아직 등록된 리뷰가 없어요.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
