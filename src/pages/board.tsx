import { useState } from 'react';

import { TEAM_RECRUIT_LIST } from '@/constants/bottomBar/teamRecruit';
import { REVIEW_LIST } from '@/constants/product/reviews';

import HorizontalProductCard from '@/components/board/HorizontalProductCard';
import { PageButton, type TabId } from '@/components/common/button';
import BottomBar from '@/components/head_bottom/BottomBar';
import Header from '@/components/head_bottom/HomeHeader';
import ReviewCard from '@/components/product/reviewCard';

export default function Board() {
  const [selectedTop2, setSelectedTop2] = useState<TabId>('review');
  const [sortType, setSortType] = useState<'latest' | 'popular'>('latest');

  const sortedReviewList = [...REVIEW_LIST].sort((a, b) =>
    sortType === 'latest' ? new Date(b.date).getTime() - new Date(a.date).getTime() : b.likeCount - a.likeCount,
  );

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-3">
        <Header />
        <PageButton items={['review', 'team']} selected={selectedTop2} onSelect={setSelectedTop2} />
      </header>

      <div className="relative flex-1 overflow-y-auto">
        <ul key={selectedTop2 + sortType} className="absolute inset-0 bg-white px-4 py-3 flex flex-col gap-3">
          {selectedTop2 === 'review' ? (
            <>
              <div className="flex justify-end gap-2 text-sm text-black-4 mb-1">
                {[
                  { label: '최신순', value: 'latest' },
                  { label: '추천순', value: 'popular' },
                ].map(({ label, value }, index, array) => (
                  <div key={value} className="flex items-center">
                    <button
                      onClick={() => setSortType(value as 'latest' | 'popular')}
                      className={sortType === value ? 'font-IOrderProductListSectionProps text-black' : ''}
                    >
                      {label}
                    </button>
                    {index < array.length - 1 && <span className="px-1 text-black-2">|</span>}
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-3">
                {sortedReviewList.map((item, idx) => (
                  <div key={item.id} className="flex flex-col gap-3">
                    <ReviewCard data={item} />
                    {idx !== sortedReviewList.length - 1 && <hr className="border-black-1" />}
                  </div>
                ))}

                {sortedReviewList.length === 0 && (
                  <div className="w-full flex justify-center items-center text-body-regular text-black-4 h-20">
                    <p>아직 등록된 리뷰가 없어요.</p>
                  </div>
                )}
              </div>
            </>
          ) : (
            TEAM_RECRUIT_LIST.map((teamItem) => <HorizontalProductCard key={teamItem.id} data={teamItem} />)
          )}
        </ul>
      </div>

      <BottomBar />
    </div>
  );
}
