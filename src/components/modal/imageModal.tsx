import { useState } from 'react';

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

  const handleMove = (offset: number) => {
    const newIndex = currentIndex + offset;
    if (newIndex >= 0 && newIndex < imageList.length) {
      setCurrentIndex(newIndex);
    }
  };

  const currentImage = imageList[currentIndex];

  return (
    <div className="w-[600px] h-full relative flex items-center justify-center">
      <div className="w-full relative">
        <img src={currentImage} className="w-full aspect-square object-cover" />
        {currentIndex > 0 && (
          <button onClick={() => handleMove(-1)} className="absolute left-2 top-1/2 transform -translate-y-1/2">
            <Prev />
          </button>
        )}
        {currentIndex < imageList.length - 1 && (
          <button onClick={() => handleMove(1)} className="absolute right-2 top-1/2 transform -translate-y-1/2">
            <Next />
          </button>
        )}
      </div>
      <Close className="absolute top-2 right-2 cursor-pointer" onClick={closeModal} />
    </div>
  );
}
