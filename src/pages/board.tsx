import { useEffect, useState } from 'react';

import { useTeamProducts } from '@/hooks/useTeamProducts';
import { mockTeamProducts } from '@/mocks/teamRecruit';
import useUserInfo from '@/hooks/myPage/useUserInfo';

import { PageButton } from '@/components/common/button';
import ReviewCard from '@/components/product/reviewCard';
import HorizontalProductCard from '@/components/board/HorizontalProductCard';
import Header from '@/components/head_bottom/HomeHeader';
import BottomBar from '@/components/head_bottom/BottomBar';

import type { IReviewItem } from '@/types/board/reviewBoard';

export default function Board() {
  const [selectedTop2, setSelectedTop2] = useState<'review' | 'team'>('review');
  const [sortType, setSortType] = useState<'latest' | 'recommend'>('latest');
  const [reviewList, ] = useState<IReviewItem[]>([]);
  const [page, setPage] = useState(0);

  const {
    data,
    isLoading,
    isError,
    isFetched,
  } = useTeamProducts(page);

  const teamList = !data?.length || isError ? mockTeamProducts : data;

  const { data: userInfo } = useUserInfo();

  useEffect(() => {
    if (userInfo) {
      console.log('[유저 정보 응답]', userInfo);
    }
  }, [userInfo]);

  useEffect(() => {
    if (isFetched) {
      console.log('[팀 모집 API 요청 완료]', data);
    }
  }, [isFetched, data]);

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-3">
        <Header />
        <PageButton
          items={['review', 'team']}
          selected={selectedTop2}
          onSelect={(tab) => {
            setSelectedTop2(tab as 'review' | 'team');
            setPage(0);
          }}
        />
      </header>

      <div className="relative flex-1 overflow-y-auto">
        <ul
          key={selectedTop2 + sortType}
          className="absolute inset-0 bg-white px-4 py-3 flex flex-col gap-3"
        >
          {selectedTop2 === 'review' ? (
            <>
              <div className="flex justify-end text-body-regular text-black-4 mb-1">
                {[
                  { label: '최신순', value: 'latest' },
                  { label: '추천순', value: 'recommend' },
                ].map(({ label, value }, index, array) => (
                  <div key={value} className="flex items-center">
                    <button
                      onClick={() => setSortType(value as 'latest' | 'recommend')}
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
                    imageUrl: '',
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
            <>
              {isLoading ? (
                <p className="text-center text-black-3">팀 모집 목록 로딩 중...</p>
              ) : (
                teamList.map((item) => (
                  <HorizontalProductCard key={item.teamId} data={item} />
                ))
              )}
            </>
          )}
        </ul>
      </div>

      <BottomBar />
    </div>
  );
}
