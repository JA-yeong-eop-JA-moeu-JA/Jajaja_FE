import 'swiper/css';

import { useRef, useState } from 'react';
import type { Swiper as SwiperType } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

import { REVIEW_LIST } from '@/constants/product/reviews';

import { useModalStore } from '@/stores/modalStore';

import Close from '@/assets/icons/modalClose.svg?react';
import Next from '@/assets/icons/next.svg?react';
import Prev from '@/assets/icons/prev.svg?react';

export default function ImageModal(props?: Record<string, string | number>) {
  const imageList = REVIEW_LIST.flatMap(({ images }) => images);
  const { closeModal } = useModalStore();

  const startIdx = imageList.findIndex((img) => img === String(props?.src));
  const [currentIndex, setCurrentIndex] = useState(startIdx);
  const swiperRef = useRef<SwiperType | null>(null);

  const handleMove = (offset: number) => {
    const newIndex = currentIndex + offset;
    if (newIndex >= 0 && newIndex < imageList.length) {
      swiperRef.current?.slideTo(newIndex);
    }
  };

  return (
    <div className="w-[600px] h-full relative flex items-center justify-center">
      <Swiper
        initialSlide={startIdx >= 0 ? startIdx : 0}
        onSlideChange={(swiper) => setCurrentIndex(swiper.activeIndex)}
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        className="w-full relative"
      >
        {imageList.map((img, idx) => (
          <SwiperSlide key={idx} className="pointer-events-none">
            <img src={img} className="w-full aspect-square object-cover pointer-events-auto" />
          </SwiperSlide>
        ))}
      </Swiper>

      {currentIndex > 0 && (
        <button onClick={() => handleMove(-1)} className="absolute left-0 top-1/2 -translate-y-1/2 z-10">
          <Prev />
        </button>
      )}
      {currentIndex < imageList.length - 1 && (
        <button onClick={() => handleMove(1)} className="absolute right-0 top-1/2 -translate-y-1/2 z-10">
          <Next />
        </button>
      )}

      <Close className="absolute top-0 right-0 cursor-pointer z-10" onClick={closeModal} />
    </div>
  );
}
