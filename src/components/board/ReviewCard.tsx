import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import HeartFilled from '@/assets/icons/heartFilled.svg';
import HeartOutline from '@/assets/icons/heartOutline.svg';

type TReviewCardProps = {
  data: {
    id: number;
    user: string;
    date: string;
    stars: number;
    title: string;
    content: string;
    images: string[];
    likes: number;
    profileUrl: string;
  };
};

export default function ReviewCard({ data }: TReviewCardProps) {
  const { user, date, stars, title, content, images, likes: initialLikes, profileUrl } = data;

  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(initialLikes);

  const toggleLike = () => {
    setLiked((prev) => !prev);
    setLikes((prev) => (liked ? prev - 1 : prev + 1));
  };

  return (
    <div className="border-b border-b-1 p-2" style={{ borderBottomColor: 'var(--color-black-2)' }}>
      {/* 작성자 정보 + 좋아요 버튼 */}
      <div className="flex justify-between items-center text-sm">
        <div className="flex items-center gap-3">
          <img src={profileUrl} alt="profile" className="w-9 h-9 rounded-full object-cover" />
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-black">{user}</span>
              <span className="text-black-4 text-sm">{date}</span>
            </div>
            <div className="text-yellow-400 text-sm">
              {'★'.repeat(stars)} <span className="text-[#FFC800]">{stars}</span>
              {/**별 svg는 나중에 props id와 함께 수정 필요 */}
            </div>
          </div>
        </div>

        <motion.button onClick={toggleLike} whileTap={{ scale: 0.9 }} className="flex items-center gap-1 text-orange-500 text-sm">
          <AnimatePresence mode="wait">
            <motion.img
              key={liked ? 'filled' : 'outline'}
              src={liked ? HeartFilled : HeartOutline}
              alt="like"
              className="w-4 h-4"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
            />
          </AnimatePresence>
          {likes}
        </motion.button>
      </div>
      {/** 리뷰 제품 및 내용 - 사진은 임의로 해둔거라 안보이는게 정상입니당~ */}
      <p className="mt-2 text-sm font-medium text-black-4">{title}</p>
      <p className="mt-1 text-sm text-black line-clamp-2">{content}</p>

      {images.length > 0 && (
        <div className="mt-2 grid grid-cols-3 gap-2">
          {images.slice(0, 3).map((src, i) => (
            <img key={i} src={src} alt={`review-${i}`} className="w-full h-20 object-cover rounded-md" />
          ))}
          {images.length > 3 && <div className="w-full h-20 bg-black text-white text-sm flex justify-center items-center rounded-md">+{images.length - 3}</div>}
        </div>
      )}
    </div>
  );
}
