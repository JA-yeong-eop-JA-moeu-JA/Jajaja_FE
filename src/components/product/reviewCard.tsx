import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { useModalStore } from '@/stores/modalStore';

import StarRating from '@/components/product/starRating';

import Heart from '@/assets/icons/heart.svg?react';
import HeartFill from '@/assets/icons/heartFill.svg?react';

type TReviewCardProps = {
  data: {
    id: number;
    imageUrl: string;
    name: string;
    date: string;
    star: number;
    likeCount: number;
    product: string;
    review: string;
    images: string[];
  };
};
export default function ReviewCard({ data }: TReviewCardProps) {
  const navigate = useNavigate();
  const { openModal } = useModalStore();
  const { id } = useParams<{ id: string }>();
  const { imageUrl, name, date, star, review, likeCount, product, images } = data;
  const [expanded, setExpanded] = useState(false);
  const [showToggle, setShowToggle] = useState(false);
  const [liked, setLiked] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    el.classList.remove('line-clamp-3');
    const fullHeight = el.scrollHeight;
    el.classList.add('line-clamp-3');
    const clampedHeight = el.clientHeight;

    setShowToggle(fullHeight > clampedHeight);
  }, [review]);
  const handleExpand = () => {
    const el = contentRef.current;
    if (!el) return;
    setExpanded((prev) => !prev);
    !expanded ? el.classList.remove('line-clamp-3') : el.classList.add('line-clamp-3');
  };
  return (
    <div className="p-2 flex flex-col gap-2">
      <section>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.75">
            <img src={imageUrl} />
            <div>
              <div className="flex items-center gap-2 text-small-regular">
                <p>{name}</p>
                <p className="text-black-4">{date}</p>
              </div>
              <div className="flex items-center gap-2 text-small-regular">
                <StarRating w={9} h={9} star={star || 0} />
                <p className="text-[#ffc800]">{star || 0}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2" onClick={() => setLiked((prev) => !prev)}>
            <p className="text-tiny-medium text-orange">{liked ? likeCount + 1 : likeCount}</p>
            {liked ? <HeartFill /> : <Heart />}
          </div>
        </div>
      </section>
      <article className="text-black-4 text-body-regular">{product}</article>
      <article ref={contentRef} className="text-body-regular">
        {review}
      </article>
      {showToggle && (
        <section>
          <button className="text-body-regular text-black-3 underline underline-offset-2 mb-2" onClick={handleExpand}>
            {expanded ? '접기' : '더보기'}
          </button>
        </section>
      )}
      <section className="flex items-center gap-2">
        {images.slice(0, 4).map((img, idx) => (
          <div key={idx} className="relative">
            <img src={img} onClick={() => openModal('image', { src: img })} />
            {idx === 3 && images.length > 4 && (
              <div
                className="flex justify-center items-center text-white text-body-regular absolute top-0 left-0 bg-[#00000099] w-full h-full"
                onClick={() => navigate(`/product/${id}/photoReview`)}
              >
                +{images.length - 3}
              </div>
            )}
          </div>
        ))}
      </section>
    </div>
  );
}
