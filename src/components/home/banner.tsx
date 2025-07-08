import 'swiper/css';

import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';

import Banner1 from '@/assets/images/banner/1.svg?react';
import Banner2 from '@/assets/images/banner/2.svg?react';
import Banner3 from '@/assets/images/banner/3.svg?react';
import Banner4 from '@/assets/images/banner/4.svg?react';

export default function Banner() {
  const [currentIndex, setCurrentIndex] = useState(1);
  return (
    <Swiper
      onSlideChange={(swiper) => setCurrentIndex(swiper.realIndex + 1)}
      slidesPerView={1}
      pagination={{ clickable: true }}
      loop={true}
      className="w-full h-auto relative"
    >
      <SwiperSlide>
        <Banner1 />
      </SwiperSlide>
      <SwiperSlide>
        <Banner2 />
      </SwiperSlide>
      <SwiperSlide>
        <Banner3 />
      </SwiperSlide>
      <SwiperSlide>
        <Banner4 />
      </SwiperSlide>
      <button className="z-20 absolute bottom-3 right-4 rounded-[30px] py-1 text-white text-small-regular px-2 bg-black-transparent-40">
        {currentIndex} / 4
      </button>
    </Swiper>
  );
}
