import { useEffect, useState } from 'react';

import type { IReviewItem} from '@/types/review';
import { TEAM_RECRUIT_LIST } from '@/constants/bottomBar/teamRecruit';
import { getReviews } from '@/apis/reviews';

import HorizontalProductCard from '@/components/board/HorizontalProductCard';
import ReviewCard from '@/components/product/reviewCard';
import { PageButton, type TabId } from '@/components/common/button';
import BottomBar from '@/components/head_bottom/BottomBar';
import Header from '@/components/head_bottom/HomeHeader';

export default function Board() {
  const [selectedTop2, setSelectedTop2] = useState<TabId>('review');
  const [sortType, setSortType] = useState<'latest' | 'popular'>('latest');
  const [reviewList, setReviewList] = useState<IReviewItem[]>([]);
  const [page, setPage] = useState(0);

  useEffect(() => {
    const fetchReviews = async () => {
      const token = localStorage.getItem('accessToken');
      //임시토큰
      if (!token) {
        console.warn('토큰 없음! 로그인 후에 API 요청 가능');
        return;
      }
      try {
        const sortQuery = sortType === 'popular' ? 'recommend' : 'latest';
        const data = await getReviews({ sort: sortQuery, page, token });

        if (data.result?.reviews) {
          setReviewList(data.result.reviews);
        } else {
          setReviewList([]);
        }
      } catch (err) {
        console.error('리뷰 불러오기 실패', err);
      }
    };

    fetchReviews();
  }, [sortType, page]);

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-3">
        <Header />
        <PageButton items={['review', 'team']} selected={selectedTop2} onSelect={(tab) => {
          setSelectedTop2(tab);
          setPage(0); // 탭 바뀔 때 페이지 초기화
        }} />
      </header>

      <div className="relative flex-1 overflow-y-auto">
        <ul key={selectedTop2 + sortType} className="absolute inset-0 bg-white px-4 py-3 flex flex-col gap-3">
          {selectedTop2 === 'review' ? (
            <>
              <div className="flex justify-end text-body-regular text-black-4 mb-1">
                {[
                  { label: '최신순', value: 'latest' },
                  { label: '추천순', value: 'popular' },
                ].map(({ label, value }, index, array) => (
                  <div key={value} className="flex items-center">
                    <button
                      onClick={() => setSortType(value as 'latest' | 'popular')}
                      className={sortType === value ? 'text-body-medium text-black' : ''}
                    >
                      {label}
                    </button>
                    {index < array.length - 1 && <span className="px-1 text-black-2">|</span>}
                  </div>
                ))}
              </div>

              {reviewList.map((item) => (
                <ReviewCard
                  key={item.review.id}
                  data={{
                    id: item.review.id,
                    imageUrl: '', // 유저 프로필 이미지 없으면 비워두기
                    name: item.review.nickname,
                    date: item.review.createDate,
                    star: item.review.rating,
                    likeCount: item.review.likeCount,
                    product: item.review.option || '',
                    review: item.review.content,
                    images: item.imageUrls,
                  }}
                />
              ))}
            </>
          ) : (
            TEAM_RECRUIT_LIST.map((item) => (
              <HorizontalProductCard key={item.id} data={item} />
            ))
          )}
        </ul>
      </div>

      <BottomBar />
    </div>
  );
}
