import Star from '@/assets/icons/star.svg?react';

interface IStarRatingProps {
  star: number;
  w?: number;
  h?: number;
}

export default function StarRating({ star, w, h }: IStarRatingProps) {
  const stars = Array.from({ length: 5 });

  return (
    <div className="flex gap-1">
      {stars.map((_, i) => {
        let fill = '#d1d5db';
        if (i + 1 <= star) fill = '#facc15';
        else if (i < star) fill = 'url(#half)';

        return (
          <svg key={i} style={{ width: w ?? 12, height: h ?? 12 }} viewBox="0 0 9 9" fill="none">
            <defs>
              <linearGradient id="half">
                <stop offset="50%" stopColor="#facc15" />
                <stop offset="50%" stopColor="#d1d5db" />
              </linearGradient>
            </defs>
            <Star fill={fill} />
          </svg>
        );
      })}
    </div>
  );
}
