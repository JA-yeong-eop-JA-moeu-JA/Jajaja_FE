// src/components/StarRating.tsx
import { useState } from 'react';

import Star from '@/assets/myPage/review/star.svg?react';
import StarLine from '@/assets/myPage/review/starLine.svg?react';

interface IReviewStarRatingProps {
  initialRating?: number;
  onChange?: (rating: number) => void;
}

export default function ReviewStarRating({ initialRating = 0, onChange }: IReviewStarRatingProps) {
  const [rating, setRating] = useState<number>(initialRating);
  const handleClick = (newRating: number) => {
    setRating(newRating);
    onChange && onChange(newRating);
  };

  return (
    <div className="w-full flex items-center justify-center">
      {[1, 2, 3, 4, 5].map((star) => {
        const Icon = star <= rating ? Star : StarLine;
        return (
          <div className="p-3" key={star}>
            <Icon onClick={() => handleClick(star)} className="w-5 h-5 cursor-pointer" />
          </div>
        );
      })}
    </div>
  );
}
